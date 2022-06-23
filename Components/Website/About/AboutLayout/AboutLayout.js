import React, {useState, useEffect} from 'react'
import PanelLayout from '../../../Common/PanelLayout/PanelLayout'
import styles from './AboutLayout.module.scss'
import Image from '../../../Common/Image/Image'
import Link from 'next/link'
import Spinner from '../../../Common/Spinner/Spinner'
import { useRouter } from 'next/router';

const AboutLayout = ({children, Data}) => {
    const router = useRouter();
    const [ShowTabList, SetShowTabList] = useState(false)
    const [TabList, SetTabList] = useState([
        {
            id: 'tab01',
            title: 'Why we started',
            slug: 'why-we-started'
        },
        {
            id: 'tab02',
            title: 'What we aim to do',
            slug: 'what-we-aim-to-do'
        },
        {
            id: 'tab05',
            title: 'History',
            slug: 'history',
        },
        {
            id: 'tab03',
            title: 'How we work',
            slug: 'how-we-work',
        },
        {
            id: 'tab04',
            title: 'Governance',
            slug: 'governance',
        },
        {
            id: 'tab07',
            title: 'Partners',
            slug: 'partners',
        },
        {
            id: 'tab08',
            title: 'Community',
            slug: 'community',
        },
        {
            id: 'tab06',
            title: 'Network',
            slug: 'network',
        },
    ])
  return (
    <PanelLayout>
        <div className={styles.contains_everything}>
            {
                Data ?
                <div className={styles.about}>
                     <div className={styles.banner}>
                        <Image 
                            image={Data.data.background_image}
                            className={styles.bg}
                            alt="About"
                        />  
                        <div className={styles.wrapper}>
                            <div className="contain">
                                <h1>
                                    <span>{Data.data.title}</span>
                                </h1>
                            </div>
                        </div>
					</div>
                    <div className={styles.about_container}>
                        <div className="contain">
                            <div className={styles.wrapper}>
                                <div className={styles.sidebar}>
                                    <ul>
                                        {
                                            TabList.map(item => {
                                                const route = `/about/${item.slug}`
                                                return (
                                                    <li key={item.id}>
                                                        <Link href={route}>
                                                            <a 
                                                                className={`
                                                                    btn ${styles.side_link} 
                                                                    ${router.pathname == route ? `${styles.active}` : ''}
                                                                `}
                                                            >
                                                                {item.title}
                                                                <img src="/assets/icons/angle_right_blue_md.svg" alt="icon" />
                                                            </a>
                                                        </Link>
                                                    </li>
                                                )
                                            })
                                        }
                                    </ul>
                                </div>
                                <div className={styles.mobile_drop_menu}>
                                    <button 
                                        className={`${styles.btn} ${styles.selected}`}
                                        onClick={() => SetShowTabList(!ShowTabList)}
                                    >
                                        {
                                            TabList.map(item => {
                                                const route = `/about/${item.slug}`
                                                if(router.pathname === route) {															
                                                    return (
                                                        <span key={item.id}>{item.title}</span>
                                                    )
                                                }
                                            })
                                        }
                                        <img src="/assets/icons/angle_down_lg.svg" alt="angle_down_lg" />
                                    </button>
                                    {
                                        ShowTabList &&
                                        <ul>
                                            {
                                                TabList.map(item => {
                                                    const route = `/about/${item.slug}`
                                                    if(router.pathname !== route) {
                                                        return (
                                                            <li key={item.id}>
                                                                <Link href={`/about/${item.slug}`}>
                                                                    <a className={styles.btn}>{item.title}</a>		
                                                                </Link>
                                                            </li>
                                                        )
                                                    } else return null
                                                })
                                            }
                                        </ul>
                                    }
                                </div>
                                <div className={styles.content_wrap}>
                                    {children}
                                </div>
                            </div>
                        </div>
                    </div>
                </div> :<Spinner/>
            }
            
            
        </div>
    </PanelLayout>
  )
}

export default AboutLayout