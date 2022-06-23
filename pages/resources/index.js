import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Spinner from '../../Components/Common/Spinner/Spinner'
import InjectHTML from '../../Components/Common/InjectHTML/InjectHTML'
import Image from '../../Components/Common/Image/Image';
import PanelLayout from '../../Components/Common/PanelLayout/PanelLayout'
import useServer from '../../Hooks/useServer'
import styles from './Resources.module.scss'

const resources = ({location}) => {

    const [Data, SetData] = useState(null)
	const  [callApi, Loading, setLoading ] = useServer()

    useEffect(() => {
		init ()
    }, [])

	const init = async ()=>{
		let response = await callApi('website/resources', {},  false, 'get', true)
		if(response.error === 1) {
			SetData(response.data)
		}
	}

	return (
		<PanelLayout>
			<div className={styles.contains_everything}>
				{
					Data ?
					<div className={styles.resources}>
						<div className={styles.banner}>
							<Image image ={Data.background_image} alt="About" className={styles.bg} />
							<div className={styles.wrapper}>
								<div className="contain">
									<h1>
										<span>{Data.title}</span>
									</h1>
								</div>
							</div>
						</div>
						<div className="contain">
							<div className={styles.resources_list}>
								{
									Data.infocard.map((item, index) => {
										return (
											<Link href={index==0 ? "/resources/external-resources" :( index==1 ? "/resources/publications" : "/resources/blogs")}  key={item.id}>
												<a className={styles.resources_list_item}>
													<Image 
														image={item.image} 
														className={styles.bg}
														alt="External Resources"
													/>
													<div className={styles.inner}>
														<div>
															<p className={styles.rtitle}>
																<InjectHTML html={item.title} />
															</p>
															<p className={styles.rtext}>
																<InjectHTML html={item.description} />
															</p>
															{/* {
																index === 0 ?
																<Link to="/resources/external-resources" className="rlink">Learn more about us!</Link> :
																index === 1 ?
																<Link to="/resources/publications" className="rlink">Learn more about us!</Link> :
																<Link to="/resources/blogs" className="rlink">Learn more about us!</Link>
															} */}
														</div>
													</div>
												</a>
											</Link>
										)
									})
								}
							</div>
						</div>
					</div> : <Spinner />
				}
			</div>
		</PanelLayout>
	)
}

export default resources