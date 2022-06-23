import React, { useState, useEffect } from "react";
import TextEditor from "../../TextEditor";
import Spinner from "../../../Common/Spinner/Spinner";
import Dropzone from "react-dropzone";
import useServer from "../../../../Hooks/useServer";
import { useSession } from "next-auth/react";
import styles from './EventSeo.module.scss'

const EventSeo = ({data}) => {

    const {data:session} = useSession()
    const [callApi, Loading,setLoading] = useServer()
    const [Title, SetTitle] = useState("");
	const [Description, SetDescription] = useState("");
	const [Tags, SetTags] = useState("");
	const [Image, SetImage] = useState(null);
	const [ImageData, SetImageData] = useState(null);
	const [UpdateBtn, SetUpdateBtn] = useState("Update");
    const [Data, SetData] = useState(null);

	useEffect(() => {
		if (data) {
            SetData(data)
			SetTitle(data.seo_title ? data.seo_title : "");
			SetDescription(data.seo_description ? data.seo_description : "");
			SetTags(data.seo_tags ? data.seo_tags : "");
			SetImage(data.seo_image);
		}
	}, [data]);
    
    const onUpdate = async ()=>{
        console.log('tttt',Title)
        SetUpdateBtn("Updating...");
        var formData = new FormData();
		formData.append("seo_title", Title);
		formData.append("seo_description", Description);
		formData.append("seo_tags", Tags);
		!Image
		? formData.append("background_image", "")
		: formData.append("seo_image", ImageData ? ImageData : Image);
		formData.append("id", Data.id);
		let response = await callApi("pages/" + Data.id, formData, true, "put", true,session.user.token);
        if (response.error === 1) {
            // SetData(responseData.data)
            var temp = Data;
            temp.page = response.data;
            SetData(temp);
            SetImageData(null);
        }
        SetUpdateBtn("Update");

    }
  return (
    <div className={styles.admin_content_edit}>
        {
            Data ?
            <div className={styles.admin_content_wrapper}>
                <div className={styles.section}>
                    <div className ={styles.shead}>
                        <p className={styles.stitle}>Image
                        <span className={styles.light_text}>(recommended dimensions: 520w X 520h)</span>
                        </p>
                        <button className={`btn ${styles.btn}`}onClick = {()=>{
                            SetImage(null)
                        }}>
                            Remove Image
                        </button>
                    </div>
                    <div className={styles.box_content}>  
                        <Dropzone  onDrop={(acceptedFiles) => {
                            SetImage(URL.createObjectURL(acceptedFiles[0]));
                            SetImageData(acceptedFiles[0]);
                        }}
                        >
                            {({getRootProps, getInputProps,isDragActive}) => (
                                <section>
                                    <div {...getRootProps()} className={`${styles.box_content_dropzone} ${Image === null ? styles.show_dropzone : ''}`}>
                                        <input {...getInputProps()} />
                                        {
                                            isDragActive ?
                                            <p>Drop the files here ...</p> :
                                            Image === null ?
                                            <div className={styles.dropzone}>
                                                <p className={styles.color}>Drag an image here</p>
                                                <p className={styles.lgt}>or if you prefer</p>
                                                <p className={styles.color_box}>Choose an image to upload</p>
                                            </div> :
                                            <img src={Image} alt="preview" />
                                        }
                                    </div>
                                </section>
                            )}
                        </Dropzone>
                    </div>
                </div>
                <div className={styles.section}>
                    <div className={styles.shead}>
                        <p className = {styles.stitle}>SEO Title</p>
                    </div>
                    <div className={styles.box_content}>
                        <TextEditor
                            value={Title}
                            setData={SetTitle}
                            element="p"
                            elClass="text_container"
                            type="none"
                        />
                    </div>
                </div>
                <div className={styles.section}>
                    <div className={styles.shead}>
                        <p className = {styles.stitle}>SEODescription</p>
                    </div>
                    <div className={styles.box_content}>
                        <TextEditor
                            value={Description}
                            setData={SetDescription}
                            element="p"
                            elClass="text_container"
                            type="none"
                        />
                    </div>
                </div>
                <div className={styles.section}>
                    <div className={styles.shead}>
                        <p className = {styles.stitle}>SEO Tags</p>
                    </div>
                    <div className={styles.box_content}>
                        <TextEditor
                            value={Tags}
                            setData={SetTags}
                            element="p"
                            elClass="text_container"
                            type="none"
                        />
                    </div>
                </div>
                <div className={styles.section_btns}>
                    <button className={`btn ${styles.btn} ${styles.update} ${styles.orange}`}
                        onClick={() => {
                            onUpdate();
                        }}
                        disabled= {UpdateBtn ==='Update' ? false : true}
                    >
                        {UpdateBtn}
                    </button>
                    <button className={`btn ${styles.btn} ${styles.preview}`}>
                        Preview
                    </button>
                </div>
            </div>:<Spinner/>
        }
    </div>
  )
}

export default EventSeo