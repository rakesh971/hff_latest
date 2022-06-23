import React, {useState, useContext, useEffect} from 'react'
import Spinner from "../../../../Components/Common/Spinner/Spinner";
import DeletePopper from '../../../../Components/Common/DeletePopper/DeletePopper'
import TextEditor from '../../../../Components/Admin/TextEditor';
import Dropzone from 'react-dropzone'
import Image from '../../../../Components/Common/Image/Image';
import useServer from '../../../../Hooks/useServer'
import { useSession } from 'next-auth/react'
import HomeLayout from '../../../../Components/Admin/Home/HomeLayout/HomeLayout'
import styles from './WhatIsHff.module.scss'

const whatIsHff = () => {

    const {data:session} = useSession()
    const [callApi,Loading,setLoading]=useServer()
    const [SectionData, SetSectionData] = useState(null)
    const [ShowDeletePopper, SetShowDeletePopper] = useState(false)
    const [DeleteItemId, SetDeleteItemId] = useState(null)
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
        if(Data){
            SetSectionData(Data.data.infocard)
        }
    }, [Data])
    
    const addElement = async () => {
        let response =await callApi('info-card/create', {page_id:Data.data.id},false, 'get', false,session.user.token);
        if(response.error === 1) {
            var temp = {...Data};
            temp.data.infocard = response.data
            SetData(temp)
            SetShowDeletePopper(false)
            SetDeleteItemId(null)
        }
    }

    const DeleteItem = async () => {
        let response = await callApi(`info-card/${DeleteItemId}`, {page_id: Data.data.id}, false, 'delete', false,session.user.token);
        if(response.error === 1) {
            var temp = {...Data};
            temp.data.infocard = response.data
            SetData(temp)
            SetShowDeletePopper(false)
            SetDeleteItemId(null)
        }
    }

    const UpdateItem =async (data) => {
        var formData = new FormData();
        formData.append('description', data.Description);
        ImageData && formData.append('image', data.ImageData);
        formData.append('page_id', Data.data.id);
        let response =await callApi(`info-card/${data.id}`, formData, true, 'put', true,session.user.token);
        if(response.error === 1) {
            var temp = {...Data};
            temp.data.infocard = response.data
            SetData(temp)
            SetShowDeletePopper(false)
            SetDeleteItemId(null)
        }
    }

    return (
        <HomeLayout Data={Data}>
            <div className={styles.admin_content}>
                {
                    SectionData?
                    <>
                        <div className={styles.admin_content_wrapper}>
                            <p className={styles.stitle_outer}>Slides</p>
                            {
                                SectionData &&
                                <div className={styles.ccards}>
                                    {
                                        SectionData.map((item, index) => {
                                            return (
                                                <CardElement key={item + index} {...{item, index, SetShowDeletePopper, SetDeleteItemId, UpdateItem, Data, SetData}} />
                                            )
                                        })
                                    }
                                </div>
                            }
                            <button 
                                className={` btn ${styles.btn} ${styles.add_element}`}
                                onClick={() => {
                                    addElement()
                                }}
                            >
                                <span>Add Slide</span>
                                <img src="/assets/icons/add_elem.svg" alt="add element" />
                            </button>
                        </div>
                    </> : <Spinner />
                }
                {
                    ShowDeletePopper &&
                    <DeletePopper SetShowDeletePopper={SetShowDeletePopper} Type="Slide" DeleteItem={DeleteItem} />
                }
            </div>
        </HomeLayout>
    )
}

export default whatIsHff

const CardElement = ({item, index, SetShowDeletePopper, SetDeleteItemId, UpdateItem, Data, SetData}) => {

    const [Description, SetDescription] = useState(item.description || '')
    const [Img, SetImg] = useState(item.image ? {type: 'server', data: item.image} : null)
    const [ImageData, SetImageData] = useState(null)
    const [CanEdit, SetCanEdit] = useState(false)

    useEffect(() => {
        SetDescription(item.description || '')
        SetImg(item.image ? {type: 'server', data: item.image} : null)
        SetImageData(null)
        SetCanEdit(false)
    }, [])

    useEffect(() => {
        SetCanEdit(false)
    }, [Data])

    const reset = () => {
        SetData({...Data})
    }

    return (
        <>
            <div className={styles.sheadBord}>
                <p className={styles.secBordTitle}>Slide #{index + 1}</p>
                <div className={styles.sgrp}>
                    {
                        CanEdit ?
                        <>
                            <button 
                                className={`btn ${styles.btn} ${styles.space} ${styles.nobord}`}
                                onClick={() => {
                                    reset()
                                    SetCanEdit(false)
                                }}
                            >
                                cancel
                            </button>
                            <button 
                                className={`btn ${styles.btn}`}
                                onClick={() => UpdateItem({Description, ImageData, id: item.id})}
                            >
                                update
                            </button>
                        </>:
                        <>
                        <button 
                            className={`btn ${styles.btn} ${styles.space} ${styles.nobord}`}
                            onClick={() => {
                                SetDeleteItemId(item.id)
                                SetShowDeletePopper(true)
                            }}
                        >
                            delete
                        </button>
                        <button 
                            className={`btn ${styles.btn}`}
                            onClick={() => SetCanEdit(true)}
                        >
                            edit
                        </button>
                    </>
                    }        
                </div>
            </div>
            <div className={styles.section}>
                <div className={styles.shead}>
                    <p className={styles.stitle}>
                        Image
                        <span className={styles.light_text}>(recommended dimensions: 1440w X 1100h)</span>
                    </p>
                    <button 
                        className={`btn ${styles.btn}`}
                        onClick={() => {
                            SetImg(null)
                            SetImageData(null)
                        }}
                    >
                        Remove image
                    </button>
                </div>
                <div className={styles.box_content}>
                    <Dropzone 
                        onDrop={acceptedFiles => {
                            SetImg({type: 'local', data: URL.createObjectURL(acceptedFiles[0])});
                            SetImageData(acceptedFiles[0]);
                        }}
                        disabled={!CanEdit}
                    >
                        {({getRootProps, getInputProps, isDragActive}) => (
                            <section>
                                <div {...getRootProps()} className={`${styles.box_content_dropzone} ${Img === null ? styles.show_dropzone : styles.bord} ${CanEdit === false ? styles.dis : ''}`}>
                                        <input {...getInputProps()} />
                                    {
                                        isDragActive ?
                                        <p>Drop the files here ...</p> :
                                        !Img ?
                                        <div className={styles.dropzone}>
                                            <p className={styles.color}>Drag an image here</p>
                                            <p className={styles.lgt}>or if you prefer</p>
                                            <p className={styles.color_box}>Choose an image to upload</p>
                                        </div> :
                                        Img.type === 'local' ?
                                        <img src={Img.data} alt="preview" className={styles.img_contain} /> :
                                        <Image image={Img.data} alt="preview" className={styles.img_contain} />
                                    }
                                </div>
                            </section>
                        )}
                    </Dropzone>
                </div>
            </div>
            <div className={styles.section}>
                <div className={styles.shead}>
                    <p className={styles.stitle}>Description</p>
                </div>
                <div className={styles.box_content}>
                    <TextEditor 
                        value={Description} 
                        setData={SetDescription} 
                        element="p" 
                        elClass="text_container"
                        type="one"
                        readonly={!CanEdit}
                    />
                </div>
            </div>
        </>

    )
}