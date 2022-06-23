import React, { useState, useEffect } from "react";
import Spinner from "../../../Common/Spinner/Spinner";
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Pagination, Autoplay } from 'swiper/core';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import 'swiper/css';
import Element from '../Element/Element'
import Image from "../../../Common/Image/Image";
import InjectHTML from "../../../Common/InjectHTML/InjectHTML";
import Link from "next/link";
import styles from './Members.module.scss'
import useServer from "../../../../Hooks/useServer";
SwiperCore.use([Pagination,Autoplay]);
const Members = ({ Data }) => {

	const  [callApi, Loading, setLoading ] = useServer()
	const [SectionData, SetSectionData] = useState(null);
	const [CarosalImage, SetCarosalImage] = useState([]);
	const [MembersCards, SetMembersCards] = useState([]);
	const [OtherData, SetOtherData] = useState(null)
  
  	useEffect(() => {
		let filteredPatners = Data.child.filter((val) =>
		val.slug.includes("members")
		)[0];
		init(filteredPatners)
		SetSectionData(filteredPatners);
		SetCarosalImage(filteredPatners.infocard.filter((val) => val.is_carousel));
		SetMembersCards(filteredPatners.infocard.filter((val) => !val.is_carousel));
	}, []);
	
	const init = async (filteredPatners) =>{
		let response = await callApi(`info-card/categories`, {page_id: filteredPatners.id}, false, 'get', false);
		if(response.error === 1) {
		SetOtherData(response.data)
		}
	} 

 	return (
		<div className={styles.dynamic_content}>
		{SectionData ? (
			<>
				{
					SectionData.sections.map(item => {
						return <Element data={item} key={item.id} />
					})
				}
				{CarosalImage && CarosalImage.length > 0 ? (
					<div className={styles.slider}>
					<Swiper 
						slidesPerView={1} 
						loop 
						pagination={CarosalImage.length > 1 ? { clickable: true } : false}
						autoplay={CarosalImage.length > 1 ? { delay: 10000 } : false}>
						{CarosalImage.map((item) => {
						return (
							<SwiperSlide key={item.id}>
								<div className={styles.slide_wrap}>
									<div className={styles.img_wrap}>
									<Image image={item.image} alt="slider_img"/>
									</div>
								</div>
							</SwiperSlide>
						);
						})}
					</Swiper>
					</div>
				) : null
				}
				<div>
					{
						OtherData && OtherData.length &&
						OtherData.map(val => {
							return (
								<div className={styles.section_other} key={val.id}>
									<h3 className={styles.section_title}>
										<InjectHTML html={val.title} />
									</h3>
									<p className={styles.section_description}>
										<InjectHTML html={val.description} />
									</p>
									<div className={styles.members}>
										{
											MembersCards.map((item) => {
												if(item.info_category_id === val.id)
												return (
												<Link
													href={{ pathname: item.position }}
													target="_blank"
													key={item.id}
												>
													<a className={styles.membox}>
													<p className={styles.text_link}>
													<InjectHTML html={item.title} />
													</p>
													</a>
												</Link>
												);
											})
										}
									</div>
								</div>
							)
						})
					}
				</div>
			</>
		) : (
			<Spinner />
		)}
		</div>
  	);
};

export default Members