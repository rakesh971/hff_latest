import React, { useState, useContext, useEffect } from "react";
import Spinner from "../../../../Components/Common/Spinner/Spinner";
import Element from '../../../../Components/Admin/About/Element/Element'
import AdminAboutLayout from '../../../../Components/Admin/About/AdminAboutLayout/AdminAboutLayout'
import TextEditor from "../../../../Components/Admin/TextEditor";
import useServer from "../../../../Hooks/useServer";
import DeletePopper from '../../../../Components/Common/DeletePopper/DeletePopper'
import { useSession } from "next-auth/react";
import styles from "./History.module.scss";

const history = () => {

    const { data: session } = useSession();
    const [callApi, Loading, setLoading] = useServer();
    const [SectionData, SetSectionData] = useState();
    const [ShowDeletePopper, SetShowDeletePopper] = useState(false);
    const [DeleteItemId, SetDeleteItemId] = useState(null);
    const [Data,SetData] = useState(null)

    useEffect(() => {
        session && init()
    },[session])

    const init = async ()=>{
        let response = await callApi('pages/about', {'with': ['child', 'sections'],}, false, 'get', true,session.user.token);
        // console.log('about',response)
        if(response.error === 1) {
            SetData(response)
        }
    }

    useEffect(() => {
        if(Data){
            SetSectionData(Data.child.filter((val) => val.slug.includes("history"))[0]);
        }
    }, [Data]);

    const addElement = async () => {
        let response = await callApi(
        "info-card/create",
        { page_id: SectionData.id },
        false,
        "get",
        false,
        session.user.token
        );
        if (response.error === 1) {
        var temp = { ...Data };
        temp.child.map((val) => {
            if (val.slug.includes("history")) {
            val.cards = response.data;
            return val;
            } else {
            return val;
            }
        });
        SetData(temp);
        SetShowDeletePopper(false);
        SetDeleteItemId(null);
        }
    };

    const DeleteItem = async () => {
        let response = await callApi(
        `info-card/${DeleteItemId}`,
        { page_id: SectionData.id },
        false,
        "delete",
        false,
        session.user.token
        );
        if (response.error === 1) {
        var temp = { ...Data };
        temp.child.map((val) => {
            if (val.slug.includes("history")) {
            val.cards = response.data;
            return val;
            } else {
            return val;
            }
        });
        SetData(temp);
        SetShowDeletePopper(false);
        SetDeleteItemId(null);
        }
    };

    const onPreview = () => {
        const win = window.open("/about/history", "_blank");
        win.focus();
    };

    const UpdateItem = async (data) => {
        var formData = new FormData();
        formData.append("title", data.Name);
        formData.append("description", data.Description);
        formData.append("position", data.Date);
        formData.append("page_id", SectionData.id);
        let response = await callApi(
        `info-card/${data.id}`,
        formData,
        true,
        "put",
        true
        );
        if (response.error === 1) {
        var temp = { ...Data };
        temp.child.map((val) => {
            if (val.slug.includes("history")) {
            val.cards = response.data;
            return val;
            } else {
            return val;
            }
        });
        SetData(temp);
        SetShowDeletePopper(false);
        SetDeleteItemId(null);
        }
    };
    return (
        <AdminAboutLayout Data = {Data}>
            <div className={styles.admin_content}>
                {SectionData ? (
                    <>
                    <div className={styles.admin_content_wrapper}>
                        {SectionData.sections.map((item) => {
                        return (
                            <Element
                            key={item.id}
                            item={item}
                            id={SectionData.id}
                            Always={true}
                            />
                        );
                        })}
                        <p className={styles.stitle_outer}>History</p>
                        {SectionData.infocard && (
                        <div className={styles.ccards}>
                            {SectionData.infocard.map((item, index) => {
                            return (
                                <CardElement
                                key={item + index}
                                {...{
                                    item,
                                    index,
                                    SetShowDeletePopper,
                                    SetDeleteItemId,
                                    UpdateItem,
                                    Data : {Data},
                                    SetData : {SetData}
                                }}
                                />
                            );
                            })}
                        </div>
                        )}
                        <button
                        className={`btn ${styles.btn} ${styles.add_element}`}
                        onClick={() => {
                            addElement();
                        }}
                        >
                        <span>Add event</span>
                        <img src="/assets/icons/add_elem.svg" alt="add element" />
                        </button>
                        <div className={styles.section_btns}>
                        <button className={`btn ${styles.btn} ${styles.preview}`} onClick={onPreview}>
                            Preview
                        </button>
                        </div>
                    </div>
                    </>
                ) : (
                    <Spinner />
                )}
                {ShowDeletePopper && (
                    <DeletePopper
                    SetShowDeletePopper={SetShowDeletePopper}
                    Type="Event"
                    DeleteItem={DeleteItem}
                    />
                )}
            </div>
        </AdminAboutLayout>
    );
};

