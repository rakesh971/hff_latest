import React, { useState, useEffect } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import Link from 'next/link'
import moment from 'moment-timezone'
import Image from '../../../Components/Common/Image/Image';
import Spinner from '../../../Components/Common/Spinner/Spinner';
import InjectHTML from '../../../Components/Common/InjectHTML/InjectHTML';
import PanelLayout from '../../../Components/Common/PanelLayout/PanelLayout';
import useServer from '../../../Hooks/useServer';
import styles from './ExternalResources.module.scss'

const externalResources = () => {

	const  [callApi, Loading, setLoading ] = useServer()
  	const [Data, SetData] = useState(null)
  	const [Featured, SetFeatured] = useState(null)
	
    useEffect(() => {
		init ()
    }, [])
	
	const init = async ()=>{
		let response = await callApi('website/external', {}, false, 'get', false);
		if(response.error === 1){
			SetData(response.data.result.data)
			SetFeatured(response.data.featured)
		}
	}

  return (
    <PanelLayout>
		<div className='contains_everything'>
			{
			Data ?
			<div className={styles.resources}>
				<div className={styles.custom_crumbs}>
					<div className={styles.contain}>
						<ul>
							<li>
								<Link href="/resources"><a className={styles.active}>Resources</a></Link>
								<img src="/assets/icons/angle_right_dark.svg" alt="angle_right" />
							</li>
							<li>External Resources</li>
						</ul>
					</div>
				</div>
				{
				Featured.length > 0 &&
				<div className={styles.featured}>
					<div className={styles.wrapper}>
						<div className={styles.contain}>
							<p className={styles.section_title}>Featured</p>
							<div className={styles.wrapper}>
								<Swiper
									slidesPerView={1}
									loop
									pagination={Featured.length > 1 ? { clickable: true } : false}
									autoplay={Featured.length > 1 ? { delay: 10000 } : false}
								>
									{
										Featured.map((item) => {
											// console.log(item)
											return (
												<SwiperSlide key={item.id}>
													<Link
														href={{
															pathname: `/resources/external-resources/${item.slug}`,
															// query:{state: JSON.stringify(item)}
														}}
													>	
														<a className={styles.slide_wrap}>
															<div className={styles.img_wrap}>
																<Image image = {item.background_image} 
																	alt="showcase"
																/> 
															</div>
															<div className={styles.content_wrap}>
																<div>
																	<p className={styles.title}>
																		<InjectHTML html={item.header} />
																	</p>
																	<p className={styles.text}>
																		<InjectHTML html={item.body} />
																	</p>
																</div>
																<p className={styles.date}>{moment(item.published_at).format('Do MMM, YYYY')}</p>
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
				</div>
				}
				<div className={styles.other_resources}>
					<div className="contain">
						<div className={styles.section_head}>
							<p className={styles.section_title}>Other Resources</p>
							<Link href="/resources/external-resources/all" >
								<a className={`btn ${styles.btn}`}>See All
									<img src="/assets/icons/angle_right_orange.svg" alt="angle right" />
								</a>
							</Link>
						</div>
						<div className={styles.wrapper}>
							{
								Data.map((item) => (
									<Link 	
										key={item.id}
										href={{
											pathname: `/resources/external-resources/${item.slug}`,
											// state: item
										}}
									>
										<a className={styles.rwrap} >
											<div className={styles.img_wrap}>
												<Image image = {item.background_image} alt="showcase" />
											</div>
											<div className={styles.content_wrap}>
												<p className={styles.title}>
													<InjectHTML html={item.header} />
												</p>
												<p className={styles.date}>{moment(item.published_at).format('Do MMM, YYYY')}</p>
											</div>
										</a>
									</Link>
								))
							}
						</div>
					</div>
				</div>
			</div> :<Spinner/>
			}
		</div>
    </PanelLayout>
  )
}

export default externalResources