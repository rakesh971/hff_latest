import React,{useEffect,useState} from 'react'
import Head from 'next/head';
import Link from 'next/link'
import Image from '../../Components/Common/Image/Image';
import Spinner from '../../Components/Common/Spinner/Spinner';
import moment from 'moment-timezone'
import PanelLayout from '../../Components/Common/PanelLayout/PanelLayout';
import useServer from '../../Hooks/useServer'
import { useRouter } from 'next/router';
import styles from './Events.module.scss'

const events = () => {

    const router = useRouter()
	const  [callApi, Loading, setLoading ] = useServer()
    const [Data, SetData] = useState(null)
    
    useEffect(() => {
		init ()
    }, [])

	const init = async () => {
		let response = await callApi( 'website/events' , {}, false, 'get', true);
		if(response.error === 1) {
			SetData(response.data)
		}
	}

    return (
        <PanelLayout>
            <div className={styles.contains_everything}>
                {
                    Data ?
                    <div className={styles.events}>
                        <Head>
                            <title>{Data.seo_title}</title>
                            <meta property="og:title" content={Data.seo_title} />
                            <meta property="og:description" content={Data.seo_description} />
                            <meta property="og:image" content={Data.seo_image} />
                            {/* <meta property="og:url" content={Api.baseurl + location.pathname} /> */}
                            <meta property="og:site_name" content="Humanitarian Finance Forum" />
                            <meta name="twitter:title" content={Data.seo_title} />
                            <meta name="twitter:description" content={Data.seo_description} />
                            <meta name="twitter:image" content={Data.seo_image} />
                            {/* <meta name="twitter:card" content={Api.baseurl + location.pathname} /> */}
                            <meta name="twitter:image:alt" content={Data.seo_title} />
                            <meta name="title" content={Data.seo_title} />
                            <meta name="description" content={Data.seo_description} />
                            <meta name="keywords" content={Data.seo_tags} />
                        </Head>
                        <div className={styles.banner}>
                            <Image 
                                image={Data.events.background_image} 
                                className={styles.bg}
                                alt="About"
                            />
                            <div className={styles.wrapper}>
                                <div className="contain">
                                    <h1>
                                        <span>{Data.events.title}</span>
                                    </h1>
                                </div>
                            </div>
                        </div>
                        {
                            Data.annual &&
                            <div className={`${styles.annual_event} ${styles.event_lg}`}>
                                <div className="contain">
                                    <p className={styles.section_title}>Annual Event</p>
                                    <Link href={`/events/${Data.annual.id}/${Data.annual.slug}`}>
                                        <a className={styles.event_wrap}>
                                            <>
                                                <div className={styles.img_wrap}>
                                                    {/* <Image image={Data.annual.background_image} alt="showcase" /> */}
                                                </div>
                                                <div className={styles.content_wrap}>
                                                    <div>
                                                        <p className={styles.title}>{Data.annual.title}</p>
                                                        <p className={styles.text}>{Data.annual.seo_description}</p>
                                                    </div>
                                                    <p className={styles.date}>
                                                        {
                                                            Data.annual.details.start_date == Data.annual.details.end_date ?
                                                            moment(Data.annual.details.start_date).format('Do MMM YYYY') :
                                                            `${moment(Data.annual.details.start_date).format('Do')} - ${moment(Data.annual.details.end_date).format('Do MMM YYYY')}`
                                                        }
                                                        {`, ${Data.annual.details.location}`}
                                                    </p>
                                                </div> 
                                            </>
                                        </a>
                                    </Link>
                                </div>
                            </div>
                        }
                        {
                            Data.next && 
                            <div className={`${styles.next_event} ${styles.event_lg}`}>
                                <div className="contain">
                                    <div className={styles.events_head}>
                                        <p className={styles.section_title}>Next Event</p>
                                        <Link href={{pathname: '/all-events',query: { filter: 'upcoming' } }}>
                                            <a className={styles.btnlink}>
                                                <span>See All</span>
                                                <img src="/assets/icons/angle_right_color_thin.svg" alt="see all" />
                                            </a>
                                        </Link>
                                    </div>
                                    <Link href={{pathname: '/all-events'}}>
                                        <a className={styles.event_wrap}>
                                            <>
                                                <div className={styles.content_wrap}>
                                                    <div>
                                                        <p className={styles.title}>{Data.next.title}</p>
                                                        <p className={styles.text}>{Data.next.seo_description}</p>
                                                    </div>
                                                    <p className={styles.date}>
                                                        {
                                                            `${moment(Data.next.eventDetail.start_date,"Do MMM YYYY")}==${moment(Data.next.eventDetail.end_date,"YYYY Do MMM")}` ?
                                                             moment(Data.next.eventDetail.start_date,"Do MMM YYYY").format('Do MMM YYYY') :
                                                            `${moment(Data.next.eventDetail.start_date,"Do MMM YYYY").format('Do')} - ${moment(Data.next.eventDetail.end_date).format('Do MMM YYYY')}`
                                                        }
                                                        {`, ${Data.next.eventDetail.location}`}
                                                    </p>
                                                </div>
                                                <div className={styles.img_wrap}>
                                                    <Image image={Data.next.background_image} alt="showcase" />
                                                </div>  
                                            </>
                                        </a>
                                    </Link>
                                </div>
                            </div>
                        }
                        <div className={styles.past_events}>
                            <div className="contain">
                                <div className={styles.events_head}>
                                    <p className={styles.section_title}>Past Events</p>
                                    <Link href={{pathname: '/all-events',query: { filter: 'past' } }}>
                                        <a className={styles.btnlink}>
                                            <span>See All</span>
                                            <img src="/assets/icons/angle_right_color_thin.svg" alt="see all" />
                                        </a>
                                    </Link>
                                </div>
                                <div className={styles.wrapper}>
                                    {
                                        Data.past.map(item => {
                                            return (
                                                <Link href={`/events/${item.slug}`} key={item.slug}>
                                                    <a className={styles.event_box}>
                                                        <>
                                                            <Image image={item.background_image} alt={item.title} />
                                                            <div className={styles.event_wrapper}>
                                                                <div className={styles.event_info}>
                                                                    <p className={styles.title}>{item.title}</p>
                                                                    <p className={styles.text}>{item.seo_description}</p>
                                                                </div>
                                                                <div className={styles.event_meta}>
                                                                    <p className={styles.date}>
                                                                    {
                                                                        `${moment(item.eventDetail.start_date,"Do MMM YYYY")}==${moment(item.eventDetail.end_date,"YYYY Do MMM")}` ?
                                                                        moment(item.eventDetail.start_date,"Do MMM YYYY").format('Do MMM YYYY') :
                                                                        `${moment(item.eventDetail.start_date,"Do MMM YYYY").format('Do')} - ${moment(item.eventDetail.end_date).format('Do MMM YYYY')}`
                                                                    }
                                                                    </p>
                                                                    <p className={styles.cat} style={{background: item.eventDetail.type_color}}>{item.eventDetail.type}</p>
                                                                </div>
                                                            </div>
                                                        </>
                                                    </a>
                                                </Link>
                                            )
                                        })
                                    }
                                </div>
                            </div>
                        </div>
                    </div> : <Spinner />
                }
            </div>
        </PanelLayout>
    )
}

export default events

