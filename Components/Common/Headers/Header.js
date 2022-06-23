import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import styles from './Header.module.scss';

const Header = () => {

	const router = useRouter()
	const [Dropped, SetDropped] = useState(false)

	useEffect(() => {
		SetDropped(false)
	}, [router])

	return (
		<div className={styles.header}>
			<div className='contain'>
				<div className={styles.wrapper}>
					<button
						className={`${styles.btn} ${styles.drop_btn} ${Dropped ? styles.open : ''}`}
						onClick={() => SetDropped(!Dropped)}
					>
						<img src="/assets/icons/menu.svg" alt="menu" className={styles.menu_icon} />
						<img src="/assets/icons/header_times.svg" alt="menu" className={styles.close_icon} />
					</button>
					<Link href="/">
						<a className={styles.logo} >
							<img src="/assets/icons/logo.svg" alt="Humanitarian Finance Forum" />
						</a>
					</Link>
					<div className={`${styles.menu} ${Dropped ? styles.open : ''}`}>
						<ul>
							<li className={styles.will_drop}>
								<Link href="/about/why-we-started">
									<a className={`${styles.btn} ${router.pathname.includes("/about") ? styles.active:""}`}>
										<span>About</span>
										<img src="/assets/icons/angle_down.svg" alt="icon" />
									</a>
								</Link>
								<div className={styles.drop}>
									<ul>
										<li>
											<Link href="/about/why-we-started">
												<a className={styles.navlink}>Why we started</a>
											</Link>
										</li>
										<li>
											<Link href="/about/what-we-aim-to-do">
												<a className={styles.navlink}>What we aim to do</a>
											</Link>
										</li>
										<li>
											<Link href="/about/history">
												<a className={styles.navlink}>History</a>
											</Link>
										</li>
										<li>
											<Link href="/about/how-we-work">
												<a className={styles.navlink}>How we work</a>
											</Link>
										</li>
										<li>
											<Link href="/about/governance">
												<a className={styles.navlink}>Governance</a>
											</Link>
										</li>
										<li>
											<Link href="/about/partners">
												<a className={styles.navlink}>Partners</a>
											</Link>
										</li>
										<li>
											<Link href="/about/community">
												<a className={styles.navlink}>Community</a>
											</Link>
										</li>
										<li>
											<Link href="/about/network">
												<a className={styles.navlink}>Network</a>
											</Link>
										</li>
									</ul>
								</div>
							</li>
							<li>
								<Link href="/events">
									<a className={`${styles.btn} ${router.pathname.includes("/events") ? styles.active :""}`}>
										<span>Events</span>
										<img src="/assets/icons/angle_down.svg" alt="icon" />
									</a>
								</Link>
							</li>
							<li className={styles.will_drop}>
								<Link href="/resources" >
									<a className={`${styles.btn} ${router.pathname.includes("/resources") ? styles.active :""}`}>
										<span>Resources</span>
										<img src="/assets/icons/angle_down.svg" alt="icon" />
									</a>
								</Link>
								<div className={styles.drop}>
									<ul>
										<li>
											<Link href="/resources/external-resources">
												<a className={styles.navlink}>
													External Resources
												</a>
											</Link>
										</li>
										<li>
											<Link href="/resources/publications">
												<a className={styles.navlink}>
													Publications
												</a>
											</Link>
										</li>
										<li>
											<Link href="/resources/blogs">
												<a className={styles.navlink}>
													Blogs
												</a>
											</Link>
										</li>
									</ul>
								</div>
							</li>
							<li>
								<Link href="/contact">
									<a className={`${styles.btn} ${router.pathname.includes("/contact") ? styles.active : ""}`}>
										Contact  Us
									</a>
								</Link>
							</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Header