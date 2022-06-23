import React, {useState, useEffect, useContext} from 'react'
import Spinner from "../../../../Components/Common/Spinner/Spinner";
import AddElementPopper from '../../../../Components/Common/AddElementPopper/AddElementPopper';
import Element from '../../../../Components/Admin/About/Element/Element'
import AdminAboutLayout from '../../../../Components/Admin/About/AdminAboutLayout/AdminAboutLayout'
import { useSession } from 'next-auth/react';
import useServer from '../../../../Hooks/useServer';
import styles from './WhatWeAimToDo.module.scss'

const whatWeAimToDo = () => {

    const {data:session} = useSession()
    const [callApi, Loading, setLoading ] = useServer()
    const [SectionData,SetSectionData]= useState(null)
    const [AddPopper,SetAddPopper] = useState(false)
    const [Data,SetData] = useState(null)

    useEffect(() => {
        session && init()
    },[session])

    useEffect(() => {
		if(Data){
			SetSectionData(Data.child.filter(val =>val.slug.includes('what-we-aim-to-do'))[0])
		}
	}, [Data])

    const init = async ()=>{
        let response = await callApi('pages/about', {'with': ['child', 'sections'],}, false, 'get', true,session.user.token);
        // console.log('about',response)
        if(response.error === 1) {
            SetData(response)
        }
    }

    const onPreview = () => {
        const win = window.open("/about/what-we-aim-to-do", "_blank");
          win.focus();
    };
    return (
        <AdminAboutLayout Data = {Data}>
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
                                className={`btn ${styles.btn} ${styles.add_element}`}
                                onClick={() => SetAddPopper(true)}
                            >
                                <span>Add element</span>
                                <img src="/assets/icons/add_elem.svg" alt="add element" />
                            </button>
                            <div className={styles.section_btns}>
                                <button className={`btn ${styles.btn} ${styles.preview}`} onClick={onPreview}>Preview</button>
                            </div>
                        </div>
                        {
                            AddPopper && 
                            <AddElementPopper Data = {Data} SetData = {SetData} SetAddPopper={SetAddPopper} pageId={SectionData.id} />
                        }
                    </> :
                    <Spinner />
                }
            </div>
        </AdminAboutLayout>
    )
}

export default whatWeAimToDo