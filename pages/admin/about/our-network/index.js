import React, {useState, useContext, useEffect} from 'react'
import Spinner from "../../../../Components/Common/Spinner/Spinner";
import Element from '../../../../Components/Admin/About/Element/Element'
import AdminAboutLayout from '../../../../Components/Admin/About/AdminAboutLayout/AdminAboutLayout'
import TextEditor from '../../../../Components/Admin/TextEditor';
import DeletePopper from '../../../../Components/Common/DeletePopper/DeletePopper'
import InjectHTML from '../../../../Components/Common/InjectHTML/InjectHTML';
import Dropzone from 'react-dropzone'
import Image from '../../../../Components/Common/Image/Image';
import useServer from '../../../../Hooks/useServer';
import { useSession } from 'next-auth/react'
import styles from './network.module.scss'

const ourNetwork = () => {
    const { data: session } = useSession();
    const [callApi, Loading, setLoading ] = useServer()
    const [SectionData, SetSectionData] = useState(null)
    const [ShowDeletePopper, SetShowDeletePopper] = useState(false)
    const [DeleteItemId, SetDeleteItemId] = useState(null)
    const [Data,SetData] = useState(null)

    useEffect(() => {
        session && mainData()
    },[session])

    const mainData = async ()=>{
        let response = await callApi('pages/about', {'with': ['child', 'sections'],}, false, 'get', true,session.user.token);
        //  console.log('about',response)
        if(response.error === 1) {
            SetData(response)
        }
    }

    useEffect(() => {
        if(Data){
            SetSectionData(Data.child.filter(val => val.slug.includes('our-network'))[0])
        }
    }, [Data])

    const addElement = async () => {
		let response = await callApi(
		"info-card/create",
		{ page_id: SectionData.id },
		false,
		"get",
		false,
		session.user.token
		);
        if(response.error === 1) {
            var temp = {...Data};
            temp.child.map(val => {
                if(val.slug.includes('our-network')) {
                    val.cards = response.data
                    return val
                } else {
                    return val
                }
            })
            SetData(temp)
            SetShowDeletePopper(false)
            SetDeleteItemId(null)
        }
    }

    const DeleteItem = async () => {
		let response = await callApi(
		`info-card/${DeleteItemId}`,
		{ page_id: SectionData.id },
		false,
		"delete",
		false,
		session.user.token
		);
        if(response.error === 1) {
            var temp = {...Data};
            temp.child.map(val => {
                if(val.slug.includes('our-network')) {
                    val.cards = response.data
                    return val
                } else {
                    return val
                }
            })
            SetData(temp)
            SetShowDeletePopper(false)
            SetDeleteItemId(null)
        }
    }
    
    const UpdateItem =async (data) => {
        var formData = new FormData();
        formData.append('title', data.CallToAction);
        formData.append('description', data.Link);
        formData.append('position', data.LinkText);
        ImageData && formData.append('image', data.ImageData);
        formData.append('page_id', SectionData.id);
        let response = await callApi (`info-card/${data.id}`, formData, true, 'put', true,session.user.token);
        if(response.error === 1) {
            var temp = {...Data};
            temp.child.map(val => {
                if(val.slug.includes('our-network')) {
                    val.cards = response.data
                    return val
                } else {
                    return val
                }
            })
            SetData(temp)
            SetShowDeletePopper(false)
            SetDeleteItemId(null)
        }
    }
    const onPreview = () => {
        const win = window.open("/about/network", "_blank");
          win.focus();
    }
    return (
        <AdminAboutLayout Data={Data}>
            <div className={styles.admin_content}>
                {
                    SectionData ?
                    <>
                        <div className={styles.admin_content_wrapper}>
                            {
                                SectionData.sections.map(item => {
                                    console.log(item)
                                    return <Element key={item.id} item={item} id={SectionData.id} Always={true} />
                                })
                            }
                            <p className={styles.stitle_outer}>Logos</p>
                            {
                                SectionData.infocard &&
                                <div className={styles.ccards}>
                                    {
                                        SectionData.infocard.map((item, index) => {
                                            return (
                                                <CardElement key={item + index} Data={Data} SetData = {SetData} {...{item, index, SetShowDeletePopper, SetDeleteItemId, UpdateItem}} />
                                            )
                                        })
                                    }
                                </div>
                            }
                            <button 
                                className={`btn ${styles.btn} ${styles.add_element}`}
                                onClick={() => {
                                    addElement()
                                }}
                            >
                                <span>Add Logo</span>
                                <img src="/assets/icons/add_elem.svg" alt="add element" />
                            </button>
                            <div className={styles.section_btns}>
                                <button className={` btn ${styles.btn} ${styles.preview}`} onClick={onPreview}>Preview</button>
                            </div>
                        </div>
                    </> :
                    <Spinner />
                }
                {
                    ShowDeletePopper &&
                    <DeletePopper SetShowDeletePopper={SetShowDeletePopper} Type="Logo" DeleteItem={DeleteItem} />
            }
            </div>
        </AdminAboutLayout>
    )
}

export default ourNetwork

const CardElement = ({item, index, SetShowDeletePopper, SetDeleteItemId, UpdateItem,Data,SetData}) => {

    const [CallToAction, SetCallToAction] = useState(item.title || '')
    const [Link, SetLink] = useState(item.description || '')
    const [LinkText, SetLinkText] = useState(item.position || '')
    const [Img, SetImg] = useState(item.image ? {type: 'server', data: item.image} : null)
    const [ImageData, SetImageData] = useState(null)
    const [CanEdit, SetCanEdit] = useState(false)

    useEffect(() => {
        SetCallToAction(item.title || '')
        SetLink(item.description || '')
        SetLinkText(item.position || '')
        SetImg(item.image ? {type: 'server', data: item.image} : null)
        SetImageData(null)
        SetCanEdit(false)
    }, [Data])

    const reset = () => {
        SetData({...Data})
    }

    return (
        <>
            <div className={styles.sheadBord}>
                <p className={styles.secBordTitle}>Logo #{index + 1}</p>
                <div className={styles.sgrp}>
                    {
                        CanEdit ?
                        <>
                            <button 
                                className={` btn ${styles.btn} ${styles.space} ${styles.nobord}`}
                                onClick={() => {
                                    reset()
                                    SetCanEdit(false)
                                }}
                            >
                                cancel
                            </button>
                            <button 
                                className={` btn ${styles.btn}`}
                                onClick={() => UpdateItem({CallToAction, Link, LinkText, ImageData, id: item.id})}
                            >
                                update
                            </button>
                        </> :
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
                        <span className={styles.light_text}>(png images recommended)</span>
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
            <div className={styles.section_flex}>
                <div className={`${styles.section} ${styles.left}`}>
                    <div className={styles.shead}>
                        <p className={styles.stitle}>Call To Action</p>
                    </div>
                    <div className={styles.box_content}>
                        <TextEditor 
                            value={CallToAction} 
                            setData={SetCallToAction} 
                            element="p" 
                            elClass="text_container"
                            type="one"
                            readonly={!CanEdit}
                        />
                    </div>
                </div>
                <div className={`${styles.section} ${styles.right}`}>
                    <div className={styles.shead}>
                        <p className={styles.stitle}>Link</p>
                    </div>
                    <div className={styles.box_content}>
                        <TextEditor 
                            value={Link} 
                            setData={SetLink} 
                            element="p" 
                            elClass="text_container"
                            type="none"
                            Title={LinkText}
                            SetTitle={SetLinkText}
                            readonly={!CanEdit}
                        />
                    </div>
                </div>
            </div>
        </>
    )
}
