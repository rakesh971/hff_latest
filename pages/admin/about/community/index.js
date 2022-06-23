import React, {useState, useContext, useEffect, useRef} from 'react'
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
 import { FaAngleDown } from 'react-icons/fa'
 import styles from './members.module.scss'

const community = () => {

	const buttonRef = useRef()
	const {data:session} = useSession()
  	const [callApi, Loading, setLoading ] = useServer()
	const [SectionData, SetSectionData] = useState(null);
	const [DeleteItemId, SetDeleteItemId] = useState(null);
	const [MembersCards, SetMembersCards] = useState([]);
	const [FilteredMembersCards, SetFilteredMembersCards] = useState([]);
	const [CarousalImages, SetCarousalImages] = useState([]);
	const [DeleteType, SetDeleteType] = useState('Organisation');
	const [OtherData, SetOtherData] = useState(null)
	const [ActiveItem, SetActiveItem] = useState(null)
	const [ShowDeletePopper, SetShowDeletePopper] = useState(false)
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
            let FilteredData = Data.child.filter((val) =>
			val.slug.includes("members")
            )[0];
            SetSectionData(FilteredData);
            SetMembersCards(FilteredData.infocard.filter((val) => !val.is_carousel));
            SetCarousalImages(FilteredData.infocard.filter((val) => val.is_carousel));
            init(FilteredData)
        }
	}, [Data]);

	const init = async (FilteredData)=>{
		let response = await callApi(`info-card/categories`, {page_id: FilteredData.id}, false, 'get', false,session.user.token);
		if(response.error === 1) {
			SetOtherData(response.data.map(val => {					
				val.canEdit = false
				return val
			}))
			if (!SelectedSection) {
                SetSelectedSection(response.data[0])
            }
		}
		SetShowDeletePopper(false)
		SetDeleteItemId(null)
		SetDeleteType(null)								
	}

	useEffect(() => {
		document.addEventListener('click', handleClickOutside, true);
		return () => {
			document.removeEventListener('click', handleClickOutside, true);
		};
	}, [])

	const handleClickOutside = (event) => {
		if (buttonRef.current && !buttonRef.current.contains(event.target)) {
			SetShowDrop(false)
		}
	};

	useEffect(() => {
		if(SelectedSection) {
			SetFilteredMembersCards(MembersCards.filter(n=>n.info_category_id==SelectedSection.id))
		}
	}, [SelectedSection])

	const addElement =async (data) => {
		let response = await callApi('info-card/create',{page_id:SectionData.id, info_category_id: data.id},  false, 'get', false,session.user.token);
		if (response.error === 1) {
			var temp = { ...Data };
			console.log(temp.child)
			temp.child = temp.child.map((val) => {
				if (val.slug.includes("members")) {
					val.cards = response.data;
					return val;
				} else {
					return val;
				}
			});
			SetData(temp);
			SetShowDeletePopper(false);
			SetDeleteItemId(null);
		}
	};

	const addCarousalElement =async () => {
		let response =  await callApi('info-card/create',{page_id:SectionData.id, is_carousel: "true" }, false, "get", false ,session.user.token);
		if (response.error === 1) {
			var temp = { ...Data };
			console.log(temp.child)
			temp.child = temp.child.map((val) => {
				if (val.slug.includes("members")) {
					val.cards = response.data;
					return val;
				} else {
					return val;
				}
			});
			SetData(temp);
			SetShowDeletePopper(false);
			SetDeleteItemId(null);
		}
	};

	const onPreview = () => {
		const win = window.open("/about/community", "_blank");
		win.focus();
	};

	const UpdateOtherData = (id, text, type) => {
		var temp = [...OtherData]
		SetOtherData(temp.map(chng => {
			if(chng.id == id) {
				chng[type] = text
			}
			return chng
		}))
	}

	const UpdateItem = (data) => {
		console.log(data)
		var formData = new FormData();
		formData.append("title", data.Name);
		formData.append("description", data.Link);
		formData.append("position", data.LinkText);
		if (data.isCarousal) {
			formData.append("is_carousel", true);
			ImageData && formData.append("image", data.ImageData);
		}
		formData.append("page_id", SectionData.id);
		update(data,formData)
	};

	const update = async (data,formData) =>{
		let response = await callApi(`info-card/${data.id}`, formData, true, "put", true,session.user.token);
		if (response.error === 1) {
			SetMembersCards(response.data.filter((val) => !val.is_carousel));
			SetCarousalImages(response.data.filter((val) => val.is_carousel));
		}
	}

	const DeleteItem = async() => {
		let response = null
		if(DeleteType === 'Section') {
			response = await callApi(`info-card/categories/${DeleteItemId}`, {page_id: SectionData.id,}, true, 'delete', false,session.user.token);
			if(response && response.error === 1){
				SetSelectedSection(response.data[0])
			}
			// SetOtherData(OtherData.filter(n => n.id != SectionData.id));
		} else {
			 response = await callApi(`info-card/${DeleteItemId}`, { page_id: SectionData.id }, false, "delete", false,session.user.token);
			if (response && response.error === 1) {
				var temp = { ...Data };
				console.log(temp.child)
				temp.child = temp.child.map((val) => {
					if (val.slug.includes("members")) {
						val.cards = response.data;
						return val;
					} else {
						return val;
					}
				});
				SetData(temp);
				SetShowDeletePopper(false);
				SetDeleteItemId(null);
			}
		}
	};

	const UpdateSection = async(data) => {
		let response = await callApi(`info-card/categories`, {
			page_id: SectionData.id,
			title: data.title,
			description: data.description,
			id: data.id
		}, false, 'put', false ,session.user.token);
		if(response.error === 1) {
			SetOtherData(response.data.map(val => {					
				val.canEdit = false
				return val
			}))
		}   SetShowDeletePopper(false)
			SetDeleteItemId(null)
			SetDeleteType(null)								
	}

	const addSelction = async ()=>{
		let response = await callApi(`info-card/categories`, {page_id: SectionData.id,title: 'Title',description: '',}, false, 'put', false,session.user.token);
		if(response.error === 1) {
			SetSelectedSection(response.data.find(val => val.id === response.more))
		}   SetShowDeletePopper(false)
			SetDeleteItemId(null)
			SetDeleteType(null)								
	}
    return (
        <AdminAboutLayout Data={Data}>
            <div className={styles.admin_content}>
                {SectionData ? (
                    <>
                        <div className={styles.admin_content_wrapper}>
                            {SectionData.sections.map((item) => {
                                return (
                                    <Element
                                        key={item.id}
                                        item={item}
                                        id={SectionData.id}
                                        Always={true}
                                    />
                                );
                            })}
                            <div className={styles.section}>
                                <div className={`${styles.shead} ${styles.bord}`}>
                                    <div className={styles.shead_drop}>
                                        <p className={styles.stitle}>Section</p>
                                        <div className={styles.drop}>
                                            <button 
                                                className={styles.btn}
                                                onClick={() => SetShowDrop(true)}
                                            >
                                                {
                                                    SelectedSection ? 
                                                    <InjectHTML html={SelectedSection.title} /> : OtherData && OtherData.length > 0 ? 'select section' : 'creat a section please'
                                                }
                                                { OtherData && OtherData.length > 0 && <FaAngleDown className={styles.icon} /> }
                                            </button>
                                            {
                                                ShowDrop && OtherData && OtherData.length > 0 &&
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
                                        {
                                            OtherData && OtherData.length > 0 &&	<button 
                                                className={` btn ${styles.btn} ${styles.nobord}`}
                                                onClick={() => {
                                                    SetDeleteItemId(SelectedSection.id)
                                                    SetDeleteType('Section')
                                                    SetShowDeletePopper(true)
                                                }}
                                            >
                                                delete
                                            </button> 
                                        }
                                        <button 
                                            className={` btn ${styles.btn} ${styles.space_left}`}
                                            onClick={() => {
                                                addSelction()
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
                                    if(val.id === SelectedSection.id)
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
                                                                            if(chng.id == val.id) {
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
                                                                    className={`btn ${styles.btn}`}
                                                                    onClick={() => UpdateSection(val)}
                                                                >
                                                                    update
                                                                </button>
                                                            </> :
                                                            <>                               
                                                                <button 
                                                                    className={`btn ${styles.btn}`}
                                                                    onClick={() => {
                                                                        SetActiveItem(val.title)
                                                                        var temp = [...OtherData]
                                                                        SetOtherData(temp.map(chng => {
                                                                            if(chng.id == val.id) {
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
                                                MembersCards &&
                                                <div className={styles.ccards}>
                                                    {
                                                        MembersCards.filter(item=>item.info_category_id === val.id).map((item, index) => {
                                                                return (
                                                                    <CardElement key={item + index} Data = {Data} SetData = {SetData} {...{item, index, SetShowDeletePopper, SetDeleteItemId, SetDeleteType,UpdateItem}} />
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
                            <div className={styles.admin_content_wrapper}>
                                <p className={styles.stitle_outer}>Carousel Images</p>
                                {CarousalImages && CarousalImages.length > 0 ? (
                                <div className={styles.ccards}>
                                    {CarousalImages.map((item, index) => {
                                        return (
                                            <CardElement
                                                key={item + index}
                                                {...{
                                                    item,
                                                    index,
                                                    SetShowDeletePopper,
                                                    SetDeleteItemId,
                                                    UpdateItem,
                                                    isCarousal: true,
                                                    SetDeleteType
                                                }}
                                            />
                                        );
                                    })}
                                </div>
                                ) : null}
                                <button
                                    className={`btn ${styles.btn} ${styles.add_element}`}
                                    onClick={() => {
                                        addCarousalElement();
                                    }}
                                >
                                    <span>Add Images</span>
                                    <img src="/assets/icons/add_elem.svg" alt="add element" />
                                </button>
                                <div className={styles.section_btns}>
                                    <button className={`btn ${styles.btn} ${styles.preview}`} onClick={onPreview}>
                                        Preview
                                    </button>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <Spinner />
                )}
                {ShowDeletePopper && (
                    <DeletePopper
                    SetShowDeletePopper={SetShowDeletePopper}
                    Type={DeleteType}
                    DeleteItem={DeleteItem}
                    />
                )}
            </div>
        </AdminAboutLayout>
    )
}

export default community

const CardElement = ({
	item,
	index,
	SetShowDeletePopper,
	SetDeleteItemId,
	UpdateItem,
	isCarousal,
	SetDeleteType,
    Data,
    SetData
}) => {

	const [Name, SetName] = useState(item.title || "");
	const [Link, SetLink] = useState(item.description || "");
	const [LinkText, SetLinkText] = useState(item.position || "");
	const [CanEdit, SetCanEdit] = useState(false);
	const [Img, SetImg] = useState(item.image ? { type:'server',data:item.image} : null);
	const [ImageData, SetImageData] = useState(null);

	useEffect(() => {
		SetName(item.title || "");
		SetLink(item.description || "");
		SetLinkText(item.position || "");
		SetCanEdit(false);		
	}, [item]);

	const reset = () => {
		SetData({ ...Data });
	};


  return (
		<>
			<div className={styles.sheadBord}>
				<p className={styles.secBordTitle}>{isCarousal ? 'Carousel' : 'Organisation'} #{index + 1}</p>
				<div className={styles.sgrp}>
				{CanEdit ? (
					<>
						<button
							className={`btn ${styles.btn} ${styles.space} ${styles.nobord}`}
							onClick={() => {
								reset();
								SetCanEdit(false);
							}}
						>
							cancel
						</button>
						<button
							className={`btn ${styles.btn}`}
							onClick={() => {
								if (isCarousal) {
									console.log(item)
									UpdateItem({
										Name: "HFFcarousal",
										Link: `<p class="text_container">http://hff.craftnotion.in/about</p>`,
										LinkText: `http://hff.craftnotion.in/about`,
										ImageData,
										id: item.id,
										isCarousal: true,
									});
									SetCanEdit(false);
								} else {
									UpdateItem({ Name, Link, LinkText, id: item.id });
									SetCanEdit(false);
								}
							}}
						>
							update
						</button>
					</>
				) : (
					<>
						<button
							className={` btn ${styles.btn} ${styles.space} ${styles.nobord}`}
							onClick={() => {
								SetDeleteItemId(item.id);
								SetShowDeletePopper(true);
								SetDeleteType(isCarousal ? 'crousel image': 'organisation')
							}}
						>
							delete
						</button>
						<button className={`btn ${styles.btn}`} onClick={() => SetCanEdit(true)}>
							edit
						</button>
					</>
				)}
				</div>
			</div>
			{isCarousal ? (
				<div className={styles.section}>
					<div className={styles.shead}>
						<p className={styles.stitle}>
							Image
							<span className={styles.light_text}>(recommended dimensions: 1440w X 520h)</span>
						</p>
					</div>
					<div className={styles.box_content }>
						<Dropzone
							onDrop={(acceptedFiles) => {
								SetImg({type:'local',data:URL.createObjectURL(acceptedFiles[0])});
								SetImageData(acceptedFiles[0]);
							}}
							disabled={!CanEdit}
						>
							{({ getRootProps, getInputProps, isDragActive }) => (
								<section>
									<div
										{...getRootProps()}
										className={`${styles.box_content_dropzone} ${
										Img === null ? styles.show_dropzone : ""
										}${CanEdit === false ? styles.dis : ""}`}
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
											<img src= {Img.data} alt="preview" />:
											<Image image={Img.data} alt="preview" />
										)}
									</div>
								</section>
							)}
						</Dropzone>
					</div>
				</div>
			) : (
				<div className={styles.section_flex}>
					<div className={`${styles.section} ${styles.left}`}>
						<div className={styles.shead}>
							<p className={StyleSheetList.stitle}>Name</p>
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
					<div className={`${styles.section} ${styles.right}`}>
					<div className={styles.shead}>
							<p className={StyleSheetList.stitle}>Link</p>
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
			)}
		</>
	);
};