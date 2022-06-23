import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Spinner from '../../../../Components/Common/Spinner/Spinner'
import moment from 'moment-timezone'
import Image from '../../../../Components/Common/Image/Image'
import InjectHTML from '../../../../Components/Common/InjectHTML/InjectHTML'
import { useRouter } from 'next/router'
import {
	FacebookShareButton,
	InstapaperShareButton,
	TelegramShareButton,
	TwitterShareButton,
  } from "react-share";
import PanelLayout from '../../../../Components/Common/PanelLayout/PanelLayout'
import useServer from '../../../../Hooks/useServer'
import styles from './More.module.scss'

const index = () => {

	const router = useRouter()
	const  [callApi, Loading, setLoading ] = useServer()
	const [Data, SetData] = useState(null);
	const [OverviewDrop, SetOverviewDrop] = useState(true);
	const [DetailsDrop, SetDetailsDrop] = useState(true);
	const [Width, setWidth] = useState(null);
  
	useEffect(() => {
		window.addEventListener("resize", handleWindowSizeChange);
		return () => {
			window.removeEventListener("resize", handleWindowSizeChange);
		};
	}, []);
  
	const handleWindowSizeChange = () => {
	  setWidth(window.innerWidth);
	};
	
	useEffect(() => {
		console.log('first===>',Width)
		if (Width > 768) {
			SetOverviewDrop(true);
			SetDetailsDrop(true);
		}
		}, [Width]);
	
	useEffect(() => {
		router.isReady && init()
	}, [router]);
	
	const  init = async () =>{
		let response = await callApi(`website/publication/${router.query.slug}`,{},false,"get",false);
		if (response.error === 1) {
			SetData(response.data);
		  }
	}

	return (
		<PanelLayout>
			<div className="contains_everything">
				{Data ? (
					<div className="resources">
						<div className={`${styles.custom_crumbs} ${styles.sm}`}>
							<div className="contain">
							<ul>
								<li className={styles.back}>
									<img
										src="/assets/icons/angle_right_dark.svg"
										alt="angle_right"
									/>
									<button
										className={`${styles.active} ${styles.btn}`}
										onClick={() => router.back()}
									>
										Publications
									</button>
								</li>
								<li>
									<Link href="/resources">
										<a className={styles.active}>Resources</a>
									</Link>
									<img
										src="/assets/icons/angle_right_dark.svg"
										alt="angle_right"
									/>
								</li>
								<li>
								<Link href="/resources/publications">
									<a className={styles.active}>
										Publications
									</a>
								</Link>
									<img
										src="/assets/icons/angle_right_dark.svg"
										alt="angle_right"
									/>
								</li>
								<li>
									<InjectHTML html={Data.header} />
								</li>
							</ul>
							</div>
						</div>
						<div className={styles.publication_view}>
							<div className="contain">
								<p className={styles.blog_title}>
									<InjectHTML html={Data.header} />
								</p>
								<div className={styles.wrapper}>
									<div className={styles.sidebar}>
										<div className={`${styles.img_wrap} ${styles.lg}`}>
											<Image image ={Data.background_image} alt="document_holder"/>
										</div>
										<div className={styles.bord_bot}>
											<button
												className={`${styles.btn} ${styles.accord} ${DetailsDrop ? `${styles.rotate}` : ""}`}
												onClick={() => SetDetailsDrop(!DetailsDrop)}
											>
												<span>Details</span>
												<img src="/assets/icons/angle_color_up.svg" alt="angle" />
											</button>
											{DetailsDrop && (
												<ul>
													<li>
														<p className={styles.side_title}>Editors</p>
														<p className={styles.side_text}>
															<InjectHTML html={Data.publication.editors} />
														</p>
													</li>
													<li>
														<p className={styles.side_title}>Number of Pages</p>
														<p className={styles.side_text}>
															<InjectHTML html={Data.publication.pages} />
														</p>
													</li>
													<li>
														<p className={styles.side_title}>Reference Number</p>
														<p className={styles.side_text}>
															<InjectHTML html={Data.publication.reference} />
														</p>
													</li>
													<li>
														<p className={styles.side_title}>Copyright</p>
														<p className={styles.side_text}>
															<InjectHTML html={Data.publication.copyright} />
														</p>
													</li>
													<li>
														<p className={styles.side_title}>Published</p>
														<p className={styles.side_text}>
															{moment(Data.published_at).format('Do MMM, YYYY')}
														</p>
													</li>
												</ul>
											)}
										</div>
										<button className={`${styles.btn} ${styles.download_btn} ${styles.sm}`}>
											Download (1.1 MB)
										</button>
										<div className={styles.share}>
											<p className={styles.side_title}>Share</p>
											<div className={styles.icons}>
												<div className={styles.icon}>
													<FacebookShareButton
														quote={Data.title}
														url={window.location.href}
													>
														<img
															src="/assets/icons/facebook.svg"
															alt="facebook"
													/>
													</FacebookShareButton>
												</div>
												<div className={styles.icon}>
													<TwitterShareButton
														title={Data.title}
														url={window.location.href}
													>
														<img src="/assets/icons/twitter.svg" alt="twitter" />
													</TwitterShareButton>
												</div>
												<div className={styles.icon}>
													<TelegramShareButton
														quote={Data.title}
														url={window.location.href}
													>
														<img src="/assets/icons/youtube.svg" alt="youtube" />
													</TelegramShareButton>
												</div>
												<div className={styles.icon}>
													<InstapaperShareButton
														title={Data.title}
														url={window.location.href}
													>
														<img
															src="/assets/icons/instagram.svg"
															alt="instagram"
														/>
													</InstapaperShareButton>
												</div>
											</div>
										</div>
									</div>
									<div className={styles.content_wrap}>
										<div className={`${styles.img_wrap} ${styles.sm}`}>
											<Image image = {Data.background_image} alt="document_holder" />
										</div>
										<div className={styles.dynamic_content}>
											<p className={styles.dark_title}>Overview</p>
											<div className={styles.bord_bot}>
												<button
													className={`${styles.btn} ${styles.accord} ${OverviewDrop ? `${styles.rotate}` : ""}`}
													onClick={() => SetOverviewDrop(!OverviewDrop)}
												>
													<span>Overview</span>
													<img
														src="/assets/icons/angle_color_up.svg"
														alt="angle"
													/>
												</button>
												{OverviewDrop && (
													<p className={styles.text} >
														<InjectHTML html={Data.body} />
													</p>
												)}
											</div>
											<Link
												href={{ pathname: Data.publication.downloadable }}
												target="_blank"
											>
												<a className={`${styles.btn} ${styles.download_btn} ${styles.lg}`}>Download</a>
											</Link>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				) : (
					<Spinner />
				)}
			</div>
		</PanelLayout>
	)
}

export default index