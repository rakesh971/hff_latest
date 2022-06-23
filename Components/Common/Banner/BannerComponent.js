import React from 'react'
import TextEditor from '../../Admin/TextEditor';
import Dropzone from "react-dropzone";
import Image from '../Image/Image';
import styles from './BannerComponent.module.scss'

const BannerComponent = ({
	Text,
	SetText,
	Img,
	SetImg,
	Title,
	SetTitle,
	onUpdate,
	onPreview,
	UpdateBtn,
	SetImageData,
}) => {
	
return (
	<div className={styles.admin_content_wrapper}>
		<div className={styles.section}>
			<div className={styles.shead}>
				<p className={styles.stitle}>
					Header					
				</p>
			</div>
			<div className={styles.box_content}>
				<TextEditor
					value={Text}
					setData={SetText}
					element="p"
					elClass="text_container"
					type="one"
					Title={Title}
					SetTitle={SetTitle}
				/>
			</div>
		</div>
		<div className={styles.section}>
			<div className={styles.shead}>
				<p className={styles.stitle}>
					Image
					<span className={styles.light_text}>(recommended dimensions: 1440w X 520h)</span>
				</p>
				<button className={`btn ${styles.btn}`} onClick={() => SetImg(null)}>
					Remove image
				</button>
			</div>
			<div className={styles.box_content}>
				<Dropzone
					onDrop={(acceptedFiles) => {
						SetImg({type: 'local', data: URL.createObjectURL(acceptedFiles[0])});
						SetImageData(acceptedFiles[0]);
					}}
				>
					{({ getRootProps, getInputProps, isDragActive }) => (
						<section>
							<div {...getRootProps()} className={`${styles.box_content_dropzone} ${Img === null ? styles.show_dropzone : ""}`}>
								<input {...getInputProps()} />
								{
									isDragActive ?
									<p>Drop the files here ...</p> : 
									Img === null ?
									 <div className={styles.dropzone}>
										<p className={styles.color}>Drag an image here</p>
										<p className={styles.lgt}>or if you prefer</p>
										<p className={styles.color_box}>Choose an image to upload</p>
									</div> 
									: 

									Img.type === 'local' ?
									<img src={Img.data} alt="preview" /> :
									<Image image={Img.data} alt="preview" />
								}
							</div>
						</section>
					)}
				</Dropzone>
			</div>
		</div>
		<div className={styles.section_btns}>
			<button
				className= {`${styles.btn} ${styles.update} ${styles.orange}`}
				onClick={() => {
					onUpdate();
				}}
				disabled={UpdateBtn === "Update" ? false : true}
            >
                    {UpdateBtn}
            </button>
			<button className={`${styles.btn} ${styles.preview}`} onClick={onPreview}>
				Preview
			</button>
		</div>
	</div>
)
}

export default BannerComponent