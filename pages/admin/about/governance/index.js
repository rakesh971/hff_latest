import React, { useState, useContext, useEffect, useRef } from 'react'
import Spinner from "../../../../Components/Common/Spinner/Spinner";
import Element from '../../../../Components/Admin/About/Element/Element'
import AdminAboutLayout from '../../../../Components/Admin/About/AdminAboutLayout/AdminAboutLayout'
import TextEditor from "../../../../Components/Admin/TextEditor";
import useServer from "../../../../Hooks/useServer";
import DeletePopper from '../../../../Components/Common/DeletePopper/DeletePopper'
import InjectHTML from '../../../../Components/Common/InjectHTML/InjectHTML';
import Dropzone from 'react-dropzone'
import Image from '../../../../Components/Common/Image/Image';
import { FaAngleDown } from 'react-icons/fa'
import { useSession } from 'next-auth/react'
import styles from './governance.module.scss'

const governance = () => {

    const {data:session} = useSession()
    const buttonRef = useRef()
    const [callApi, Loading, setLoading ] = useServer()
    const [SectionData, SetSectionData] = useState(null)
    const [OtherData, SetOtherData] = useState(null)
    const [ActiveItem, SetActiveItem] = useState(null)
    const [ShowDeletePopper, SetShowDeletePopper] = useState(false)
    const [DeleteItemId, SetDeleteItemId] = useState(null)
    const [DeleteType, SetDeleteType] = useState(null)
    const [ShowDrop, SetShowDrop] = useState(false)
    const [SelectedSection, SetSelectedSection] = useState(null)
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
        var temp = Data.child.find(val => val.slug.includes('governance'))
        SetSectionData(temp)
        init(temp)
       }
    }, [Data])

    const init = async (temp)=>{
        let response = await callApi(`info-card/categories`, { page_id: temp.id }, false, 'get', false ,session.user.token);
        console.log('about',response)
        if (response.error === 1) {
            SetOtherData(response.data.map(val => {
                val.canEdit = false
                return val
            }))
            if (!SelectedSection) {
                SetSelectedSection(response.data[0])
            }
            SetShowDeletePopper(false)
            SetDeleteItemId(null)
            SetDeleteType(null)
        }
    }
    useEffect(()=>{
        document.addEventListener('click',handleClickOutside,true);
        return()=>{
            document.removeEventListener('click', handleClickOutside, true);
        }
    },[])

    const handleClickOutside = (event) => {
        if(buttonRef.current && !buttonRef.current.contains(event.target)){
            SetShowDrop(false)
        }
    }

    const UpdateOtherData = (id, text, type) => {
        var temp = [...OtherData]
        SetOtherData(temp.map(chng => {
            if (chng.id == id) {
                chng[type] = text
            }
            return chng
        }))
    }
    // console.log('first',SectionData)
    const DeleteItem =async () => {
        let response = null
        if (DeleteType === 'Section') {
            SetOtherData(OtherData.filter(n => n.id != SelectedSection.id))
            response = await callApi(`info-card/categories/${SelectedSection.id}`, {page_id: SectionData.id,}, true, 'delete', false,session.user.token);
            SetOtherData(OtherData.filter(n => n.id != SelectedSection.id))
            if(response && response.error === 1){
                SetSelectedSection(response.data[0])
            }
        } else {
            response = await callApi(`info-card/${DeleteItemId}`, { page_id: SectionData.id }, false, 'delete', false,session.user.token);
            let temp = { ...SectionData }
            temp.infocard = SectionData.infocard.filter(n => n.id != DeleteItemId);
            SetSectionData(temp);
            SetShowDeletePopper(false)
            if(response && response.error === 1){
                SetSelectedSection(response.data[0])
            }
        }
    }

    const addElement = async (data) => {
        let response = await callApi('info-card/create',{page_id:SectionData.id, info_category_id: data.id}, false, 'get', false,session.user.token);
        if (response.error === 1) {
            var temp = { ...Data };
            temp.child.map(val => {
                if (val.slug.includes('governance')) {
                    val.cards = response.data
                    return val
                } else {
                    return val
                }
            })
            SetData(temp)
            SetShowDeletePopper(false)
            SetDeleteItemId(null)
            SetDeleteType(null)
        }
    }

    const UpdateItem = async (data) => {
        var formData = new FormData();
        formData.append('title', data.Name);
        formData.append('description', data.LinkText);
        ImageData && formData.append('image', data.ImageData);
        formData.append('position', data.Position);
        formData.append('page_id', SectionData.id);
        let response = await callApi(`info-card/${data.id}`, formData, true, 'put', true,session.user.token);
        if (response.error === 1) {
            var temp = { ...Data };
            temp.child.map(val => {
                if (val.slug.includes('governance')) {
                    val.cards = response.data
                    return val
                } else {
                    return val
                }
            })
            SetData(temp)
            SetShowDeletePopper(false)
            SetDeleteItemId(null)
            SetDeleteType(null)
        }
    }

    const onPreview = () => {
        const win = window.open("/about/governance", "_blank");
        win.focus();
    };

    const UpdateSection =async (data) => {
        let response = await callApi(`info-card/categories`, {page_id: SectionData.id,title: data.title,description: data.description,id: data.id}, false, 'put', false,session.user.token);
        if (response.error === 1) {
            SetOtherData(response.data.map(val => {
                val.canEdit = false
                return val
            }))
        }   SetShowDeletePopper(false)
            SetDeleteItemId(null)
            SetDeleteType(null)
    }

    const addSelection  = async () =>{
        let response = await callApi(`info-card/categories`, {page_id: SectionData.id,title: 'Title',description: '',}, false, 'put', false,session.user.token);
        if(response.error === 1){
            SetSelectedSection(response.data.find(val => val.id === response.more))
        }
            SetShowDeletePopper(false)
            SetDeleteItemId(null)
            SetDeleteType(null)
    } 

    return (
        <AdminAboutLayout Data = {Data}>
            <div className={styles.admin_content}>
                {
                    SectionData ?
                    <>
                    <div className = {styles.admin_content_wrapper}>
                        {
                            SectionData.sections.map(item => {
                                return <Element key={item.id} item={item} id={SectionData.id} Always={true} />
                            })
                        }
                        <div className={styles.section}>
                            <div className= {`${styles.shead} ${styles.bord}`}>
                                <div className={styles.shead_drop}>
                                    <p className={styles.stitle}>Section</p>
                                    <div className={styles.drop}>
                                        <button
                                            className={styles.btn}
                                            onClick={() => SetShowDrop(true)}
                                        >
                                            {
                                                SelectedSection ?
                                                    <InjectHTML html={SelectedSection.title} /> : 'select section'
                                            }
                                            <FaAngleDown className={styles.icon} />
                                        </button>
                                        {
                                            ShowDrop && OtherData.length > 0 &&
                                            <div className={styles.drop_menu} ref={buttonRef}>
                                                <ul>
                                                    {
                                                        OtherData.map(val => {
                                                            return (
                                                                <li key={val.id}>
                                                                    <button
                                                                        className={`${styles.btn} ${val.id === SelectedSection.id ? styles.active : ''}`}
                                                                        onClick={() => {
                                                                            SetSelectedSection(val)
                                                                            SetShowDrop(false)
                                                                        }}
                                                                    >
                                                                        <InjectHTML html={val.title} />
                                                                    </button>
                                                                </li>
                                                            )
                                                        })
                                                    }
                                                </ul>
                                            </div>
                                        }
                                    </div>
                                </div>
                                <div className={styles.sgrp}>
                                    <button
                                        className={` btn ${styles.btn} ${styles.nobord}`}
                                        onClick={() => {
                                            SetDeleteItemId(SectionData.id)
                                            SetDeleteType('Section')
                                            SetShowDeletePopper(true)
                                        }}
                                    >
                                        delete
                                    </button>
                                    <button
                                        className={` btn ${styles.btn} ${styles.space_left}`}
                                        onClick={() => {
                                        addSelection()
                                        }}
                                    >
                                        add section
                                    </button>
                                </div>
                            </div>
                        </div>
                        {
                            OtherData &&
                            OtherData.map(val => {
                                if (val.id === SelectedSection.id)
                                    return (
                                        <div key={val.id}>
                                            <div className={styles.section}>
                                                <div className={styles.shead}>
                                                    <p className={styles.stitle}>Section Title</p>
                                                    <div className={styles.sgrp}>
                                                        {
                                                            val.canEdit ?
                                                                <>
                                                                    <button
                                                                        className={`btn ${styles.btn} ${styles.space} ${styles.nobord}`}
                                                                        onClick={() => {
                                                                            SetOtherData(OtherData.map(chng => {
                                                                                if (chng.id == val.id) {
                                                                                    chng.title = ActiveItem
                                                                                    chng.canEdit = false
                                                                                    SetActiveItem(null)
                                                                                }
                                                                                return chng
                                                                            }))
                                                                        }}
                                                                    >
                                                                        cancel
                                                                    </button>
                                                                    <button
                                                                        className={styles.btn}
                                                                        onClick={() => UpdateSection(val)}
                                                                    >
                                                                        update
                                                                    </button>
                                                                </> :
                                                                <>
                                                                    <button
                                                                        className={`btn ${styles.btn}`}
                                                                        onClick={() => {
                                                                            console.log(ActiveItem)
                                                                            SetActiveItem(val.title)
                                                                            var temp = [...OtherData]
                                                                            SetOtherData(temp.map(chng => {
                                                                                if (chng.id == val.id) {
                                                                                    chng.canEdit = true
                                                                                } else {
                                                                                    chng.canEdit = false
                                                                                }
                                                                                return chng
                                                                            }))
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
                                                        value={val.title}
                                                        setData={text => UpdateOtherData(val.id, text, 'title')}
                                                        element="p"
                                                        elClass="text_container"
                                                        type="one"
                                                        readonly={!val.canEdit}
                                                    />
                                                </div>
                                            </div>
                                            <div className={styles.section}>
                                                <div className={styles.shead}>
                                                    <p className={styles.stitle}>Description</p>
                                                </div>
                                                <div className={styles.box_content}>
                                                    <TextEditor
                                                        value={val.description || ''}
                                                        setData={text => UpdateOtherData(val.id, text, 'description')}
                                                        element="p"
                                                        elClass="text_container"
                                                        type="one"
                                                        readonly={!val.canEdit}
                                                    />
                                                </div>
                                            </div>
                                            {
                                                SectionData.infocard &&
                                                <div className={styles.ccards}>
                                                    {
                                                        SectionData.infocard.filter(n=>n.info_category_id === val.id).map((item, index) => {
                                                                return (
                                                                    <CardElement key={item + index} Data={Data} SetData= {SetData} {...{ item, index, SetShowDeletePopper, SetDeleteItemId, SetDeleteType, UpdateItem }} />
                                                                )
                                                        })
                                                    }
                                                </div>
                                            }
                                            <button
                                                className={` btn ${styles.btn} ${styles.add_element}`}
                                                onClick={() => {
                                                    addElement(val)
                                                }}
                                            >
                                                <span>Add Card</span>
                                                <img src="/assets/icons/add_elem.svg" alt="add element" />
                                            </button>
                                        </div>
                                    )
                            })
                        }
                        <div className={styles.section_btns}>
                            <button className={`btn ${styles.btn} ${styles.preview}`} onClick={onPreview}>Preview</button>
                        </div>
                    </div>
                    </>:<Spinner/>
                }
                {
                    ShowDeletePopper &&
                    <DeletePopper SetShowDeletePopper={SetShowDeletePopper} Type={DeleteType} DeleteItem={DeleteItem} />
                }
            </div>
        </AdminAboutLayout>
    )
}

export default governance

const CardElement = ({ item, index, SetShowDeletePopper, SetDeleteItemId, SetDeleteType, UpdateItem,Data,SetData }) => {

    const [Name, SetName] = useState(item.title || '')
    const [Position, SetPosition] = useState(item.position || '')
    const [Description, SetDescription] = useState(item.description || '')
    const [LinkText, SetLinkText] = useState(item.description || "");
    const [Img, SetImg] = useState(item.image ? {type: 'server', data: item.image} : null)
    const [ImageData, SetImageData] = useState(null)
    const [CanEdit, SetCanEdit] = useState(false)

    useEffect(() => {
        SetName(item.title || '')
        SetPosition(item.position || '')
        SetDescription(item.description || '')
        SetImg(item.image ? {type: 'server', data: item.image} : null)
        SetImageData(null)
        SetCanEdit(false)
    }, [Data])

    const reset = () => {
        SetData({ ...Data })
    }

    return (
        <>
            <div className={styles.sheadBord}>
                <p className={styles.secBordTitle}>Personel #{index + 1}</p>
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
                                    className={styles.btn}
                                    onClick={() => UpdateItem({ Name, Position, Description, LinkText, ImageData, id: item.id })}
                                >
                                    update
                                </button>
                            </> :
                            <>
                                <button
                                    className={`btn ${styles.btn} ${styles.space} ${styles.nobord}`}
                                    onClick={() => {
                                        SetDeleteItemId(item.id)
                                        SetDeleteType('Personel')
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
                    <p className={styles.stitle}>Name</p>
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
                    <p className={styles.stitle}>Position</p>
                </div>
                <div className={styles.box_content}>
                    <TextEditor
                        value={Position}
                        setData={SetPosition}
                        element="p"
                        elClass="text_container"
                        type="one"
                        readonly={!CanEdit}
                    />
                </div>
            </div>
            <div className={styles.section}>
                <div className={styles.shead}>
                    <p className={styles.stitle}>External Bio Link</p>
                </div>
                <div className={styles.box_content}>
                    <TextEditor
                        value={Description}
                        setData={SetDescription}
                        element="p"
                        elClass="text_container"
                        type="two"
                        Title={LinkText}
                        SetTitle={SetLinkText}
                        readonly={!CanEdit}
                    />
                </div>
            </div>
            <div className={styles.section}>
                <div className={styles.shead}>
                    <p className={styles.stitle}>
                        Image
                        <span className={styles.light_text}>(recommended dimensions: 350w X 350h)</span>
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
                        {({ getRootProps, getInputProps, isDragActive }) => (
                            <section>
                                <div {...getRootProps()} className={`${styles.box_content_dropzone} ${Img === null ? styles.show_dropzone : styles.bord}${CanEdit === false ? styles.dis : ''}`}>
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