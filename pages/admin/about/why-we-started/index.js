import React, { useState,useContext, useEffect} from 'react'
import Spinner from "../../../../Components/Common/Spinner/Spinner";
import AddElementPopper from '../../../../Components/Common/AddElementPopper/AddElementPopper';
import Element from '../../../../Components/Admin/About/Element/Element'
import AdminAboutLayout from '../../../../Components/Admin/About/AdminAboutLayout/AdminAboutLayout'
import useServer from '../../../../Hooks/useServer';
import { useSession } from 'next-auth/react';
import styles from './WhyWeStarted.module.scss'

const whyWeStarted = () => {

	const {data:session} = useSession()
	const [callApi, Loading, setLoading ] = useServer()
	const [SectionData, SetSectionData] = useState(null)
	const [AddPopper, SetAddPopper] = useState(false)
	const [Data,SetData] = useState(null)

    useEffect(() => {
        session && init()
    },[session])

    const init = async ()=>{
        let response = await callApi('pages/about', {'with': ['child', 'sections'],}, false, 'get', true,session.user.token);
        // console.log('about',response)
        if(response.error === 1) {
            SetData(response)
        }
    }
	
	useEffect(() => {
		if(Data){
			SetSectionData(Data.child.filter(val => val.slug.includes('why-we-started'))[0])
		}
	}, [Data])
	
	const onPreview = () => {
		const win = window.open("/about/why-we-started", "_blank");
			win.focus();
	};

	return (
		<AdminAboutLayout Data={Data}>
			<div className={styles.admin_content}>
				{
					SectionData ?
					<>
						<div className={styles.admin_content_wrapper}>
							{
								SectionData.sections.map(item => {
									return <Element key={item.id} item={item} id={SectionData.id} />
								})
							}
							<button 
								className={` btn ${styles.btn} ${styles.add_element}`}
								onClick={() => SetAddPopper(true)}
							>
								<span>Add element</span>
								<img src="/assets/icons/add_elem.svg" alt="add element" />
							</button>
							<div className={styles.section_btns}>
								<button className={`${styles.btn} ${styles.preview}`} onClick={onPreview}>Preview</button>
							</div>
						</div>
						{
							AddPopper &&
							<AddElementPopper  Data = {Data} SetData = {SetData} SetAddPopper={SetAddPopper} pageId={SectionData.id} />
						}
					</>:<Spinner/>
				}
			</div>
		</AdminAboutLayout>
	)
}

export default whyWeStarted