export default history;

const CardElement = ({
item,
index,
SetShowDeletePopper,
SetDeleteItemId,
UpdateItem,
Data : {Data},
SetData : {SetData}
}) => {

    const [Name, SetName] = useState(item.title || "");
    const [Date, SetDate] = useState(item.position || "");
    const [Description, SetDescription] = useState(item.description || "");
    const [CanEdit, SetCanEdit] = useState(false);

    useEffect(() => {
      if(Data){
        SetDate(item.title || "");
        SetName(item.position || "");
        SetDescription(item.description || "");
        SetCanEdit(false);
      }
    }, [Data]);

    const reset = () => {
        SetData({ ...Data });
    };

return (
    <>
        <div className={styles.sheadBord}>
            <p className={styles.secBordTitle}>Event#{index + 1}</p>
            <div className={styles.sgrp}>
            {CanEdit ? (
                <>
                <button
                    className={` btn ${styles.btn} ${styles.space} ${styles.nobord}`}
                    onClick={() => {
                    reset();
                    SetCanEdit(false);
                    }}
                >
                    cancel
                </button>
                <button
                    className={`btn ${styles.btn}`}
                    onClick={() => {
                    UpdateItem({ Name, Date, Description, id: item.id });
                    }}
                >
                    update
                </button>
                </>
            ) : (
                <>
                <button
                    className={`btn ${styles.btn} ${styles.space} ${styles.nobord}`}
                    onClick={() => {
                        SetDeleteItemId(item.id)
                        SetShowDeletePopper(true)
                    }}
                >
                    delete
                </button>
                <button
                    className={`btn ${styles.btn}`}
                    onClick={() => {
                    SetCanEdit(true);
                    }}
                >
                    edit
                </button>
                </>
            )}
            </div>
        </div>
        <div className={styles.section}>
            <div className={styles.shead}>
                <p className={styles.stitle}>Name</p>
            </div>
            <div className={styles.box_content}>
                <TextEditor
                    value={Name}
                    setData={SetName}
                    element="p"
                    elClass="text_container"
                    type="one"
                    readonly={!CanEdit}
                />
            </div>
        </div>
        <div className={styles.section}>
            <div className={styles.shead}>
                <p className={styles.stitle}>Date</p>
            </div>
            <div className={styles.box_content}>
                <TextEditor
                    value={Date}
                    setData={SetDate}
                    element="p"
                    elClass="text_container"
                    type="two"
                    readonly={!CanEdit}
                />
            </div>
        </div>
        <div className={styles.section}>
            <div className={styles.shead}>
                <p className={styles.stitle}>Description</p>
            </div>
            <div className={styles.box_content}>
                <TextEditor
                    value={Description}
                    setData={SetDescription}
                    element="p"
                    elClass="text_container"
                    type="three"
                    readonly={!CanEdit}
                />
            </div>
        </div>
    </>
);
};
