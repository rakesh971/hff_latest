import React, { useState, useEffect } from "react";
import Spinner from "../../../../Components/Common/Spinner/Spinner";
import InjectHTML from "../../../../Components/Common/InjectHTML/InjectHTML";
import Element from '../../../../Components/Website/About/Element/Element'
import Link from 'next/link'
import Image from "../../../../Components/Common/Image/Image";
import PanelLayout from "../../../../Components/Common/PanelLayout/PanelLayout";
import useServer from "../../../../Hooks/useServer";
import moment from "moment-timezone";
import {useRouter} from 'next/router'
import styles from './BlogAll.module.scss'

const index = () => {

    const router =  useRouter()
    const [callApi,Loading,setLoading] =useServer()
    const [Data, SetData] = useState()
    const [UrlData, SetUrlData] = useState({
		id:"",
		pathname:''
	})
	
	useEffect(()=>{	
        router.isReady && init()
	},[router])

    const init = async () =>{
        let response = await callApi (`website/blog/${router.query.slug}`, {}, false, 'get', true);
        console.log("blogs=>",response)
        if(response.error === 1) {
            SetData(response.data)
        }
    }
  return (
    <PanelLayout>
        <div className="contains_everything">
            {
                Data ?
                    <div className="resources">
                        <div className={`${styles.custom_crumbs} ${styles.sm}`}>
                            <div className="contain">
                                <ul>
                                    <li className={styles.back}>
                                        <img src="/assets/icons/angle_right_dark.svg" alt="angle_right" />
                                        <button 
                                            className={`${styles.active} ${styles.btn}`}
                                            onClick={() => router.back()}
                                        >Latest Blogs</button>
                                    </li>
                                    <li>
                                        <Link href="/resources"><a className={styles.active}>Resources</a></Link>
                                        <img src="/assets/icons/angle_right_dark.svg" alt="angle_right" />
                                    </li>
                                    <li>
                                        <Link href="/resources/blogs"><a className={styles.active}>Blogs</a></Link>
                                        <img src="/assets/icons/angle_right_dark.svg" alt="angle_right" />
                                    </li>
                                    <li>{Data.title}</li>
                                </ul>
                            </div>
                        </div>
                        <div className={styles.blog_view}>
                            <div className="contain">
                                <p className={styles.blog_title}>
									<InjectHTML html={Data.header} />    
								</p>
                                <div className={styles.wrapper}>
                                    <div className={styles.sidebar}>
                                        <ul>
                                            <li>
                                                <p className={styles.side_title}>Published</p>
                                                <p className={styles.side_text}>{moment(new Date(Data.published_at)).format('DD MMM YYYY')}</p>
                                            </li>
                                            <li>
                                                <p className={styles.side_title}>Reading time</p>
                                                <p className={styles.side_text}>
                                                    <InjectHTML html={Data.call_to_action} />
                                                </p>
                                            </li>
                                        </ul>
                                        <div className={styles.share}>
                                            <p className={styles.side_title}>Share</p>
                                            <div className={styles.icons}>
                                                <Link href="/" target="_blank">
                                                    <a className={styles.icon}>
                                                        <img src="/assets/icons/facebook.svg" alt="facebook" />
                                                    </a>
                                                </Link>
                                                <Link href="/" target="_blank">
                                                    <a className={styles.icon}>	
                                                        <img src="/assets/icons/twitter.svg" alt="twitter" />
                                                    </a>
                                                </Link>
                                                <Link href="/" target="_blank">
                                                    <a className={styles.icon}>
                                                        <img src="/assets/icons/youtube.svg" alt="youtube" />
                                                    </a>
                                                </Link>
                                                <Link href="/" target="_blank">
                                                    <a className={styles.icon}>
                                                        <img src="/assets/icons/instagram.svg" alt="instagram" />
                                                    </a>
                                                </Link>
                                            </div>
                                        </div>
									</div>
                                    <div className={styles.content_wrap}>
                                        <div className={styles.dynamic_content}>
											<div className={styles.img_wrap}>
												<Image image={Data.background_image} />
											</div>
                                            {
                                                Data.sections && 
                                                Data.sections.map(item=>{
                                                    return <Element data={item} key={item.id} />
                                                }) 
                                            }
                                        </div>
                                        <div className={styles.share}>
                                            <p className={styles.side_title}>Share</p>
                                            <div className={styles.icons}>
                                                <Link href="/" target="_blank">
                                                    <a className={styles.icon}>
                                                        <img src="/assets/icons/facebook.svg" alt="facebook" />
                                                    </a>
                                                </Link>
                                                <Link href="/" target="_blank">
                                                    <a className={styles.icon}>
                                                        <img src="/assets/icons/twitter.svg" alt="twitter" />
                                                    </a>
                                                </Link>
                                                <Link href="/" target="_blank">
                                                    <a className={styles.icon}>
                                                        <img src="/assets/icons/youtube.svg" alt="youtube" />
                                                    </a>
                                                </Link>
                                                <Link href="/" target="_blank">
                                                    <a className={styles.icon}>
                                                        <img src="/assets/icons/instagram.svg" alt="instagram" />
                                                    </a>
                                                </Link>
                                            </div>
										</div>
                                    </div>
                                </div>        
                            </div>
                        </div>
                    </div>:<Spinner/>
            }
        </div>
    </PanelLayout>
  )
}

export default index