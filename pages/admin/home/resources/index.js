import React, {useState,useEffect} from 'react'
import Spinner from "../../../../Components/Common/Spinner/Spinner";
import Image from '../../../../Components/Common/Image/Image';
import useServer from '../../../../Hooks/useServer'
import InjectHTML from '../../../../Components/Common/InjectHTML/InjectHTML';
import NewsSelectPopper from '../../../../Components/Admin/Home/LatestNews/NewsSelectPopper'
import HomeLayout from '../../../../Components/Admin/Home/HomeLayout/HomeLayout'
import { useSession } from 'next-auth/react'
import moment from 'moment-timezone'
import styles from './resources.module.scss'

const resources = () => {
	const {data:session} = useSession()
	const [callApi, Loading, setLoading ] = useServer()
	const [News, SetNews] = useState(null)
	const [ShowPopper, SetShowPopper] = useState(false)
	const [Id, SetId] = useState(null)
    const [Index, SetIndex] = useState(null)
    const [Data, SetData] = useState(null)

    useEffect(() => {
        session && init()
    },[session,ShowPopper])

    
    useEffect(() => {
        session && count()
    },[session])

    const count = async ()=>{
        let response = await callApi('pages/home', {'with': ['sections', 'infocard']}, false, 'get', false, session.user.token);
        if(response.error === 1) {
            SetData(response)
        }
    }

    const init = async ()=>{
        let response = await callApi('home-data',{type:'news'}, false, 'get', false,session.user.token)
        if(response.error === 1) {
        SetNews(response.data)
        }
    }

	return (
		<HomeLayout Data= {Data}>
            <div className={styles.admin_content}>
                <div className={styles.admin_content_wrapper}>
                    {
                        News ?
                        News.map((item, index) => {
                            // console.log(item)
                            return (
                                <div className={styles.section} key={item.id}>
                                    <div className={`${styles.shead} ${styles.lg}`}>
                                        <p className={styles.stitle}>Resource {index + 1}</p>
                                        <button 
                                            className={`btn ${styles.btn}`}
                                            onClick={() => {
                                                SetId(item.id)
                                                SetIndex(index)
                                                SetShowPopper(true)
                                            }}
                                        >
                                            {
                                                item.page ? 'Replace' : 'Add'
                                            } 
                                        </button>
                                    </div>
                                    {
                                        item.page &&
                                        <div className={styles.box_content}>
                                            <div className={styles.news_box}>
                                                <div className={styles.news_img_wrap}>
                                                    <Image image={item.page.background_image} alt={item.page.title} />
                                                </div>
                                                <div className={styles.news_content}>
                                                    <div className={styles.news_content_inner}>
                                                        <p className={styles.sub}>
                                                            {
                                                                item.page.page_type === "External" ? "External Resources" :
                                                                <InjectHTML html={item.page.body} />
                                                            }
                                                        </p>
                                                        <p className={styles.news_text}>
                                                            <InjectHTML html={item.page.header} />
                                                        </p>
                                                    </div>
                                                    <p className={styles.date}>{moment(item.page.published_at).format('Do MMM, YYYY')}</p>
                                                </div>
                                            </div>
                                        </div>
                                    }
                                </div>
                            )
                        }) : <Spinner />
                    }
                </div>
            </div>
            {
                ShowPopper &&
                <NewsSelectPopper SetShowPopper={SetShowPopper} index={Index} Id={Id} SetId={SetId} />
            }
        </HomeLayout>
	)
}

export default resources