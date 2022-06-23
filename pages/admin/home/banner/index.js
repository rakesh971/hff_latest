import React, { useState, useEffect } from "react";
import useServer from "../../../../Hooks/useServer";
import BannerComponent from '../../../../Components/Common/Banner/BannerComponent'
import Spinner from "../../../../Components/Common/Spinner/Spinner";
import HomeLayout from '../../../../Components/Admin/Home/HomeLayout/HomeLayout'
import styles from './BannerComponent.module.scss'
import { useSession } from 'next-auth/react'

const banner = () => {

    const {data:session} = useSession()
    const [callApi,Loading,setLoading] =useServer()
    const [Text, SetText] = useState("Supporting humanitarian impact through the financial markets.")
    const [Title, SetTitle] = useState("");
    const [Img, SetImg] = useState(null);
    const [ImageData, SetImageData] = useState(null);
    const [UpdateBtn, SetUpdateBtn] = useState("Update");
	const [Data, SetData] = useState(null)
	
	console.log('data',Data)
	useEffect(() => {
        session && init()
    },[session])

    const init = async ()=>{
        let response = await callApi('pages/home', {with: ['sections', 'infocard']}, false, 'get', false, session.user.token);
		console.log('res',response)
        if(response.error === 1) {
            SetData(response)
        }
    }
   
    useEffect(()=>{
      if(Data){
        SetText(Data.data.header);
        SetImg(Data.data.background_image ? { type: 'server',data:Data.data.background_image} : null);
        SetTitle(Data.data.title);
      }
    },[Data])
	
    const onUpdate = async () => {
		SetUpdateBtn("Updating...");
		var formData = new FormData();
		formData.append("header", Text);
		formData.append("title", Title);
		!Image ?
		formData.append("background_image", "") :
		formData.append("page_background", ImageData ? ImageData : Image);
		formData.append("id", Data.data.id);
		let response = await callApi("pages", formData, false, "post", true,session.user.token);
		console.log('first',response)
		if (response.error === 1) {
			var temp = Data;
			temp.data = response.data;
			SetData(temp);
			SetImageData(null);
		}
		SetUpdateBtn("Update");
    };
  
    const onPreview = () =>{
		const win = window.open('/', "_blank");
		win.focus();
    }

 	return (
		<HomeLayout Data={Data}>
			<div className={styles.admin_content}>
				{Data !=null ?(
					<BannerComponent
						{...{
							SetText,
							Text,
							Img,
							SetImg,
							onPreview,
							onUpdate,
							Title,
							SetTitle,
							UpdateBtn,
							SetImageData,
							}}
					/>
				) : (
					<Spinner />
				)}
			</div>
		</HomeLayout>
  	)
}

export default banner