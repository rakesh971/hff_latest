import React, {useState, useEffect} from 'react'
import TextEditor from "../../../../Components/Admin/TextEditor";
import useServer from '../../../../Hooks/useServer';
import Spinner from "../../../../Components/Common/Spinner/Spinner";
import AdminContact from '../../../../Components/Admin/Contact/AdminContact/AdminContact'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import styles from './details.module.scss'

const Details = () => {

    const {data:session} = useSession()
    const [callApi, Loading, setLoading ] = useServer()
	const [Footer, SetFooter] = useState('')
	const [Address, SetAddress] = useState('')
	const [Email, SetEmail] = useState('')
	const [Phone, SetPhone] = useState('')
	const [Facebook, SetFacebook] = useState('')
	const [Twitter, SetTwitter] = useState('')
	const [Linked, SetLinked] = useState('')
	const [FacebookTitle, SetFacebookTitle] = useState('')
	const [TwitterTitle, SetTwitterTitle] = useState('')
	const [LinkedTitle, SetLinkedTitle] = useState('')
    const [Data,SetData] = useState(null)

    useEffect(() => {
        session && mainData()
    },[session])


    const mainData = async () => {
      let response = await callApi('pages/contact', {'with[]': 'options'}, false, 'get', false,session.user.token);
      if(response.error === 1) {
        SetData(response.data)
        console.log(response.data)
    }
    }

    const onPreview = () => {
        const win = window.open("/contact", "_blank");
          win.focus();
    };

    useEffect(() => {
        if(Data) {
            SetAddress(Data.options.filter(val => val.key === 'address')[0].value)
            SetEmail(Data.options.filter(val => val.key === 'email')[0].value)
            SetPhone(Data.options.filter(val => val.key === 'phone')[0].value)
            SetFacebook(Data.options.filter(val => val.key === 'facebook')[0].value)
            SetTwitter(Data.options.filter(val => val.key === 'twitter')[0].value)
            SetLinked(Data.options.filter(val => val.key === 'linkedin')[0].value)
            SetFacebookTitle(Data.options.filter(val => val.key === 'facebook')[0].value)
            SetTwitterTitle(Data.options.filter(val => val.key === 'twitter')[0].value)
            SetLinkedTitle(Data.options.filter(val => val.key === 'linkedin')[0].value)
            SetFooter(Data.options.filter(val => val.key === 'footer')[0].value)
            // SetYouTube(Data.options.filter(val => val.key === 'youtube')[0].value)
            // SetInstagram(Data.options.filter(val => val.key === 'instagram')[0].value)
        }
    }, [Data])

    const UpdateData =  async () => {
        let response = await callApi('options', {
            'footer': Footer,
            'address': Address,
            'email': Email,
            'phone': Phone,
            'facebook': FacebookTitle,
            'twitter': TwitterTitle,
            'linkedin': LinkedTitle,
            // 'youtube': YouTube,
            // 'instagram': Instagram,
            'page_id': Data.id
        }, true, 'put', false,session.user.token);
        if(response.error === 1) {
            var temp = {...Data}
            temp.page = response.data
            SetData(temp)
        }
    }

    return (
        <AdminContact Data= {Data}>
            <div className={styles.admin_content}>
                {
                    Data ?
                    <div className={styles.admin_content_wrapper}>
                        <div className={styles.section}>
                            <div className={styles.shead}>
                                <p className={styles.stitle}>Footer</p>
                            </div>
                            <div className={styles.box_content}>
                                <TextEditor 
                                    value={Footer} 
                                    setData={SetFooter} 
                                    element="p" 
                                    elClass="text_container"
                                    type="none"
                                />
                            </div>
                        </div>
                        <div className={styles.section}>
                            <div className={styles.shead}>
                                <p className={styles.stitle}>Address</p>
                            </div>
                            <div className={styles.box_content}>
                                <TextEditor 
                                    value={Address} 
                                    setData={SetAddress} 
                                    element="p" 
                                    elClass="text_container"
                                    type="none"
                                />
                            </div>
                        </div>
                        <div className={styles.section}>
                            <div className={styles.shead}>
                                <p className={styles.stitle}>Email</p>
                            </div>
                            <div className={styles.box_content}>
                                <TextEditor 
                                    value={Email} 
                                    setData={SetEmail} 
                                    element="p" 
                                    elClass="text_container"
                                    type="none"
                                />
                            </div>
                        </div>
                        <div className={styles.section}>
                            <div className={styles.shead}>
                                <p className={styles.stitle}>Phone Number</p>
                            </div>
                            <div className={styles.box_content}>
                                <TextEditor 
                                    value={Phone} 
                                    setData={SetPhone} 
                                    element="p" 
                                    elClass="text_container"
                                    type="none"
                                />
                            </div>
                        </div>
                        <div className={styles.section}>
                            <div className={styles.shead}>
                                <p className={styles.stitle}>Social Media Links</p>
                            </div>
                            <div className={styles.social_box}>
                                <p className={styles.stitle_sm}>Facebook</p>
                                <div className={styles.box_content}>
                                    <TextEditor 
                                        value={Facebook} 
                                        setData={SetFacebook} 
                                        element="p" 
                                        elClass="text_container"
                                        type="none"
                                        Title={FacebookTitle}
                                        SetTitle={SetFacebookTitle}
                                    />
                                </div>
                            </div>
                            <div className={styles.social_box}>
                                <p className={styles.stitle_sm}>Twitter</p>
                                <div className={styles.box_content}>
                                    <TextEditor 
                                        value={Twitter} 
                                        setData={SetTwitter} 
                                        element="p" 
                                        elClass="text_container"
                                        type="none"
                                        Title={TwitterTitle}
                                        SetTitle={SetTwitterTitle}
                                    />
                                </div>
                            </div>
                            <div className={styles.social_box}>
                                <p className={styles.stitle_sm}>LinkedIn</p>
                                <div className={styles.box_content}>
                                    <TextEditor 
                                        value={Linked} 
                                        setData={SetLinked} 
                                        element="p" 
                                        elClass="text_container"
                                        type="none"
                                        Title={LinkedTitle}
                                        SetTitle={SetLinkedTitle}
                                    />
                                </div>
                            </div>
                            {/* <div className="social_box">
                                <p className="stitle_sm">Instagram</p>
                                <div className="box_content">
                                    <TextEditor 
                                        value={Instagram} 
                                        setData={SetInstagram} 
                                        element="p" 
                                        elClass="text_container"
                                        type="none"
                                    />
                                </div>
                            </div> */}
                        </div>
                        <div className={styles.section_btns}>
                            <button 
                                className={` btn ${styles.btn} ${styles.update} ${styles.orange}`}
                                onClick={() => UpdateData()}
                            >Update</button>
                            <button className={` btn ${styles.btn} ${styles.preview}`} onClick={()=>{onPreview()}}>Preview</button>
                        </div>
                    </div> : <Spinner />
                }
            </div>
       </AdminContact>
    )
}

export default Details