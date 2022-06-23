import React, { useState, useEffect } from 'react'
import InjectHTML from '../Components/Common/InjectHTML/InjectHTML'
import PanelLayout from '../Components/Common/PanelLayout/PanelLayout';
import Spinner from '../Components/Common/Spinner/Spinner'
import Image from '../Components/Common/Image/Image';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Pagination, Autoplay } from 'swiper/core';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import 'swiper/css';
import moment from 'moment-timezone'
import Link from 'next/link'
import useServer from '../Hooks/useServer'
import styles from '../styles/Home.module.scss'
SwiperCore.use([Pagination,Autoplay]);

const home = () => {
	
	const [callApi, Loading, setLoading ] = useServer()
	const [Data, SetData] = useState(null)
    useEffect(() => {
		init()
    }, [])

	const init = async () => {
		let response = await callApi( 'website/home', {}, false, 'get', false);
		if(response.error === 1){
			SetData(response.data)
		}
	}

	if(Data) console.log(Data.infocard.length > 1 ? { clickable: true } : false)

	return (
		<PanelLayout>
			<div className="contains_everything">
				{
					Data ?
					<>
						<div className={styles.showcase}>
							<Image 
								image={Data.background_image}
								className={styles.bg}
								alt="showcase"
							/>
							<div className={styles.wrapper}>
								<h1>
									<InjectHTML html={Data.header} />
								</h1>
							</div>
						</div>
						<div className={styles.home_what_is}>
							<div className={`contain ${styles.contain}`}>
								<p className={styles.section_title}>What is HFF?</p>
								<Swiper
									slidesPerView={1}
									loop
									pagination={Data.infocard.length > 1 ? { clickable: true } : false}
									autoplay={Data.infocard.length > 1 ? { delay: 10000 } : false}
								>
									{
										Data.infocard.map((item) => {
											return (
												<SwiperSlide key={"whatishff" + item.id}>
													<div className={styles.wrapper}>
														<div className={styles.img_wrap}>
															<Image
																image={item.image}
																alt="showcase"
															/>
														</div>
														<div className={styles.content_wrap}>
															<img src="/assets/icons/triangle.svg" alt="triangle" className={styles.abs} />
															<p>
																<InjectHTML html={item.description} />
															</p>
														</div>
													</div>
												</SwiperSlide>
											);
										})
									}
								</Swiper>
							</div>
						</div>
						{
							Data.upcoming && Data.upcoming.length > 0 && 
							<div className={styles.home_upcoming}>
								<div className="contain">
									<p className={styles.section_title}>Upcoming Events</p>
									<div className={styles.wrapper}>
										<Swiper
											slidesPerView={1}
											loop
											pagination={Data.upcoming.length > 1 ? { clickable: true } : false}
											autoplay={Data.upcoming.length > 1 ? { delay: 10000 } : false}
										>
											{
												Data.upcoming.map((item) => {
													return (
														<SwiperSlide key={"upcoming"+item.id}>
															<Link href={`/events/${item.page.slug}`}>
																<a  className={styles.slide_wrap}>
																	<div className={styles.content_wrap}>
																		<div>
																			<p className={styles.title}>{item.page.title}</p>
																			<p className={styles.text}>{item.page.seo_description}</p>
																		</div>
																		<p className={styles.date}>
																			{
																				item.page.eventDetail.start_date
																			}
																		</p>
																	</div>
																	<div className={styles.img_wrap}>
																		<Image
																			image={item.page.background_image}
																			alt="showcase"
																		/>
																	</div>
																</a>
															</Link>
														</SwiperSlide>
													);
												})
											}
										</Swiper>
									</div>
								</div>
							</div>
						}
						{
							Data.events && Data.events.length > 0 ?
							<div className={styles.home_events}>
								<div className="contain">
									<div className={styles.events_head}>
										<p className={styles.section_title}>Events</p>
										<Link href="/events">
											<a className={styles.btnlink}>
												<span>See All</span>
												<img src="/assets/icons/angle_right_color_thin.svg" alt="see all" />
											</a>							
										</Link>
									</div>
									<div className={styles.wrapper}>
										{
											Data.events.map(item  => (
												<Link href={`/events/${item.page.slug}`} key={"events"+item.id}>
													<a className={styles.event_box}>
														<Image
															image={item.page.background_image}
															alt={item.page.title}
														/>
														<div className={styles.event_wrapper}>
															<div className={styles.event_info}>
																<p className={styles.title}>{item.page.title}</p>
																<p className={styles.text}>{item.page.seo_description}</p>
															</div>
															<div className={styles.event_meta}>
																<p className={styles.date}>
																	{
																		item.page.eventDetail.start_date
																	}
																</p>
																<p className={styles.cat} style={{background: item.page.eventDetail.type_color}}>{item.page.eventDetail.type}</p>
															</div>
														</div>
													</a>
												</Link>
											))
										}
									</div>
								</div>
							</div> : null
						}
						{
							Data.news && Data.news.length > 0 ?
							<div className={styles.home_resources}>	
								<div className="contain">
									<div className={styles.resources_head}>
										<p className={styles.section_title}>Resources</p>
										<Link href="/resources">
											<a className={styles.btnlink}>
												<span>See All</span>
												<img src="/assets/icons/angle_right_blue_thin.svg" alt="see all" />
											</a>
										</Link>
									</div>
									<div className={styles.wrapper}>
										{
											Data.news.map(item => {
												return (
													<Link href={item.page.page_type== "External" ? `/resources/external-resources/${item.page.slug}`:item.page.page_type == "Publications" ? `/resources/publications/${item.page.slug}` : `/resources/blogs/${item.page.slug}`} key={"resources"+item.id}>
														<a className={styles.resources_box} >
															<Image
																image={item.page.background_image}
																alt={item.page.title}
															/>
															<div className={styles.resources_wrapper}>
																<p className={styles.title}>
																	<InjectHTML html={item.page.header} />    
																</p>
																<p className={styles.date}>{moment(item.page.published_at).format('Do MMM YYYY')}</p>
															</div>
														</a>
													</Link>
												)
											})
										}
									</div>
								</div>
							</div> : null
						}
						{
							Data.partners && Data.partners.filter(n=>!n.is_carousel).length > 0 && 
							<div className={styles.our_partners}>
								<div className="contain">
									<p className={styles.section_title}>Our Partners</p>
									<div className={styles.wrapper}>
										{
											Data.partners.filter(item => !item.is_carousel).map(item => {
												return (
													<div className={styles.img_wrap} key={"partner"+item.id}>
														<Image
															image={item.image}
															alt="Partner name"
														/>
													</div>
												)
											})
										}
										
									</div>
								</div>
							</div>
						}
					</> : <Spinner />
				}
			</div>
		</PanelLayout>
	)
}

export default home

{/* <Image
	image={session.user.image}
	className={styles.sl_profile_img}
	alt="alternate text"
/> */}

// import useServer from '../../Hooks/useServer'

// const [callApi, Loading, setLoading] = useServer();

// const response = await callApi('config/categories', {}, false, 'post', false, session.user.token);

// if(response.error === 1) {
// 	await createTable('categories', session.user.token)
// 	SetSuccessMode(true)
// }