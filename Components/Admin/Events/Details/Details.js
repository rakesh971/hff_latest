import React, {useState, useEffect} from 'react'
import DatePicker from '../../DatePicker/DatePicker'
import TextEditor from '../../TextEditor'
import useServer from '../../../../Hooks/useServer'
import Dropzone from 'react-dropzone'
import { useSession } from 'next-auth/react'
import Image from '../../../Common/Image/Image'
import DeletePopper from '../../../Common/DeletePopper/DeletePopper'
import styles from './Details.module.scss'

const Details = ({UpdateData, data}) => {

    const {data:session} = useSession()
    const [callApi,Loading,setLoading] = useServer()
    const [Overview,SetOverview] = useState(data.eventDetail.overview)
    const [CanEdit, SetCanEdit] = useState(false)
    const [DescCanEdit,SetDescCanEdit] = useState(false)
    const [Desc, SetDesc] = useState(data.seo_description)
    const [DescText, SetDescText] = useState(data.seo_description)
    const [Zoom,SetZoom] = useState(data.call_to_action || '')
    const [ZoomText, SetZoomText] = useState(data.call_to_action || "");
    const [HeaderCanEdit,SetHeaderCanEdit] = useState(false)
    const [Header, SetHeader] = useState(data.sections && data.sections[0].content || '')
    const [Cards,SetCards] = useState(data.infocard)
    const [ShowCalendar, SetShowCalendar] = useState(false);
    const [ShowDeletePopper, SetShowDeletePopper] = useState(false);
    const [DeleteItemId, SetDeleteItemId] = useState(null);
   
    useEffect(() => {
        SetOverview(data.eventDetail.overview)
        SetZoom(data.call_to_action)
        SetCanEdit(false)
        SetDescCanEdit(false)
    }, [data])
   
    const UpdateSection =async () => {
        let response = await callApi(`sections/${data.sections[0].id}`, {content: Header, page_id: data.id}, false, 'put', false,session.user.token);
        if(response.error === 1) {
            SetHeaderCanEdit(false)
        }
    }
    
    const AddItem = async () => {
        let response = await callApi('info-card/create',{page_id:`${data.id}`}, false, 'get', false,session.user.token);
        if(response.error === 1) {
            SetCards(response.data)
            SetShowDeletePopper(false)
            SetDeleteItemId(null)
            SetCanEdit(false)
            SetDescCanEdit(false)
        }
    }

    const DeleteItem = async () =>{
        let response = await callApi(`info-card/${DeleteItemId}`, {page_id: data.id}, false, 'delete', false,session.user.token);
        if(response.error === 1) {
            SetCards(response.data)
            SetShowDeletePopper(false)
            SetDeleteItemId(null)
            SetCanEdit(false)
            SetDescCanEdit(false)
        }
    }

    const UpdateItem = async (item) =>{
        console.log('imag',item.ImageData)
        var formData = new FormData();
        formData.append('title', item.Name);
        formData.append('description', item.Description);
        ImageData && formData.append('card_pic', item.ImageData);
        formData.append('page_id', data.id);
        let response = await callApi(`info-card/${item.id}`, formData, true, 'put', true,session.user.token); 
        console.log('irst',response)
        if(response.error === 1) {
            SetCards(response.data)
            SetShowDeletePopper(false)
            SetDeleteItemId(null)
            SetCanEdit(false)
            SetDescCanEdit(false)
        }
    }
   
    return (
        <>
            <div className={`${styles.admin_content_edit} ${styles.admin_content_wrapper}`}>
                <div className={styles.admin_content_edit_wrapper}>
                    <div className = {styles.section}>
                        <div className = {styles.shead}>
                            <p className = {styles.stitle}>Overview</p>
                            <div className = {styles.sgrp}>
                                {
                                    CanEdit ?
                                    <>
                                        <button className={`btn ${styles.btn} ${styles.space} ${styles.nobord}`}
                                        
                                        onClick={()=>{
                                            SetOverview(data.eventDetail.overview || '')
                                            SetCanEdit(false)}}>
                                        cancel 
                                        </button>
                                        <button className={`btn ${styles.btn}`}
                                            onClick={() => UpdateData(Overview, DescText, Zoom)}
                                        >
                                            Update
                                        </button>
                                    </> :
                                    <>
                                    <button className={`btn ${styles.btn}`}
                                        onClick={()=>{
                                            SetCanEdit(true)
                                        }}
                                    >
                                        edit
                                    </button>
                                    </>
                                }
                            </div>
                        </div>
                        <div className={styles.box_content}>
                            <TextEditor
                                value={Overview || ''} 
                                setData={SetOverview} 
                                element = 'p'
                                elClass='text_container'
                                readonly = {!CanEdit}
                            />
                        </div>
                    </div>
                    <div className={styles.section}>
                        <div className={styles.shead}>
                            <p className={styles.stitle}>Display Description</p>
                            <div className={StyleSheet.sgrp}>
                                {
                                    DescCanEdit ?
                                    <>
                                        <button className={`btn ${styles.btn} ${styles.space} ${styles.nobord}`}
                                            onClick={()=>{
                                                SetDescText(data.seo_description || '')
                                                SetDescCanEdit(false)
                                            }}
                                        >
                                        cancel 
                                        </button>
                                        <button className={`btn ${styles.btn}`}
                                            onClick={() => UpdateData(Overview, DescText)}
                                        >
                                            Update
                                        </button>
                                    </> :
                                    <>
                                    <button className={`btn ${styles.btn}`}
                                    onClick={()=>{
                                        SetDescCanEdit(true)
                                    }}>
                                        edit
                                    </button>
                                    </>
                                }
                            </div>
                        </div>
                        <div className={styles.box_content}>
                            <TextEditor
                                value={Desc || ''} 
                                setData={SetDesc} 
                                element="p" 
                                elClass="text_container"
                                Title={DescText}
                                SetTitle={SetDescText}
                                readonly={!DescCanEdit}
                            />
                            <small styles ={{color:'#6c6c6c'}}>Only 160 characters allowed</small>
                        </div>
                    </div>
                    <div className={styles.section}>
                        <div className={styles.shead}>
                            <p className={styles.stitle}>Zoom Link</p>
                            <div className={StyleSheet.sgrp}>
                                {
                                    CanEdit ?
                                    <>
                                        <button className={`btn ${styles.btn} ${styles.space} ${styles.nobord}`}
                                            onClick={() => {
                                                SetZoom(data.call_to_action || '')
                                                SetZoomText(data.call_to_action || '')
                                                SetCanEdit(false)
                                            }}
                                        >
                                        cancel 
                                        </button>
                                        <button className={`btn ${styles.btn}`}
                                           onClick={() => UpdateData(Overview, DescText, ZoomText)}
                                        >
                                            Update
                                        </button>
                                    </> :
                                    <>
                                    <button className={`btn ${styles.btn}`}
                                        onClick={()=>{
                                            SetCanEdit(true)
                                        }}
                                    >
                                        edit
                                    </button>
                                    </>
                                }
                            </div>
                        </div>
                        <div className={styles.box_content}>
                            <TextEditor
                                 value={Zoom || ''} 
                                 setData={SetZoom} 
                                 element="p" 
                                 elClass="text_container"
                                 type="none"
                                 Title={ZoomText}
                                 SetTitle={SetZoomText}
                                 readonly={!CanEdit}
                            />
                        </div>
                    </div>
                    <div className={styles.section}>
                        <div className={styles.shead}>
                            <p className={styles.stitle}>Header #1 </p>
                            <div className={StyleSheet.sgrp}>
                                {
                                    HeaderCanEdit ?
                                    <>
                                        <button className={`btn ${styles.btn} ${styles.space} ${styles.nobord}`}
                                            onClick={()=>{
                                                SetHeader(data.sections[0].content || '')
                                                SetHeaderCanEdit(false)
                                            }}
                                        >
                                        cancel 
                                        </button>
                                        <button className={`btn ${styles.btn}`}
                                            onClick={()=>{
                                                UpdateSection()
                                            }}
                                        >
                                            Update
                                        </button>
                                    </> :
                                    <>
                                    <button className={`btn ${styles.btn}`}
                                        onClick={()=>{
                                            SetHeaderCanEdit(true)
                                        }}
                                    >
                                        edit
                                    </button>
                                    </>
                                }
                            </div>
                        </div>
                        <div className={styles.box_content}>
                            <TextEditor
                                 value={Header}
                                setData={SetHeader} 
                                element="p" 
                                elClass="text_container"
                                type="one"
                                readonly={!HeaderCanEdit}
                            />
                        </div>
                    </div>
                    <p className={styles.stitle_outer}>Keynote Speakers (Optional)</p>
                    {
                        Cards &&
                        <div className ={styles.ccards}>
                            {
                                Cards.map((item,index) =>{
                                    return(
                                        <CardElement key ={item + index} {...{item, index, SetShowDeletePopper,SetDeleteItemId,UpdateItem, data}}/>
                                    )
                                })
                            }
                        </div>
                    }
                    <button 
                            className={`btn ${styles.btn} ${styles.add_element}`}
                            onClick={() => AddItem()}
                        >
                            <span>Add keynote speaker</span>
                            <img src="/assets/icons/add_elem.svg" alt="add element" />
                    </button>
                </div>
            </div>
            {
                ShowCalendar &&
                <DatePickPopper SetShowCalendar={SetShowCalendar} type="multiple" />
            }
            {
                ShowDeletePopper &&
                <DeletePopper SetShowDeletePopper={SetShowDeletePopper} Type="Speaker" DeleteItem={DeleteItem} />
            }
        </>
    )
    }

    export default Details

    const CardElement = ({item, index, SetShowDeletePopper, SetDeleteItemId, UpdateItem, data}) => {

        const [Name, SetName] = useState(item.title || '')
        const [Description, SetDescription] = useState(item.description || '')
        const [Img, SetImg] = useState(item.image ? {type: 'server', data: item.image} : null)
        const [ImageData, SetImageData] = useState(null)
        const [CanEdit, SetCanEdit] = useState(false)

        useEffect(() => {
            SetName(item.title || '')
            SetDescription(item.description || '')
            SetImg(item.image ? {type:'server', data:item.image} : null)
            SetImageData(null)
            SetCanEdit(false)
        }, [item])


        // const reset = () =>{
        //     setData({...data})
        // }

        return (
            <>
                <div className={styles.sheadBord}>
                    <p className={styles.secBordTitle}>Keynote speaker #{index + 1}</p>
                    <div className={styles.sgrp}>
                        {
                            CanEdit ?
                            <>
                            <button className={`btn ${styles.btn} ${styles.space} ${styles.nobord}`}
                                onClick={() => {
                                    // reset()
                                    SetCanEdit(false)
                                }}
                            >
                                cancel
                            </button>
                            <button className={`btn ${styles.btn}`}
                            onClick={() => UpdateItem({Name, Description, ImageData, id: item.id})}
                            >
                                update
                            </button>
                            </> :
                            <>
                                <button className={`btn ${styles.btn} ${styles.space} ${styles.nobord}`}
                                    onClick={() => {
                                        SetDeleteItemId(item.id)
                                        SetShowDeletePopper(true)
                                    }}
                                >
                                    delete
                                </button>
                                <button className={`btn ${styles.btn}`}
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
                        <p className={styles.stitle}>Title</p>
                    </div>
                    <div className={styles.box_content}>
                        <TextEditor
                            value={Name} 
                            setData={SetName} 
                            element="p" 
                            elClass="text_container"
                            type="one"
                            readonly={!CanEdit}
                        />
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
                            type="two"
                            readonly={!CanEdit}
                        />
                    </div>
                </div>
                <div className={styles.section}>
                    <div className={styles.shead}>
                        <p className={styles.stitle}>
                            Image
                            <span className={styles.light_text}>(recommended dimensions: 520w X 520h)</span>
                        </p>
                        {
                            CanEdit &&
                            <button className={`btn ${styles.btn}`}
                                onClick={() =>{
                                    SetImg(null)
                                    SetImageData(null)
                                }}
                            >Remove Image</button>
                        }
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
                                    <div {...getRootProps()} className={`${styles.box_content_dropzone} ${Image === null ? styles.show_dropzone : styles.bord} ${CanEdit === false ? styles.dis : ''}`}>
                                        <input {...getInputProps()} />
                                        {
                                            isDragActive ?
                                            <p>Drop the files here ...</p> :
                                            Img === null ?
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
            </>
        )
        }
