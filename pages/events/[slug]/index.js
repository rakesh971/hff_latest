import React, { useState, useEffect, useRef } from 'react'
import RegisterPopper from '../../../Components/Website/Common/RegisterPopper/RegisterPopper'
import Image from '../../../Components/Common/Image/Image'
import Spinner from '../../../Components/Common/Spinner/Spinner'
import InjectHTML from '../../../Components/Common/InjectHTML/InjectHTML'
import PanelLayout from '../../../Components/Common/PanelLayout/PanelLayout'
import Link from 'next/link'
import { useRouter } from 'next/router'
import useServer from '../../../Hooks/useServer'
import styles from './EventsAll.module.scss'

const index = () => {

  const router = useRouter()
  const [Data, SetData] = useState(null)
  const [callApi,Loading,setLoading] =useServer()
  const [RegisterShow, SetRegisterShow] = useState(false)
  const [OverviewDrop, SetOverviewDrop] = useState(true)
  const [SpeakersDrop, SetSpeakersDrop] = useState(true)
  const [ImgWidth, SetImgWidth] = useState(null)
  const [Width, setWidth] = useState();
  const InnerWrap = useRef();

//   console.log('router', router.query)

	useEffect(() => {
		InnerWrap.current && SetImgWidth(InnerWrap.current.clientWidth)
		window.addEventListener('resize', handleWindowSizeChange);
		return () => {
			window.removeEventListener('resize', handleWindowSizeChange);
		}
	}, [])
  
	const handleWindowSizeChange = () => {
		setWidth(window.innerWidth);
	}

	useEffect(() => {
		console.log("width",Width)
		if(Width > 768) {
			SetOverviewDrop(true)
			SetSpeakersDrop(true)
		}
	}, [Width])

	useEffect(() => {
		router.isReady && init ()
		}, [router])

	const init =async ()=>{
		let response = await callApi(`website/event/${router.query.slug}`, {'with[]': 'sections'}, false, 'get', true);
		if(response.error === 1) {
		SetData(response.data)
		}
	}

	return (
		<PanelLayout>
			<div className="contains_everything">
				{
				Data ?
					<div className={styles.events}>
						<div className={styles.custom_crumbs}>
							<div className="contain">
								<ul>
									<li>
										<Link href="/events"><a className={styles.active}>Events</a></Link>
										<img src="/assets/icons/angle_right_dark.svg" alt="angle_right" />
									</li>
									<li>{Data.title}</li>
								</ul>
							</div>
						</div>
						<div className={styles.event_view}>
							<div className="contain">
								<p className={styles.event_title}><InjectHTML html={Data.header} /></p>
								<div className={styles.wrapper}>
									<div className={styles.sidebar}>
										<div className={`${styles.img_wrap} ${styles.sm}`}>
											<img src="/assets/images/home_what_is.png" alt="img title" />
										</div>
										<ul>
											<li>
												<p className={styles.side_title}>Location</p>
												<p className={styles.side_text}>
													<InjectHTML html={Data.eventDetail.location} />
												</p>
											</li>
											<li>
												<p className={styles.side_title}>Date</p>
												<p className={styles.side_text}>{Data.eventDetail.start_date}</p>
											</li>
											<li>
												<p className={styles.side_title}>Time</p>
												<p className={styles.side_text}>{Data.eventDetail.start_time}</p>
											</li>
											<li>
												<p className={styles.side_title}>Type</p>
												<p className={styles.side_text_badge} style={{background: Data.eventDetail.type_color}}>{Data.eventDetail.type}</p>
											</li>
										</ul>
										{
											Data.eventDetail.is_future &&
											<Link href={`/events/${router.query.id}/${router.query.slug}/register`} className={`${styles.btn} ${styles.lg}`}><a>Register</a></Link>
										}
									</div>
									<div className={styles.content_wrap}>
										<div className={styles.dynamic_content}>
											<div className={`${styles.img_wrap} ${styles.lg}`}>
												<Image image={Data.background_image || "https://hfforum.org/images/pages/backgrounds/1629907326135-home-show-copy.png"}
												alt = 'img title'/>
											</div>
											<div className={styles.bord_bot}>
												<p className={styles.tab_title}>Overview</p>
												<button 
													className={`${styles.btn} ${styles.accord} ${OverviewDrop ? `${styles.rotate}` : ''}`}
													onClick={() => SetOverviewDrop(!OverviewDrop)}
												>
													<span>Overview</span>
													<img src="/assets/icons/angle_color_up.svg" alt="angle" />
												</button>
												{
													OverviewDrop &&
													<p className={`${styles.text}`}>
														<InjectHTML html={Data.eventDetail.overview} />
													</p>
												}
											</div>
											{
												Data.infocard.length > 0 &&
												<div className={styles.bord_bot}>
													<p className={styles.tab_title}>
														<InjectHTML html={Data.sections[0].content} />
													</p>
													<button 
														className={`${styles.btn} ${styles.accord} ${SpeakersDrop ? `${styles.rotate}` : ''}`}
														onClick={() => SetSpeakersDrop(!SpeakersDrop)}
													>
														<span>
															<InjectHTML html={Data.sections[0].content} />
														</span>
														<img src="/assets/icons/angle_color_up.svg" alt="angle" />
													</button>
													{
														SpeakersDrop &&
														<div className={styles.speakers}>
															{
																Data.infocard.map((item, index) => {
																	return (
																		<div className={styles.sbox} key={item.id}>
																			<Image image ={item.image} alt={`speaker ${index}`}
																			style={{height: InnerWrap.current ? ImgWidth : '300px'}} ref={InnerWrap}
																			/>
																			<p className={styles.sbox_title}>
																				<InjectHTML html={item.title} />
																			</p>
																			<p className={styles.sbox_text}>
																				<InjectHTML html={item.description} />
																			</p>
																		</div>
																	)
																})
															}
														</div>
													}
												</div>
											}
										</div>
									</div>
									{
										Data.eventDetail.is_future &&
										<button 
											className={`${styles.btn} ${styles.sm}`}
											onClick={() => SetRegisterShow(true)}
										>Register</button>
									}
								</div>
							</div>
						</div>
					</div> : <Spinner />
				}
				{
					RegisterShow &&
					<RegisterPopper SetRegisterShow={SetRegisterShow} Data={Data} id={match.params.id} slug={match.params.slug} />
				}
			</div>
		</PanelLayout>
	)
}

export default index