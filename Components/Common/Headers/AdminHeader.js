import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Image from '../Image/Image';
import useServer from '../../../Hooks/useServer';
import { useSession, signOut } from 'next-auth/react';
import styles from './Header.module.scss';

const AdminHeader = () => {

    const router = useRouter()    
    const {data: session} = useSession()    
    const buttonRef = useRef()
    const [callApi,Loading,setLoading]= useServer()
    const [Dropped, SetDropped] = useState(false)
    const [ProfileDrop, SetProfileDrop] = useState(false)
    const [userInfo, SetUserInfo] = useState(null)
     

    useEffect(() => {
        SetDropped(false)
        SetProfileDrop(false)
    }, [router])    

    useEffect(() => {
        if(session) {
            SetUserInfo(session.user)
        }
    }, [session])

    useEffect(() => {
        document.addEventListener('click', handleClickOutside, true);
        return () => {
            document.removeEventListener('click', handleClickOutside, true);
        };
    }, [])

    const handleClickOutside = (event) => {
        if (buttonRef.current && !buttonRef.current.contains(event.target)) {
            SetProfileDrop(false)
        }
    };

    return (
        <div className={styles.header}>
            <div className={`contain ${styles.contain}`}>
                <div className={styles.wrapper}>
                    <button
						className={`${styles.btn} ${styles.drop_btn} ${Dropped ? styles.open : ''}`}
						onClick={() => SetDropped(!Dropped)}
					>
						<img src="/assets/icons/menu.svg" alt="menu" className={styles.menu_icon} />
						<img src="/assets/icons/header_times.svg" alt="menu" className={styles.close_icon} />
					</button>
					<Link href="/admin/home/banner">
						<a className={styles.logo} >
							<img src="/assets/icons/logo.svg" alt="Humanitarian Finance Forum" />
						</a>
					</Link>
                    <div className={`${styles.menu} ${Dropped ? styles.open : ''}`}>
                        <ul className={styles.ahead}>
                            <li>
                                <Link href="/admin/home/banner">
                                    <a className={`${styles.btn} ${router.pathname.includes("/admin/home") ? styles.active:""}`}>
										<span>Home</span>
									</a>
								</Link>
                                <div className={styles.drop}>
									<ul>
										<li>
											<Link href="/admin/home/banner">
												<a className={styles.navlink}>Banner</a>
											</Link>
										</li>
										<li>
											<Link href="/admin/home/what-is-hff">
												<a className={styles.navlink}>What is Hff</a>
											</Link>
										</li>
										<li>
											<Link href="/admin/home/upcoming-events">
												<a className={styles.navlink}>Upcoming Events</a>
											</Link>
										</li>
										<li>
											<Link href="/admin/home/events">
												<a className={styles.navlink}>Events</a>
											</Link>
										</li>
										<li>
											<Link href="/admin/home/resources">
												<a className={styles.navlink}>Resources</a>
											</Link>
										</li>
										<li>
											<Link href="/admin/home/page-seo">
												<a className={styles.navlink}>Page Seo</a>
											</Link>
										</li>
									</ul>
								</div>
                            </li>
                            <li>
                                <Link href="/admin/about/banner">
                                    <a className={`${styles.btn} ${router.pathname.includes("/admin/about") ? styles.active:""}`}>
                                        <span>About us</span>
                                    </a>
                                </Link>
                                <div className={styles.drop}>
									<ul>
										<li>
											<Link href="/admin/about/banner">
												<a className={styles.navlink}>Banner</a>
											</Link>
										</li>
										<li>
											<Link href="/admin/about/why-we-started">
												<a className={styles.navlink}>Why we started</a>
											</Link>
										</li>
										<li>
											<Link href="/admin/about/what-we-aim-to-do">
												<a className={styles.navlink}>What we aim to do</a>
											</Link>
										</li>
										<li>
											<Link href="/admin/about/history">
												<a className={styles.navlink}>History</a>
											</Link>
										</li>
										<li>
											<Link href="/admin/about/how-we-work">
												<a className={styles.navlink}>How We Work</a>
											</Link>
										</li>
                                        <li>
											<Link href="/admin/about/governance">
												<a className={styles.navlink}>Governance</a>
											</Link>
										</li>
                                        <li>
											<Link href="/admin/about/partners">
												<a className={styles.navlink}>Partners</a>
											</Link>
										</li>
                                        <li>
											<Link href="/admin/about/community">
												<a className={styles.navlink}>Community</a>
											</Link>
										</li>
                                        <li>
											<Link href="/admin/about/network">
												<a className={styles.navlink}>Network</a>
											</Link>
										</li>
										<li>
											<Link href="/admin/about/page-seo">
												<a className={styles.navlink}>Page Seo</a>
											</Link>
										</li>
									</ul>
								</div>   
                            </li>
                            <li>
                                <Link href="/admin/events/banner">
                                    <a className={`${styles.btn} ${router.pathname.includes("admin/events") ? styles.active:""}`}>
                                        <span>Events</span>
                                    </a>
                                </Link>
                                <div className={styles.drop}>
                                    <ul>
                                       <li>
                                            <Link href="/admin/events/banner">
                                               <a className={styles.navlink}>Banner</a>
                                            </Link>
                                       </li>

                                       <li>
                                            <Link href = '/admin/events/list'>
                                                <a className={styles.navlink}>Events</a>
                                            </Link>
                                       </li>
                                    </ul>
                                </div>
                            </li>
                            <li>
                                <Link href="/admin/resources">
                                    <a className={`${styles.btn} ${router.pathname.includes("/resources") ? styles.active:""}`}>
                                        <span>Resources</span>
                                    </a>
                                </Link>    
                            </li>
                            <li>
                                <Link href="/admin/contact/details">
                                    <a className={`${styles.btn} ${router.pathname.includes("/admin/contact") ? styles.active:""}`}>
                                        <span>Contact us</span>
                                    </a>
                                </Link>  
                                <div className={styles.drop}>
									<ul>
										<li>
											<Link href="/admin/contact/details">
												<a className={styles.navlink}>Details</a>
											</Link>
										</li>
										<li>
											<Link href="/admin/contact/page-seo">
												<a className={styles.navlink}>Page Seo</a>
											</Link>
										</li>
									</ul>
								</div>     
                            </li>
                        </ul>
                    </div>
                    <div className={` ${styles.profile} ${styles.profile_drop}`} ref={buttonRef}>
                        <button className={`${styles.profile_btn} ${styles.btn}`} onClick={(e) => {
                            e.stopPropagation();
                            SetProfileDrop(!ProfileDrop)
                        }}>
                            { 
                                userInfo ? 
                                <Image
                                    image={{url:userInfo.image}}
                                    alt="Admin"
                                />
                                : <div className="load"></div>
                            }
                        </button>
                        {
                            ProfileDrop &&
                                <div className={styles.profile_dropdown}>
                                    <ul className={styles.profile_menu}>
                                        <Link href="/admin/profile">
                                            <a className={styles.profile_link}>
                                                <li>Profile Settings</li>
                                            </a>
                                        </Link>
                                        <Link href="/admin/change-password">
                                            <a className={styles.profile_link}>
                                                <li>Change Password</li>
                                            </a>
                                        </Link>
                                        <button className={styles.profile_link} onClick={() => signOut()}>
                                            <li>Logout</li>
                                        </button>
                                    </ul>
                                </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminHeader
