import React, { useState, useEffect } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import InjectHTML from '../../../Components/Common/InjectHTML/InjectHTML';
import Spinner from '../../../Components/Common/Spinner/Spinner';
import moment from 'moment-timezone';
import Link from 'next/link';
import Image from '../../../Components/Common/Image/Image';
import PanelLayout from '../../../Components/Common/PanelLayout/PanelLayout';
import useServer from '../../../Hooks/useServer';
import styles from './Blog.module.scss'

const blogs = () => {

    const [Featured, SetFeatured] = useState(null)
    const [Data, SetData] = useState(null)
    const [callApi, Loading, setLoading ] = useServer()

    useEffect(() => {
    init ()
    }, [])

    const init = async ()=>{
        let response = await callApi('website/blogs', {}, false, 'get', true);
        if(response.error === 1) {
          SetFeatured(response.data.featured)
          SetData(response.data.result.data)
        }
    }

return (
	<PanelLayout>
		<div className="contains_everything">
			{
				Data ?
				<div className={styles.resources}>
					<div className={styles.custom_crumbs}>
						<div className="contain">
						<ul>
							<li>
							<Link href="/resources"><a className={styles.active}>Resources</a></Link>
							<img src="/assets/icons/angle_right_dark.svg" alt="angle_right" />
							</li>
							<li>Blogs</li>
						</ul>
						</div>
					</div>
					{
					Featured.length > 0 &&
					<div className={`${styles.featured} ${styles.var_height}`}>
						<div className={styles.wrapper}>
							<div className="contain">
								<p className={styles.section_title}>Featured Blogs</p>
								<div className={styles.wrapper}>
									<Swiper
										slidesPerView={1}
										loop
										pagination={{ clickable: true }}
										autoplay={{ delay: 3000 }}
									>
									{
										Featured.map((item) => {
										return (
											<SwiperSlide key={item.id}>
												<Link href={`/resources/blogs/${item.id }`}>
													<a className={styles.slide_wrap}>
														<div className={`${styles.content_wrap} ${styles.light}`}>
															<div>
																<p className={styles.title} id="full_img"><InjectHTML html={item.header} /></p>
															</div>
															<p className={styles.date}>{moment(item.published_at).format('Do MMM, YYYY')}</p>
														</div>
														<div className={styles.img_wrap}>
															<Image image = {item.background_image} alt = 'showcase'/>
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
								<p className={styles.section_title}>Latest Blogs</p>
								<Link href="/resources/blogs/all">
									<a className={styles.btn}>See All
										<img src="/assets/icons/angle_right_orange.svg" alt="angle right" />
									</a>
								</Link>
							</div> 
							<div className={styles.wrapper}>
								{
									Data.map((item) => {
										return (
											<Link href={`/resources/blogs/${item.slug}`} key={item.id}>
												<a className={styles.rwrap}>
													<div className={styles.img_wrap}>
														<Image image ={item.background_image}  alt = 'showcase'/>
													</div>
													<div className={styles.content_wrap}>
														<p className={styles.title}><InjectHTML html={item.header} /></p>
														<p className={styles.date}>{moment(item.published_at).format('Do MMM, YYYY')}</p>
													</div>
												</a>
											</Link>
										);
									})
								}
							</div>
						</div>
					</div>
				</div> : <Spinner />
			}
		</div>
	</PanelLayout>
)
}

export default blogs