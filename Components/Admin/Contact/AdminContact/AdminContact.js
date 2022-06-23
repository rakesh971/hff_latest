import React, {useState, useEffect} from 'react'
import PanelLayout from '../../../Common/PanelLayout/PanelLayout'
import Image from '../../../Common/Image/Image'
import Link from 'next/link'
import Spinner from '../../../Common/Spinner/Spinner'
import { useRouter } from 'next/router';
import styles from './AdminContact.module.scss'

const AdminAboutLayout = ({children, Data}) => {
    const router = useRouter();
    const [ShowTabList, SetShowTabList] = useState(false)
    const [TabList, SetTabList] = useState([
        {
            id: 'tab01',
            title: 'Details',
            slug: 'details'
        },
        {
            id: 'tab02',
            title: 'Page Seo',
            slug: 'page-seo',
        }
    ])
  return (
    <PanelLayout>
        <div className={styles.contains_everything}>
            {
                Data ?
                <div className={styles.about}>   
                    <div className={styles.about_container}>
                        <div className="contain">
                            <div className={styles.wrapper}>
                                <div className={styles.sidebar}>
                                    <ul>
                                        {
                                            TabList.map(item => {
                                                const route = `/admin/contact/${item.slug}`
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
                                                const route = `/admin/contact/${item.slug}`
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
                                                    const route = `/admin/contact/${item.slug}`
                                                    if(router.pathname !== route) {
                                                        return (
                                                            <li key={item.id}>
                                                                <Link href={`/admin/contact/${item.slug}`}>
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

export default AdminAboutLayout