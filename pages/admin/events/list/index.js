import React, {useState, useEffect, useRef} from 'react'
import Link from 'next/link'
import useServer from "../../../../Hooks/useServer";
import Spinner from "../../../../Components/Common/Spinner/Spinner";
import EventsLayout from '../../../../Components/Admin/Events/EventsLayout/EventsLayout'
import DeletePopper from '../../../../Components/Common/DeletePopper/DeletePopper'
import InjectHTML from '../../../../Components/Common/InjectHTML/InjectHTML';
import Image from '../../../../Components/Common/Image/Image';
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router';
import styles from './events.module.scss'

const index = () => {

    const router = useRouter()
    const {data:session} = useSession()
    const [callApi,Loading,setLoading] =useServer()
    const [IsAvailable, SetIsAvailable] = useState(null)
    const [Config, SetConfig] = useState(null)
    const [IsDisabled, SetIsDisabled] = useState(false)
    const [Events, SetEvents] = useState(null)
    const [ShowDeletePopper, SetShowDeletePopper] = useState(false)
    const [DeleteItemId, SetDeleteItemId] = useState(null)
    const [Data,SetData] = useState()
    const buttonRef = useRef(null)

    useEffect(()=>{
        session && init()
    },[session])
    
    const init = async ()=>{
        let response = await callApi('pages/about', {'with': ['child', 'sections'],}, false, 'get', true,session.user.token);
        if(response.error === 1) {
            SetData(response)
        }
    }
    
    useEffect(() => {
        Events === null && session && eventLoad()
        document.addEventListener('click', handleClickOutside, true);
        return () => {
            document.removeEventListener('click', handleClickOutside, true);
        };
    }, [Events,session])

    const eventLoad = async () =>{
        let response = await callApi('events-api',{'with[]':'eventDetail',...Config}, false, 'get', false,session.user.token);
        if(response.error === 1) {
            response.data.result.data.map(val => {
                val.canEdit = false;
                return val
            })
            
            SetIsAvailable(response.data.result.meta.last_page > response.data.result.meta.current_page ? parseInt(response.data.result.meta.current_page)+1 :false)
            SetEvents(response.data.result.data)
            SetShowDeletePopper(false)
            SetDeleteItemId(null)
        }
    }
    
    const handleClickOutside = (event) => {
        if (buttonRef.current && !buttonRef.current.contains(event.target)) {
            let temp = [...Events]
            temp.map(val => {
                val.canEdit = false
                return val
            })
            SetEvents(temp)
        }
    };

    const openDrop = (e, item) => {
        e.stopPropagation();
        let temp = [...Events]
        temp.map(val => {
            if(val.id === item.id) {
                val.canEdit = true
                return val
            } else {
                val.canEdit = false
                return val
            }
        })
        SetEvents(temp)
    }
    
    useEffect(() => {
        if(Config && session){
            load()
        }
    }, [Config,session])

	const load = async () =>{
		SetIsDisabled(false)
		let response = await callApi ("events-api",{'with[]':'eventDetail',...Config} , false, 'get', false,session.user.token);
		if(response.error === 1) {
			response.data.result.data.map(val => {
				val.canEdit = false;
				return val
			})
			SetIsAvailable(response.data.result.meta.last_page > response.data.result.meta.current_page ? parseInt(response.data.result.meta.current_page)+1 :false)
			let events = [...Events];
			response.data.result.data.map(n=>{events.push(n);return n;});
			SetEvents(events);
			SetShowDeletePopper(false)
			SetDeleteItemId(null)
		}
	}

    const DeleteItem = async () => {
		SetIsDisabled(false)
        let response = await callApi(`pages/${DeleteItemId}`, {page_id: '11',  with: ['child.eventDetail']}, false, 'delete', false,session.user.token);
		if(response.error === 1) {
			response.child.map(val => {
				val.canEdit = false;
				return val
			})
			SetEvents(response.child)
			SetShowDeletePopper(false)
			SetDeleteItemId(null)
		}

    }

    const SetFlag = async (id, type) => {
		SetIsDisabled(false)
        let response = await callApi(`events-api/${id}/set`, {page_id: '11', 'with[]': 'eventDetail',flag:type}, false, 'get', false,session.user.token);
		if(response.error === 1) {
			response.data.result.data.map(val => {
				val.canEdit = false;
				return val
			})
			
			SetIsAvailable(response.data.result.meta.lastPage > response.data.result.meta.current_page ? parseInt(response.data.meta.result.current_page)+1 :false)
			SetEvents(response.data.result.data)
			SetShowDeletePopper(false)
			SetDeleteItemId(null)
		}
    }

    return (
        <EventsLayout Data = {Data}>
            <div className={styles.admin_content}>
                {
                    Events ?
                    <>
                        <Link	
                            key={Events.id} 
                            href="/admin/events/list/add">
                            <a className={`${styles.add} ${styles.btn_lg_add}`}>
                                Add New Event
                            </a>
                        </Link>
                        <div className={styles.admin_content_wrapper}>
                            {
                                Events.map((item,index) =>{
                                    return(
                                        <div className={`${styles.section} ${styles.bord} ${styles.nomarg}`} key={item.id}>
                                            <div className={styles.box_content}>
                                                <div className={`${styles.event_box} ${styles.pad}`}>
                                                    <div className={styles.event_img_wrap}>
                                                        {/* <Image image={item.background_image} alt={item.title} /> */}
                                                        <p className={styles.abs} style={{background: item.eventDetail.type_color}}>{item.eventDetail.type}</p>
                                                    </div>
                                                    <div className={styles.event_content}>
                                                        <div className={styles.event_content_inner}>
                                                            <div className={styles.event_content_inner_head}>
                                                                <p className={styles.sub}>Event</p>
                                                                <div className={styles.anual}>
                                                                    {
                                                                        !item.eventDetail.is_annual == 0 &&
                                                                        <p className={`${styles.annual} ${styles.center}`}>Annual</p>
                                                                    }
                                                                    {
                                                                        !item.eventDetail.is_next == 0 &&
                                                                        <p className={`${styles.annual} ${styles.center} ${styles.space}`}>Next</p>
                                                                    }
                                                                </div>
                                                            </div>
                                                            <p className={styles.event_title}>{item.title}
                                                                {/* <InjectHTML html={item.header} /> */}
                                                            </p>
                                                            <p className={styles.event_text}>
                                                                {    
                                                                    item.eventDetail.overview ?
                                                                    <InjectHTML html={item.eventDetail.overview} /> : 'No Overview available'
                                                                }
                                                            </p>
                                                        </div>
                                                        <div className={styles.edit_wrap}>
                                                            <p className={styles.date}>
                                                                {item.eventDetail.start_date + ','} 
                                                                <InjectHTML html={item.eventDetail.location} />
                                                            </p>
                                                            <div className={styles.btn_wrap}>
                                                                <button 
                                                                    className={styles.btn}
                                                                    onClick={e => {
                                                                        openDrop(e, item)
                                                                    }}
                                                                >
                                                                    <img src="/assets/icons/dots_hor.svg" alt="dots" />
                                                                </button>
                                                                {
                                                                    item.canEdit &&
                                                                    <ul className={styles.btn_wrap_menu} ref={buttonRef}>
                                                                        <li>
                                                                            <button 
                                                                                className={styles.btn}
                                                                                onClick={() => {
                                                                                    SetFlag(item.id, 'annual')
                                                                                }}
                                                                            >
                                                                                {
                                                                                    !item.eventDetail.is_annual == 1 ?
                                                                                    'Set as Annual' : 'Remove as Annual'
                                                                                }
                                                                            </button>
                                                                        </li>
                                                                        <li>
                                                                            <button 
                                                                                className={styles.btn}
                                                                                onClick={() => {
                                                                                    SetFlag(item.id, 'next')
                                                                                }}
                                                                            >
                                                                                {
                                                                                    !item.eventDetail.is_next == 1 ?
                                                                                    'Set as Next' : 'Remove as Next'
                                                                                }
                                                                            </button>
                                                                        </li>
                                                                        <li>
                                                                            <Link  href={`/admin/events/all/edit/${item.id}/${item.slug}`}
                                                                            >
                                                                                <a className={styles.btn}>
                                                                                    Edit
                                                                                </a>
                                                                            </Link>
                                                                        </li>
                                                                        <li>
                                                                            <button 
                                                                                className={styles.btn}
                                                                                onClick={(e) => {
                                                                                    e.stopPropagation();
                                                                                    SetDeleteItemId(item.id)
                                                                                    SetShowDeletePopper(true)
                                                                                }}
                                                                            >Delete</button>
                                                                        </li>
                                                                    </ul>
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                            {
                                IsAvailable && <div className={`${styles.section_btns} ${styles.space_top}`}>
                                    <button onClick={(e) => {SetConfig({ ...Config, page: IsAvailable });SetIsDisabled(true)}} disabled={IsDisabled} className={`${styles.btn} ${styles.preview} ${styles.orange}`}>Load More</button>
                                </div>
                            }
                        </div>
                    </> : <Spinner />
                }
                {
                    ShowDeletePopper &&
                    <DeletePopper SetShowDeletePopper={SetShowDeletePopper} Type="Event" DeleteItem={DeleteItem} />
                }
            </div>
        </EventsLayout>
    )
}

export default index