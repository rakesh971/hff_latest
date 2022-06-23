import React, { useEffect, useState } from 'react'
import PanelLayout from '../../../Common/PanelLayout/PanelLayout'
import BasicInformation from '../BasicInformation/BasicInformation'
import Details from '../Details/Details'
import EventSeo from '../EventSeo/EventSeo'
import useServer from '../../../../Hooks/useServer'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { toast } from 'react-toastify'
import { useSession } from 'next-auth/react';
import moment from 'moment-timezone';
import styles from './EventsManage.module.scss'


const EventsManage = ({Type, eventId, eventSlug}) => {

    const router = useRouter();
    const {data:session} = useSession()
    const [callApi, Loading, setLoading] =useServer()
    const [SelectedTab, SetSelectedTab] = useState('basic');
    const [Data,SetData] = useState(null)
    const [FirstRender,SetFirstRender] = useState(true)

    const AddData = async (data) => {
        var formData = new FormData();
        formData.append('title', data.Title);
        formData.append('header', data.Text);
        formData.append('location', data.OptionLocationSelected);
        formData.append('type', data.OptionTypeSelected.data);
        formData.append('type_color', data.OptionTypeSelected.type_color);
        ImageData && formData.append('page_background', data.ImageData);
        formData.append('start_date', moment(data.RangeDate[0].startDate).format('YYYY-MM-DD'));
        formData.append('end_date',  moment(data.CalendarType === 'multiple' ? data.RangeDate[0].endDate : data.RangeDate[0].startDate).format('YYYY-MM-DD'));
        formData.append('start_time', `${data.TimeStartData.hours.filter(val => val.selected).map(val=>val.text)[0]}:${data.TimeStartData.minutes.filter(val => val.selected).map(val=>val.text)[0]}`);
        formData.append('end_time', `${data.TimeEndData.hours.filter(val => val.selected).map(val=>val.text)[0]}:${data.TimeEndData.minutes.filter(val => val.selected).map(val=>val.text)[0]}`);
        formData.append('with[]', 'eventDetail');
        let response = await callApi("events-api", formData, false, 'post', true,session.user.token)
        if(response.error === 1) {
            var newData = response.data.result.data[0]
            let responseTwo = await callApi(`events-api/${newData.id}`, {with: ['eventDetail', 'infocard', 'sections'],}, false, 'get', false, session.user.token);

            if(responseTwo.error === 1) {
                router.replace({
                    pathname: `/admin/events/list/edit/${responseTwo.data.id}/${responseTwo.data.slug}`,
                })
            }
        } 
    }
 
    const UpdateData = async (data) => {
        var formData = new FormData();
        formData.append('title', data.Title);
        formData.append('header', data.Text);
        data.OptionLocationSelected && formData.append('location', data.OptionLocationSelected);
        data.OptionTypeSelected && formData.append('type', data.OptionTypeSelected.data);
        data.OptionTypeSelected && formData.append('type_color', data.OptionTypeSelected.type_color);
        data.ImageData && formData.append('page_background', data.ImageData);
        formData.append('start_date', moment(data.RangeDate[0].startDate).format('YYYY-MM-DD'));
        formData.append('end_date',  moment(data.CalendarType === 'multiple' ? data.RangeDate[0].endDate : data.RangeDate[0].startDate).format('YYYY-MM-DD'));
        formData.append('start_time', `${data.TimeStartData.hours.filter(val => val.selected).map(val=>val.text)[0]}:${data.TimeStartData.minutes.filter(val => val.selected).map(val=>val.text)[0]}`);
        formData.append('end_time', `${data.TimeEndData.hours.filter(val => val.selected).map(val=>val.text)[0]}:${data.TimeEndData.minutes.filter(val => val.selected).map(val=>val.text)[0]}`);
        formData.append('with[]', 'eventDetail');
        let response = await callApi(`events-api/${router.query.id}`, formData, true, 'put', true,session.user.token)
        if(response.error === 1) {
            response.data.result.data.map(val => {
                val.id === Data.id && SetData(val)
            })
        }
    }

    useEffect(() => {
        if(eventId && FirstRender && session && router.isReady) {
            getEventData(eventId, session)
            SetFirstRender(false)
        }
    }, [session, eventId,router])

    const getEventData = async (id, session) => {
        let response = await callApi(`events-api/${id}`,{ with:['eventDetail','infocard','sections'] }, false, 'get', false, session.user.token)
        if(response.error === 1) {
            response.data.id == router.query.id && SetData(response.data)
        }
    }

    const UpdateOverview = async (overview, desc, call_to_action)=>{
        var formData = new FormData();
        formData.append('with[]', 'eventDetail');
        formData.append('overview', overview);
        formData.append('seo_description', desc);
        formData.append('call_to_action', call_to_action);
        let response = await callApi(`events-api/${router.query.id}/update-overview`, formData, true, 'post', true,session.user.token);
        console.log('upov',response)
        if(response.error === 1){
             response.data.result.data.map(val => {
                val.id === Data.id && SetData(val)
            })
        }
    }

    return (
        <PanelLayout>
            <div className={styles.contains_everything}>
                <div className="contain">
                    <div className={`${styles.admin_container} ${styles.var} ${styles.space_top}`}>
                        <div className={styles.custom_crumbs}>
                            <div className={ `contain ${styles.add_spaces}`}>
                                <ul>
                                    <li>
                                        <Link href='/admin/events/list'>
                                            <a className={styles.active}>Events</a>
                                        </Link>
                                        <img src="/assets/icons/angle_right_dark.svg" alt="angle_right" />
                                    </li>
                                    {
                                        Type === 'edit' &&
                                        <li>
                                            <Link href={`/admin/events/`}>
                                                <a className={styles.active}>
                                                    {Data && Data.title}
                                                </a>
                                                </Link>
                                            <img src="/assets/icons/angle_right_dark.svg" alt="angle_right" />
                                        </li>
                                    }
                                    <li style={{textTransform: 'capitalize'}}>{Type}</li>
                                </ul>
                            </div>
                        </div>
                        <div className={`${styles.content_edit_area} ${styles.min}`}>
                            <div className={styles.content_tabs}>
                                <button 
                                    className={`btn ${styles.btn} ${SelectedTab === 'basic' ? styles.active : ''}`}
                                    onClick={() => SetSelectedTab('basic')}
                                >
                                    <span>1</span>
                                    Basic Information
                                </button>
                                <button 
                                    className={`btn ${styles.btn} ${SelectedTab === 'details' ? styles.active : ''}`}
                                    onClick={() => {
                                        if(Type === 'edit') {
                                            SetSelectedTab('details')
                                        } else {
                                            toast('Complete Basic Information to edit Details', {
                                                position: "bottom-center",
                                                type: "success",
                                                autoClose: 1500,
                                                hideProgressBar: true,
                                                closeOnClick: true,
                                                pauseOnHover: true,
                                                draggable: true,
                                                progress: undefined,
                                            })
                                        }
                                    }}
                                >
                                    <span>2</span>
                                    Details
                                </button>
                                <button 
                                    className={`btn ${styles.btn} ${SelectedTab === 'seo' ? styles.active : ''}`}
                                    onClick={() => {
                                        if(Type === 'edit') {
                                            SetSelectedTab('seo')
                                        } else {
                                            toast('Complete Basic Information to edit SEO', {
                                                position: "bottom-center",
                                                type: "success",
                                                autoClose: 1500,
                                                hideProgressBar: true,
                                                closeOnClick: true,
                                                pauseOnHover: true,
                                                draggable: true,
                                                progress: undefined,
                                            })
                                        }
                                    }}
                                >
                                    <span>3</span>
                                    SEO
                                </button>
                            </div>
                            {
                                SelectedTab === 'basic' && 
                                <BasicInformation data={Data} type={Type} UpdateData={Type === 'edit' ? UpdateData : AddData} />
                            }
                            {
                                SelectedTab === 'details' &&
                                <Details data={Data} UpdateData={UpdateOverview} />
                            }
                            {
                                SelectedTab === 'seo' &&
                                <EventSeo data={Data} />
                            }
                        </div>
                    </div>
                </div>
            </div>
        </PanelLayout>
    )
}

export default EventsManage