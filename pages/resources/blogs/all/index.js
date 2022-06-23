import React, { useState, useEffect } from 'react'
import Spinner from '../../../../Components/Common/Spinner/Spinner'
import Link from 'next/link'
import InjectHTML from '../../../../Components/Common/InjectHTML/InjectHTML'
import Pagination from '../../../../Common/Pagination/Pagination'
import moment from 'moment-timezone'
import Image from '../../../../Components/Common/Image/Image'
import useServer from '../../../../Hooks/useServer'
import PanelLayout from '../../../../Components/Common/PanelLayout/PanelLayout'
import styles from './Blogs.module.scss'

const BlogsAll = () => {

	const [callApi, Loading, setLoading ] = useServer()
    const [Data, SetData] = useState(null)
    const [Config, SetConfig] = useState({'all': 'yes'})
    const [Paginate, SetPaginate] = useState(null)

    useEffect(() => {
		init ()
    }, [Config])

	const init =async ()=>{
		let response = await callApi('website/blogs',Config, false, 'get', true);
		if(response.error === 1) {
			SetData(response.data.result.data)
			SetPaginate(response.data.others)
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
										<li>
											<Link href="/resources/blogs"><a className={styles.active}>Blogs</a></Link>
											<img src="/assets/icons/angle_right_dark.svg" alt="angle_right" />
										</li>
										<li>See All</li>
									</ul>
								</div>
							</div>
							<div className={styles.all_resources}>
								<div className="contain">
									<p className={styles.section_title}>Blogs</p>
									<div className={styles.wrapper}>
										{
											Data.map((item) => (
												<Link href={`/resources/blogs/${item.slug}`} key={item.id}>
													<a className={styles.rwrap}>
														<div className={styles.img_wrap}>
															<Image image = {item.background_image} alt="showcase" />
														</div>
														<div className={styles.content_wrap}>
															<div className={styles.content_wrap_inner}>
																<p className={styles.text_sm}>News</p>
																<p className={styles.title}><InjectHTML html={item.header} /></p>
															</div>
															<p className={styles.date}>{moment(item.published_at).format('Do MMM, YYYY')}</p>
														</div>
													</a>
												</Link>
											))
										}
									</div>
									{ Paginate && <Pagination Data={Paginate} SetConfig={SetConfig} DefaultLimit = {5} Config={Config} /> }
								</div>
							</div>
						</div> : <Spinner />
				}
			</div>
		</PanelLayout>
    )
}

export default BlogsAll