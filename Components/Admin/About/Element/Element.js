import React, {useState, useEffect, useRef, useContext} from 'react'
import TextEditor from '../../TextEditor'
import Dropzone from 'react-dropzone'
import EditCardPopper from '../../../Common/EditCardPopper/EditCardPopper'
import DeletePopper from '../../../Common/DeletePopper/DeletePopper'
import { AboutContext } from '../../AboutContext'
import useServer from '../../../../Hooks/useServer'
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import Image from '../../../Common/Image/Image'
import styles from './Element.module.scss'
import { useSession } from 'next-auth/react'

const Element = ({item, id, Always}) => {
	
	const {data:session} = useSession()
	const [callApi,Loading,setLoading] = useServer()
	const [Content, SetContent] = useState(null)
	const [ShowPopper, SetShowPopper] = useState(false)
	const [ShowDeletePopper, SetShowDeletePopper] = useState(false)
	const [ImgWidth, SetImgWidth] = useState(null)
	const [ImageData, SetImageData] = useState(null)
	const [CanEdit, SetCanEdit] = useState(false)
	const [DeleteType, SetDeleteType] = useState(null)
	const [CardEdit, SetCardEdit] = useState(null)
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
	

	const InnerWrap = useRef();
  		useEffect(()=>{
		InnerWrap.current && SetImgWidth(InnerWrap.current.clientWidth)
	},[])

	// console.log('im',Content)
	useEffect(() => {
		if(Data){
			SetContent(item.content ? item.content : item.type === 'img' ? null : '')
		}
	}, [Data, item])

	const DeleteItem = async() => {
        let response = await callApi(`sections/${item.id}`, {page_id: id}, false, 'delete', false ,session.user.token);
		if(response.error === 1) {
			const temp = {...Data};
			temp.child.map(val => {
				if(val.id === id) {
					val.section = response.data.section
					return val
				} else {
					return val
				}
			})
			SetData(temp)
		}
		SetImageData(null)
		SetDeleteType(null)
		SetShowDeletePopper(false)
    }

	const UpdateItem = async (cardData) => {
        var formData = new FormData();
        if(cardData) {
            console.log(cardData)
            console.log('UpdateItem', cardData)
            formData.append('section_image', cardData.ImageData);
            cardData.caption && formData.append('meta', cardData.caption);
        } else {
            item.type === 'img' ? formData.append('section_image', ImageData) : 
            formData.append('content', Content);
        }
        formData.append('page_id', id);
        let response =  await callApi(`sections/${cardData ? cardData.id : item.id}`, formData, false, 'put', true ,session.user.token);
		if(response.error === 1) {
			const temp = {...Data};
			temp.child.map(val => {
				if(val.id === id) {
					val.section = response.data.section
					return val
				} else {
					return val
				}
			})
			SetData(temp)
		}
		SetImageData(null)
		SetCanEdit(false)
		SetShowPopper(false)
    }

	const reset = () => {
        SetData({...Data})
    }

	const Move =async (item, direct) => {
        console.log(item, direct, id)
        console.log(item.order - 1)
        console.log(item.order + 1)
        let response = await callApi(`sections/${item.id}/reorder`, {
            to: direct === 'up' ? item.order - 1 : item.order + 1,
            from: item.order,
            page_id: id
        }, false, 'put', false,session.user.token);console.log('move',response)
		if(response.error === 1) {
			const temp = {...Data};
			temp.child.map(val => {
				if(val.id === id) {
					val.sections = response.data.sections
					return val
				} else {
					return val
				}
			})
			SetData(temp)
		}
		SetImageData(null)
		SetCanEdit(false)
		SetShowPopper(false)
    }
  return (
    <>
		{
			item.type === 'h2' || item.type === 'p' ?
			<div className={styles.section}>
				<div className={styles.shead}>
					<p className={styles.stitle}>{item.type === 'h2' ? 'Header' : 'Description'}</p>
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
									onClick={() => UpdateItem()}
								>
									update
								</button>
							</> :
							<>
								{
									!Always && item.order !== 1 ?
									<button 
										className={` btn ${styles.btn} ${styles.space} ${styles.nobord}`}
										onClick={() => {
											SetDeleteType(item.type === 'h2' ? 'Header' : 'Description')
											SetShowDeletePopper(true)
										}}
									>
										delete
									</button> : null
								}                                    
								<button 
									className={ `btn ${styles.btn}`}
									onClick={() => SetCanEdit(true)}
								>
									edit
								</button>
							</>
						}
						{
							item.order !== 1 && !Always &&
							<>
								{
									item.order > 1 &&
									<div className={styles.tt}>
										<p className={styles.ttext}>move up</p>
										<button 
											className={` btn ${styles.btn} ${styles.space_left} ${styles.nobord}`}
											onClick={() => {
												Move(item, 'up')
											}}
										>
											<FaAngleUp className={styles.icon} />
										</button>
									</div>
								}
								<div className={styles.tt}>
									<p className={styles.ttext}>move down</p>
									<button 
										className={` btn ${styles.btn} ${styles.space_left} ${styles.nobord}`}
										onClick={() => {
											Move(item, 'down')
										}}
									>
										<FaAngleDown className={styles.icon} />
									</button>
								</div>
							</>
						}   
					</div>
				</div>
				<div className={styles.box_content}>
					<TextEditor 
						value={Content}
						setData={SetContent} 
						element="p" 
						elClass="text_container"
						// type="one"
						readonly={!CanEdit}
					/>
				</div>
			</div> :
			item.type === 'img' ?
			<div className={styles.section}>
				<div className={styles.shead}>
					<p className={styles.stitle}>
						Image
						<span className={styles.light_text}>(recommended dimensions: 1440w X 520h)</span>
					</p>
					<div className="sgrp">
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
									className={` btn ${styles.btn} ${styles.space} ${styles.nobord}`}
									onClick={() => {
										SetImageData(null)
										SetContent(null)
									}}
								>
									remove image
								</button>
								<button 
									className={styles.btn}
									onClick={() => UpdateItem()}
								>
									update
								</button>
							</> :
							<>
								{
									!Always && item.order !== 1 ?
									<button 
										className={` btn ${styles.btn} ${styles.space} ${styles.nobord}`}
										onClick={() => {
											SetDeleteType('Image')
											SetShowDeletePopper(true)
										}}
									>
										delete
									</button> : null
								}                                    
								<button 
									className={styles.btn}
									onClick={() => SetCanEdit(true)}
								>
									edit
								</button>
							</>
						}
						{
							item.order !== 1 &&
							<>
								{
									item.order > 1 &&
									<div className={styles.tt}>
										<p className={styles.ttext}>move up</p>
										<button 
											className={` btn ${styles.btn} ${styles.space_left} ${styles.nobord}`}
											onClick={() => {
												Move(item, 'up')
											}}
										>
											<FaAngleUp className={styles.icon} />
										</button>
									</div>
								}
								<div className={styles.tt}>
									<p className={styles.ttext}>move down</p>
									<button 
										className={` btn ${styles.btn} ${styles.space_left} ${styles.nobord}`}
										onClick={() => {
											Move(item, 'down')
										}}
									>
										<FaAngleDown className={styles.icon} />
									</button>
								</div>
							</>
						}  
					</div>
				</div>
				<div className={styles.box_content}>
					<Dropzone 
						onDrop={acceptedFiles => {
							SetContent(URL.createObjectURL(acceptedFiles[0]))
							SetImageData(acceptedFiles[0])
						}}
						disabled={!CanEdit}
					>
						{({getRootProps, getInputProps, isDragActive}) => (
							<section>
								<div {...getRootProps()} className={`${styles.box_content_dropzone} ${Content === null ?  styles.show_dropzone : ''}${CanEdit === false ? styles.dis : ''}`}>
									<input {...getInputProps()} />
									{
										isDragActive ?
										<p>Drop the files here ...</p> :
										Content === null ?
										<div className={styles.dropzone}>
											<p className={styles.color}>Drag an image here</p>
											<p className={styles.lgt}>or if you prefer</p>
											<p className={styles.color_box}>Choose an image to upload</p>
										</div> :
										<Image image={Content} alt="preview" />
									}
								</div>
							</section>
						)}
					</Dropzone>
				</div>
			</div> : 
			item.type === "card" ?
			<div className={styles.section}>
				<div className={styles.shead}>
					<p className={styles.stitle}>
						Cards
						<span className={styles.light_text}>(recommended dimensions: 500w X 500h)</span>
					</p>
					<div className={styles.sgrp}>
						{
							item.order > 1 &&
							<div className={styles.tt}>
								<p className={styles.ttext}>move up</p>
								<button 
									className={` btn ${styles.btn} ${styles.space} ${styles.nobord}`}
									onClick={() => {
										Move(item, 'up')
									}}
								>
									<FaAngleUp className={styles.icon} />
								</button>
							</div>
						}
						<div className={styles.tt}>
							<p className={styles.ttext}>move down</p>
							<button 
								className={` btn ${styles.btn} ${styles.space} ${styles.nobord}`}
								onClick={() => {
									Move(item, 'down')
								}}
							>
								<FaAngleDown className={styles.icon}/>
							</button>
						</div>
						<button 
							className={` btn ${styles.btn}`}
							onClick={() => {
								SetDeleteType('Cards')
								SetShowDeletePopper(true)
							}}
						>
							delete
						</button>
					</div>
				</div>
				<div className={styles.box_content}>
					<div className={styles.box_content_cards}>
						<div className={styles.box_content_card} style={{height: ImgWidth ? ImgWidth : '300px'}} ref={InnerWrap}>
							{
								item.content && 
								<Image image={{url:item.content}} alt="card-01" />	 
							}
							<button 
								className={` btn ${styles.btn} ${styles.edit}`}
								onClick={() => {
									SetCardEdit(item)
									SetShowPopper(true)
								}}
							>
								<img src="/assets/icons/edit.svg" alt="edit" /> 
							</button>
						</div>
						{
							item.child.map(val => {
								return (
									<div className={styles.box_content_card} style={{height: ImgWidth ? ImgWidth : '300px'}} key={val.id}>
										{
											val.content && 
											<Image image={{url:val.content}} alt="card-01" />
										}
										<button 
											className={` btn ${styles.btn} ${styles.edit}`}
											onClick={() => {
												SetCardEdit(val)
												SetShowPopper(true)
											}}
										>
											<img src="/assets/icons/edit.svg" alt="edit" />
										</button>
									</div>
								)
							})
						}
					</div>
				</div>
				{
					ShowPopper && 
					<EditCardPopper SetShowPopper={SetShowPopper} data={CardEdit} UpdateItem={UpdateItem} />
				}
			</div> : null
		}
		{
			ShowDeletePopper &&
			<DeletePopper SetShowDeletePopper={SetShowDeletePopper} Type={DeleteType} DeleteItem={DeleteItem} />
		}
	</>
  )
}

export default Element