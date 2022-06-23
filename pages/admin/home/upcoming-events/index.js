import React, {useState,useEffect} from 'react'
import Spinner from "../../../../Components/Common/Spinner/Spinner";
import Image from '../../../../Components/Common/Image/Image';
import useServer from '../../../../Hooks/useServer'
import { useSession } from 'next-auth/react' 
import InjectHTML from '../../../../Components/Common/InjectHTML/InjectHTML';
import UpcomingSelectPopper from '../../../../Components/Admin/Home/UpcomingEvents/UpcomingSelectPopper'
import HomeLayout from '../../../../Components/Admin/Home/HomeLayout/HomeLayout'
import styles from './upcomigEvents.module.scss'

const UpcomingEvents = () => {
    
    const {data:session} = useSession()
    const [callApi, Loading, setLoading ] = useServer()
    const [ShowPopper, SetShowPopper] = useState(false)
    const [Id, SetId] = useState(null)
    const [Index, SetIndex] = useState(null)
    const [Events, SetEvents] = useState(null)
    const [Data, SetData] = useState(null)

    useEffect(() => {
        session && init()
    },[session,ShowPopper])

    
    useEffect(() => {
        session && comingEvent()
    },[session])

    const comingEvent = async ()=>{
        let response = await callApi('pages/home', {'with': ['sections', 'infocard']}, false, 'get', false, session.user.token);
        if(response.error === 1) {
            SetData(response)
        }
    }

    const init = async () => {
        let response = await callApi('home-data', {type:"upcoming"}, false, 'get', false,session.user.token);
        if(response.error === 1){
            SetEvents(response.data)
        }
    }

    const AddSlot = () => {
        console.log('pressed')
        SetShowPopper(true)
    }

    const DeleteItem = async (id) => {
        let response =  await callApi(`home-data/${id}`, {type: 'upcoming'}, false, 'delete', false ,session.user.token)
        if(response.error === 1){
            SetEvents(response.data)
        }
    }

    return (
        <HomeLayout Data={Data} >
              <div className={styles.admin_content}>
                    {
                        Events ?
                        <div className={styles.admin_content_wrapper}>
                            {
                                Events.map((item, index) => {
                                    return(
                                        <div className={styles.section} key={item.id}>
                                            <div className={`${styles.shead} ${styles.lg}`} >
                                                <p className={styles.stitle}>Upcoming {index + 1}</p>
                                                <div className={styles.sgrp}>
                                                    <button 
                                                        className={`btn ${styles.btn} ${styles.space} ${styles.nobord}`}
                                                        onClick={() => {
                                                            DeleteItem(item.id)
                                                            console.log('d',item.id)
                                                        }}
                                                    >
                                                        Delete
                                                    </button>
                                                    <button 
                                                        className={`btn ${styles.btn}`}
                                                        onClick={() => {
                                                            SetId(item.id)
                                                            SetIndex(index)
                                                            SetShowPopper(true)
                                                        }}
                                                    >
                                                        Replace
                                                    </button>
                                                </div>
                                            </div>
                                            <div className={styles.box_content}>
                                                <div className={styles.event_box}>
                                                    <div className={styles.event_img_wrap}>
                                                        <Image image={item.page.background_image}  alt={item.page.title} />
                                                        <p className={styles.abs} style={{background: item.page.eventDetail.type_color}}>{item.page.eventDetail.type}</p>
                                                    </div>
                                                    <div className={styles.event_content}>
                                                        <div className={styles.event_content_inner}>
                                                            <p className={styles.sub}>Event</p>
                                                            <p className={styles.event_title}>{item.page.title}</p>
                                                            <p className={styles.event_text}>
                                                                <InjectHTML html={item.page.eventDetail.overview} />
                                                            </p>
                                                        </div>
                                                        <p className={styles.date}>{item.page.eventDetail.date}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                            <button
                                className={`btn ${styles.btn} ${styles.add_element}`}
                                onClick ={()=>{
                                    AddSlot()
                                }}
                            >
                                <span>Add event</span>
                                <img src="/assets/icons/add_elem.svg" alt="add element" />
                            </button>
                        </div>:<Spinner/>
                    }
                </div>
                {
                    ShowPopper &&
                    <UpcomingSelectPopper SetShowPopper={SetShowPopper} type="upcoming" Id={Id} SetId={SetId} />
                }
        </HomeLayout>
    )
}

export default UpcomingEvents