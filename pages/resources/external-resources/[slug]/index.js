import React, { useState, useEffect } from "react";
import Spinner from "../../../../Components/Common/Spinner/Spinner";
import InjectHTML from "../../../../Components/Common/InjectHTML/InjectHTML";
import Link from 'next/link'
import Image from "../../../../Components/Common/Image/Image";
import PanelLayout from "../../../../Components/Common/PanelLayout/PanelLayout";
import useServer from "../../../../Hooks/useServer";
import {useRouter} from 'next/router'
import styles from './View.module.scss'

const ExternalResourcesView = () => {
  
	const router = useRouter()
	// console.log('router', router.query)
	const [callApi,Loading,setLoading] =useServer()
	const [Data, SetData] = useState(null)

	useEffect(()=>{
		if(router.isReady){
			init ()
		}
	},[router])
	
	const init = async ()=>{
		let response = await callApi(`website/external/${router.query.slug}`,{}, false, 'get', false);
		if(response.error === 1) {
			SetData(response.data)
		}
	}
    
    return (
		<PanelLayout>
			<div className="contains_everything">
				{Data ? (
					<div className={styles.resources}>
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
										Back
									</button>
								</li>
								<li>
									<Link href="/resources">
										<a className={styles.active}>
											Resources
										</a>
									</Link>
									<img
										src="/assets/icons/angle_right_dark.svg"
										alt="angle_right"
									/>
								</li>
								<li>
									<Link href="/resources/external-resources">
										<a className={styles.active}>
											External Resources
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
										<div className={`${styles.img_wrap} ${styles.lg} p-3`}>
											<Image
												image={Data.background_image}
												alt = 'document_holder'
											/>
										</div>
										<Link href={{ pathname: Data.call_to_action }} target="_blank">
											<a className={`${styles.btn } ${styles.download_btn} ${styles.sm}`}>Read More</a>
										</Link>
									</div>
									<div className={styles.content_wrap}>
										<div className={`${styles.img_wrap} ${styles.sm}`}>
											<Image
													image={Data.background_image}
													alt = 'document_holder'
											/>
										</div>
										<div className={styles.dynamic_content}>
											<p className={styles.dark_title}>Overview</p>
											<p className={styles.text}>
												<InjectHTML html={Data.body} />
											</p>
											<Link
												href={{ pathname: Data.call_to_action }}
												target="_blank"
											>
												<a className={`${styles.btn} ${styles.download_btn} ${styles.lg}`}>Read More</a>
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


export default ExternalResourcesView