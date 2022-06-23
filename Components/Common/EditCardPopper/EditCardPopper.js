import React, {useState, useCallback} from 'react'
import TextEditor from '../../Admin/TextEditor'
import Dropzone from 'react-dropzone'
import Image from '../../Common/Image/Image'
import styles from './EditCardPopper.module.scss'

const EditCardPopper = ({SetShowPopper, data, UpdateItem}) => {

  	const [Caption, SetCaption] = useState(data.meta || '')
	const [Img, SetImg] = useState(data.content ? {type: 'server', Data: data.content} : null)
	const [ImageData, SetImageData] = useState(null)
	return (
		<div className={styles.edit_card_popper}>
			<div className={styles.edit_card_popper_wrapper}>
				<div className={styles.popper_header}>
					<p className={styles.popper_header_title}>Edit Card</p>
					<button 
						className={` btn ${styles.btn} ${styles.close_btn}`}
						onClick={() => SetShowPopper(false)}
					>
						<img src="/assets/icons/close_icon.svg" alt="close" />
					</button>
				</div>
				<div className={styles.popper_body}>
					<div className={styles.section}>
						<div className={styles.shead}>
							<p className={styles.stitle}>Image</p>
							<button 
								className={` btn ${styles.btn}`}
								onClick={() => SetImg(null)}
							>
								Remove image
							</button>
						</div>
						<div className={styles.box_content}>
							<Dropzone 
								onDrop={acceptedFiles => {
									SetImg({type: 'local',Data:URL.createObjectURL(acceptedFiles[0])})
									SetImageData(acceptedFiles[0])
								}}
							>
								{({getRootProps, getInputProps, isDragActive}) => (
									<section>
										<div {...getRootProps()} className={`${styles.box_content_dropzone} ${Img === null ? styles.show_dropzon : ''}`}>
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
												<img src ={Img.Data} alt ="preview"/> :
												<Image image={{url:	Img.Data}} alt="preview" />
											}
											{/* {JSON.stringify(Img)} */}
										</div>
									</section>
								)}
							</Dropzone>
						</div>
					</div>
					<div className={styles.section}>
						<div className={styles.shead}>
							<p className={styles.stitle}>Caption</p>
						</div>
						<div className={styles.box_content}>
							<TextEditor 
								value={Caption} 
								setData={SetCaption} 
								element="p" 
								elClass="text_container"
								type="one"
							/>
						</div>
					</div>
					<div className={styles.btns_grp}>
						<button 
							className={` btn ${styles.btn} ${styles.update}`}
							onClick={() => {
								UpdateItem({Img, ImageData, caption: Caption, id: data.id})
							}}
						>Update</button>
						{/* <button className="btn preview">Preview</button> */}
					</div>
				</div>
			</div>
		</div>
	)
}
export default EditCardPopper