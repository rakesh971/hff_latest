import React, { useState, useEffect } from "react";
import TextEditor from '../../../../Components/Admin/TextEditor'
import Dropzone from "react-dropzone";
import Image from '../../../../Components/Common/Image/Image';
import useServer from '../../../../Hooks/useServer'
import AdminContact from '../../../../Components/Admin/Contact/AdminContact/AdminContact'
import { useSession } from 'next-auth/react'
import styles from './pageSeo.module.scss'

const pageSeo = () => {

    const {data:session} = useSession()
    const [callApi,Loading,setLoading] = useServer()
    const [Title, SetTitle] = useState("");
	const [TitleText, SetTitleText] = useState("");
	const [Description, SetDescription] = useState("");
	const [DescriptionText, SetDescriptionText] = useState("");
	const [Tags, SetTags] = useState("");
	const [TagsText, SetTagsText] = useState("");
	const [Img, SetImg] = useState(null);
	const [ImageData, SetImageData] = useState(null);
	const [UpdateBtn, SetUpdateBtn] = useState("Update");
    const [Data, SetData] = useState(null)
	

	useEffect(() => {
        session && init()
    },[session])

    const init = async ()=>{
        let response = await callApi('pages/home', {'with': ['sections', 'infocard']}, false, 'get', false, session.user.token);
        if(response.error === 1) {
            SetData(response)
        }
    }
   
    useEffect(() => {
		if (Data) {
			SetTitle(Data.data.seo_title ? Data.data.seo_title : "");
			SetTitleText(Data.data.seo_title ? Data.data.seo_title : "");
			SetDescription(Data.data.seo_description ? Data.data.seo_description : "");
			SetDescriptionText(Data.data.seo_description ? Data.data.seo_description : "");
			SetTags(Data.data.seo_tags ? Data.data.seo_tags : "");
			SetTagsText(Data.data.seo_tags ? Data.data.seo_tags : "");
			SetImg(Data.data.seo_image ? {type:'server', data:Data.data.seo_image} : null);
		}
	}, [Data]);
   
	const onUpdate = async() => {
		SetUpdateBtn("Updating...");
		var formData = new FormData();
		formData.append("seo_title", TitleText);
		formData.append("seo_description", DescriptionText);
		formData.append("seo_tags", TagsText);
		!Img
		? formData.append("background_image", "")
		: formData.append("seo_image", ImageData ? ImageData : Img);
		formData.append("id", Data.data.id);
		let response= await callApi("pages/" + Data.data.id, formData, true, "put", true,session.user.token);
        if (response.error === 1) {
            var temp = Data;
            console.log('first',temp)
            temp.data = response.data;
            SetData(temp);
            SetImageData(null);
        }
        SetUpdateBtn("Update");
	};

    return (
        <AdminContact Data = {Data}>
            <div className={styles.admin_content}>
                <div className={styles.admin_content_wrapper}>
                    <div className={styles.section}>
                        <div className={styles.shead}>
                            <p className={styles.stitle}>
                                Image
                                <span className="light_text">(recommended dimensions: 520w X 520h)</span>
                            </p>
                            <button className={`btn ${styles.btn}`}onClick={() => SetImg(null)}>
                                Remove image
                            </button>
                        </div>
                        <div className={styles.box_content}>
                            <Dropzone
                                onDrop={(acceptedFiles) => {
                                    SetImg({type:'local', data:URL.createObjectURL(acceptedFiles[0])});
                                    SetImageData(acceptedFiles[0]);
                                }}
                                >
                                {({ getRootProps, getInputProps, isDragActive }) => (
                                    <section>
                                        <div
                                            {...getRootProps()}
                                            className={`${styles.box_content_dropzone} ${Img === null ? styles.show_dropzone : styles.bord}`}
                                        >
                                            <input {...getInputProps()} />
                                            {isDragActive ? (
                                                <p>Drop the files here ...</p>
                                            ) : Img === null ? (
                                            <div className={styles.dropzone}>
                                                <p className={styles.color}>Drag an image here</p>
                                                <p className={styles.lgt}>or if you prefer</p>
                                                <p className={styles.color_box}>Choose an image to upload</p>
                                            </div> 
                                            ) : (
                                                Img.type === 'local' ?
                                                <img src={Img.data} alt="preview" className={styles.img_contain} /> :
                                                <Image image={Img.data} alt="preview" className={styles.img_contain} />
                                            )}
                                        </div>
                                    </section>
                                )}
                            </Dropzone>
                        </div>
                    </div>
                    <div className={styles.section}>
                        <div className={styles.shead}>
                            <p className={styles.stitle}>SEO Title</p>
                        </div>
                        <div className={styles.box_content}>
                            <TextEditor
                                value={Title}
                                setData={SetTitle}
                                element="p"
                                elClass="text_container"
                                type="none"
                                Title={TitleText}
                                SetTitle={SetTitleText}
                            />
                        </div>
                    </div>
                    <div className={styles.section}>
                        <div className={styles.shead}>
                            <p className={styles.stitle}>SEO Description</p>
                        </div>
                        <div className={styles.box_content}>
                            <TextEditor
                                value={Description}
                                setData={SetDescription}
                                element="p"
                                elClass="text_container"
                                type="none"
                                Title={DescriptionText}
                                SetTitle={SetDescriptionText}
                            />
                        </div>
                    </div>
                    <div className={styles.section}>
                        <div className={styles.shead}>
                            <p className={styles.stitle}>SEO Tags</p>
                        </div>
                        <div className={styles.box_content}>
                            <TextEditor
                                value={Tags}
                                setData={SetTags}
                                element="p"
                                elClass="text_container"
                                type="none"
                                Title={TagsText}
                                SetTitle={SetTagsText}
                            />
                        </div>
                    </div>
                    <div className={styles.section_btns}>
                        <button
                            className= {` btn ${styles.btn} ${styles.update} ${styles.orange}`}
                            onClick={() => {
                                onUpdate();
                            }}
                            disabled={UpdateBtn === "Update" ? false : true}
                        >
                            {UpdateBtn}
                        </button>
                        <button className={` btn ${styles.btn} ${styles.preview}`} >Preview</button>
                    </div>
                </div>
            </div>
        </AdminContact>
    )
}

export default pageSeo