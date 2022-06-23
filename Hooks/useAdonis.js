import { useState, useEffect } from "react";
import { Api } from "../Common/Api";
import Ws from "@adonisjs/websocket-client";

let chatId = 0;

const useAdonis = () => {
    const [Socket, SetSocket] = useState(null);
    const [SocketConnected, SetConnected] = useState(false);
    const [SocketData, SetSocketData] = useState([]);
    const [SocketMap, SetSocketMap] = useState(new Map());
    const [NewMessageId, SetNewMessageId] = useState({ id: 0, ticketid: 0 });
    const [UserID, SetUserID] = useState(null);

    const IntializeConnection = async (token, userInfo) => {
        SetUserID(userInfo);
        const ws = Ws(Api.socketurl);
        ws.withJwtToken(token).connect();
        ws.on("open", () => {
            console.log("web adonis connected");
            SetSocket(ws);
            SetConnected(true);
        });
        ws.on("error", (err) => {
            SetSocketData([]);
            SetSocketMap(new Map());
            console.log("web adonis error", err);
            SetConnected(false);
        });
        ws.on("close", (err) => {
            SetSocketData([]);
            SetSocketMap(new Map());
            console.log("close socket error", err);
            SetConnected(false);
        });
        ws.on("disconnect", (err) => {
            console.log("disclose socket error", err);
            SetConnected(false);
        });
    };

    const updateTopic = (topic, socket, data) => {
        SetSocketData((prev) => {
            let found = false;
            let tempPrev = JSON.parse(JSON.stringify(prev));
            for (let i = 0; i < tempPrev.length; i++) {
                console.log("topic", tempPrev[i].topic, topic, tempPrev);
                if (tempPrev[i].topic == topic) {
                    found = true;
                    //check if data has message
                    //else replace entire data of the state
                    if (tempPrev[i].data && tempPrev[i].data.messages) {
                        //check if message recived has page 1
                        //if 1 replace data
                        //else if greater than 1 append messages object
                        if (data.messages.page == 1) {
                            tempPrev[i].data = data;
                        } else {
                            tempPrev[i].data.messages.data = [...tempPrev[i].data.messages.data, ...data.messages.data];
                            tempPrev[i].data.messages.page = data.messages.page;
                            tempPrev[i].data.messages.lastPage = data.messages.lastPage;
                        }
                    } else if (data.data && Array.isArray(data.data)) {
                        if (data.page == 1) {
                            tempPrev[i].data = data;
                        } else {
                            tempPrev[i].data.data = [...tempPrev[i].data.data, ...data.data];
                            tempPrev[i].data.page = data.page;
                            tempPrev[i].data.lastPage = data.lastPage;
                        }
                    } else {
                        tempPrev[i].data = data;
                    }
                }
            }
            if (!found) {
                let newobj = { topic, data };
                SetSocketMap(SocketMap.set(topic, socket));
                tempPrev.push(newobj);
            }
            return tempPrev;
        });
    };

    const SubscribeTo = (Topic, listenTopic, emitTopic, data, topicType = "") => {
        if (SocketConnected) {
            let Convos = Socket.getSubscription(Topic);
            if (!Convos) {
                Convos = Socket.subscribe(Topic);
            }
            Convos.on("ready", () => {
                updateTopic(Topic, Convos, {});
                console.log("emitted", emitTopic, data);
                if (emitTopic) {
                    Convos.emit(emitTopic, data);
                }
            });
            Convos.on("error", (msg) => {
                console.log(msg, "Socket buddies err");
            });
            Convos.on("close", (msg) => {
                console.log(msg, "close event");
            });
            Convos.on("disconnect", (msg) => {
                console.log(msg, "disclose event");
            });
            if (Array.isArray(listenTopic)) {
                listenTopic.forEach((item) => {
                    console.log("connected to " + Topic + "listening topic " + item);
                    Convos.on(item, (msg) => {
                        if (msg && msg.error == 1) {
                            updateTopic(Topic + "$" + item, Convos, msg.data);
                        }
                        console.log(msg, "Frecieved from " + Topic + "listening topic " + item);
                    });
                });
            } else {
                Convos.on(listenTopic, (msg) => {
                    if (msg && msg.error == 1) {
                        updateTopic(Topic, Convos, msg.data);
                    } else if (msg && msg.ticket) {
                        updateTopic(Topic, Convos, msg.ticket);
                    }
                    console.log(msg, "Frecieved from " + Topic + "listening topic " + listenTopic);
                });
            }

            if (topicType) {
                Convos.on("message", newMessage);
                Convos.on("status", statusUpdate);
                Convos.on("typing", TypingMessage);
            }
            if(topicType == "user"){
                Convos.on("supportJoined", (Data)=>{
                    console.log(Data,"support joined lisnteing")
                });
            }
        }
    };

    const newMessage = (MessageData) => {
        console.log("MessageData", MessageData);
        SetSocketData((prev) => {
            let tempPrev = JSON.parse(JSON.stringify(prev));
            for (let i = 0; i < tempPrev.length; i++) {
                if (tempPrev[i].topic == "tickets") {
                    for (let j = 0; j < tempPrev[i].data.data.length; j++) {
                        if (MessageData.data.ticket_id && tempPrev[i].data.data[j].id == MessageData.data.ticket_id) {
                            console.log(MessageData.data.ticket_id, "ticketID loop");
                            tempPrev[i].data.data[j].message_data = MessageData.data;
                            if (MessageData.ticket) {
                                tempPrev[i].data.data[j].solved = MessageData.ticket.solved;
                                tempPrev[i].data.data[j].rating = MessageData.ticket.rating;
                            }
                            if (MessageData.data.user_id != UserID && MessageData.data.ticket_id != chatId) {
                                tempPrev[i].data.data[j].messages_count = parseInt(tempPrev[i].data.data[j].messages_count) + 1;
                            }
                        }
                    }
                    let ticketID = null;
                    if (MessageData.ticket && MessageData.ticket.id) {
                        ticketID = MessageData.ticket.id;
                    } else if (MessageData.data && MessageData.data.ticket_id) {
                        ticketID = MessageData.data.ticket_id;
                    }
                    console.log(ticketID, "ticketID");
                    if (ticketID) {
                        let tempData = [...tempPrev[i].data.data];
                        let foundTicket = tempData.find((item) => item.id == MessageData.data.ticket_id);
                        if (foundTicket) {
                            const newData = [foundTicket, ...tempData.filter((item) => item.id != MessageData.data.ticket_id)];
                            tempPrev[i].data.data = newData;
                        }
                    }
                }
                if (MessageData.data.ticket_id && tempPrev[i].topic == "ticket:" + MessageData.data.ticket_id) {
                    if (MessageData.data.ticket_id) {
                        tempPrev[i].data.messages.data = [MessageData.data, ...tempPrev[i].data.messages.data];
                    }
                    if (MessageData.ticket) {
                        console.log("ticket closed 2");
                        tempPrev[i].data.solved = MessageData.ticket.solved;
                        tempPrev[i].data.rating = MessageData.ticket.rating;
                    }
                }
            }

            return tempPrev;
        });
        if (MessageData.data && MessageData.data.id) {
            console.log(MessageData.data.user_id, UserID);
            if (MessageData.data.user_id != UserID) {
                console.log("in");
                let stat = false;
                if (chatId == MessageData.data.ticket_id) {
                    stat = true;
                }

                sendRecivedMessageEvent(MessageData.data.id, stat);
            }
            setTimeout(() => {
                SetNewMessageId({ id: MessageData.data.id, ticketid: MessageData.data.ticket_id });
            }, 100);
        }
    };
    const sendRecivedMessageEvent = (MessageId, stat) => {
        console.log("recived sent", MessageId);
        SocketMap.get("tickets").emit("receivedMessage", {
            is_seen: stat,
            message_id: MessageId,
        });
    };

    const setSelectedChatId = (id) => {
        chatId = id;
    };

    const statusUpdate = (statsMessages) => {
        console.log("stats chage", statsMessages);
        if (statsMessages.error == 1 && statsMessages.ticket) {
            let key = "ticket:" + statsMessages.ticket.id;

            SetSocketData((prev) => {
                let tempPrev = [...prev];

                for (let i = 0; i < tempPrev.length; i++) {
                    if (tempPrev[i].topic == "tickets") {
                        for (let j = 0; j < tempPrev[i].data.data.length; j++) {
                            if (tempPrev[i].data.data[j].id == statsMessages.ticket.id) {
                                tempPrev[i].data.data[j].typing = false;
                                statsMessages.data.forEach((item) => {
                                    if (tempPrev[i].data.data[j].message_data.id == item) {
                                        tempPrev[i].data.data[j].message_data.is_seen = statsMessages.is_seen ? 1 : 0;
                                        if (statsMessages.is_seen) {
                                            tempPrev[i].data.data[j].messages_count = 0;
                                        }
                                    }
                                });
                                break;
                            }
                        }
                    }

                    if (tempPrev[i].topic == key && tempPrev[i].data && tempPrev[i].data.messages) {
                        for (let j = 0; j < tempPrev[i].data.messages.data.length; j++) {
                            statsMessages.data.forEach((item) => {
                                if (item == tempPrev[i].data.messages.data[j].id) {
                                    tempPrev[i].data.messages.data[j].is_seen = statsMessages.is_seen ? 1 : 0;
                                }
                            });
                        }
                    }
                }

                return tempPrev;
            });
        }
    };
    const TypingMessage = (TypingData) => {
        //console.log("my typing", TypingData);
        ChangeTypingStatus(TypingData.data.ticket, true);

        setTimeout(() => {
            ChangeTypingStatus(TypingData.data.ticket, false);
        }, 3000);
    };

    const ChangeTypingStatus = (ticketId, stat) => {
        SetSocketData((prev) => {
            let tempPrev = [...prev];

            for (let i = 0; i < tempPrev.length; i++) {
                if (tempPrev[i].topic == "tickets") {
                    for (let j = 0; j < tempPrev[i].data.data.length; j++) {
                        if (tempPrev[i].data.data[j] && tempPrev[i].data.data[j].id == ticketId) {
                            tempPrev[i].data.data[j].typing = stat;
                            break;
                        }
                    }
                }
            }

            return tempPrev;
        });
    };

    return [Socket, SocketConnected, IntializeConnection, SubscribeTo, SocketData, SocketMap, NewMessageId, setSelectedChatId, sendRecivedMessageEvent];
};

export default useAdonis;
