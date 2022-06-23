import React, { useState, useEffect } from 'react'
import Spinner from '../../Components/Common/Spinner/Spinner'
import InjectHTML from '../../Components/Common/InjectHTML/InjectHTML'
import Head from 'next/head';
import Link from 'next/link'
import PanelLayout from '../../Components/Common/PanelLayout/PanelLayout';
import useServer from '../../Hooks/useServer';
import { toast } from 'react-toastify'
import styles from './Contact.module.scss'

const contact = ({location}) => {

	const  [callApi, Loading, setLoading ] = useServer()
	const [Data, SetData] = useState(null)
	const [Address, SetAddress] = useState('')
	const [Email, SetEmail] = useState('')
	const [Facebook, SetFacebook] = useState('')
	const [Twitter, SetTwitter] = useState('')
	const [LinkedIn, SetLinkedIn] = useState('')
	// const [Phone, SetPhone] = useState('')
	// const [YouTube, SetYouTube] = useState('')
	// const [Instagram, SetInstagram] = useState('')

	const [FirstName, SetFirstName] = useState('')
	const [LastName, SetLastName] = useState('')
	const [FormEmail, SetFormEmail] = useState('')
	const [Organisation, SetOrganisation] = useState('')
	const [Position, SetPosition] = useState('')
	const [Message, SetMessage] = useState('')

    useEffect(() => {
		init()
    }, [])

   
	const init = async () => {
		let response = await callApi( 'pages/contact' , {'with[]': 'options'} , false ,'get' , false);
		if( response && response.error  === 1){
			SetAddress(response.data.options.filter(val => val.key === 'address')[0].value)
			SetEmail(response.data.options.filter(val => val.key === 'email')[0].value)
			SetFacebook(response.data.options.filter(val => val.key === 'facebook')[0].value)
			SetTwitter(response.data.options.filter(val => val.key === 'twitter')[0].value)
			SetLinkedIn(response.data.options.filter(val => val.key === 'linkedin')[0].value)
			SetData(response)
				// SetPhone(response.data.page.options.filter(val => val.key === 'phone')[0].value)
			// SetInstagram(response.data.page.options.filter(val => val.key === 'instagram')[0].value)
			// SetYouTube(response.data.page.options.filter(val => val.key === 'youtube')[0].value)
		}
	}

    const onSubmit = async (e) => {
        e.preventDefault()

		let response = await callApi( 'feedback' , {
            first_name: FirstName,
            last_name: LastName,
            email: FormEmail,
            company: Organisation,
            message: Message,
            position: Position,} ,
			 false, 
			 'post', 
			 false);

			if( response && response.error  === 1){
				SetFirstName('')
                SetLastName('')
                SetFormEmail('')
                SetOrganisation('')
                SetPosition('')
                SetMessage('')
                toast('Form submitted successfully', {
                    position: "bottom-center",
                    type: "success",
                    autoClose: 1500,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
			}

    }

	return (
		<PanelLayout>
			<div className={styles.contains_everything}>
				{
					Data ?
					<div className={styles.contact}>
						<Head>
							<title>{Data.seo_title}</title>
							<meta property="og:title" content={Data.seo_title} />
							<meta property="og:description" content={Data.seo_description} />
							<meta property="og:image" content={Data.seo_image} />
							{/* <meta property="og:url" content={Api.baseurl + location.pathname} /> */}
							<meta property="og:site_name" content="Humanitarian Finance Forum" />
							<meta name="twitter:title" content={Data.seo_title} />
							<meta name="twitter:description" content={Data.seo_description} />
							<meta name="twitter:image" content={Data.seo_image} />
							{/* <meta name="twitter:card" content={Api.baseurl + location.pathname} /> */}
							<meta name="twitter:image:alt" content={Data.seo_title} />
							<meta name="title" content={Data.seo_title} />
							<meta name="description" content={Data.seo_description} />
							<meta name="keywords" content={Data.seo_tags} />
						</Head>
						<div className="contain">
							<div className={styles.wrapper}>
								<div className={styles.sidebar}>
									<div className={styles.img_wrap}>
										<img src="/assets/icons/logo_var.svg" alt="Humanitarian Finance Forum" />
									</div>
									<ul>
										<li>
											<p className={styles.side_title}>Location</p>
											<p className={styles.side_text}>
												<InjectHTML html={Address} />
											</p>
										</li>
										{/* <li>
											<p className="side_title">Phone</p>
											<p className="side_text">
												<InjectHTML html={Phone} />
											</p>
										</li> */}
										<li>
											<p className={styles.side_title}>Email</p>
											<p className={styles.side_text}>
												<InjectHTML html={Email} />
											</p>
										</li>
									</ul>
									<div className={styles.share}>
										<p className={styles.side_title}>Connect with us</p>
										<div className={styles.icons}>
											<Link href={{pathname: Facebook}}>
												<a className={styles.icon}
												target="_blank">
													<img src="/assets/icons/facebook.svg" alt="facebook" />
												</a>
											</Link>
											<Link href={{pathname: Twitter}}>
												<a className={styles.icon} target="_blank">
													<img src="/assets/icons/twitter.svg" alt="twitter" />
												</a>								
											</Link>
											<Link href={{pathname: LinkedIn}}>
												<a className={styles.icon} target="_blank">
													<img src="/assets/icons/linkedin.svg" alt="linkedin" />
												</a>
											</Link>
											{/* <Link to={{pathname: YouTube}} target="_blank" className="icon">
												<img src="/assets/icons/youtube.svg" alt="youtube" />
											</Link>
											<Link to={{pathname: Instagram}} target="_blank" className="icon">
												<img src="/assets/icons/instagram.svg" alt="instagram" />
											</Link> */}
										</div>
									</div>
								</div>
								<div className={styles.content_wrap}>
									<p className={styles.form_title}>Or send us a message!</p>
									<form onSubmit={(e) => { onSubmit(e) }}>
										<div className={`${styles.form_grp} ${styles.half}`}>
											<label htmlFor="firstName">First Name</label>
											<input 
												type="text" 
												placeholder="e.g. Jane"
												className={`form_control ${styles.form_control}`}
												required
												value={FirstName}
												onChange={e => SetFirstName(e.target.value)}
											/>
										</div>
										<div className={`${styles.form_grp} ${styles.half}`}>
											<label htmlFor="lastName">Last Name</label>
											<input 
												type="text" 
												placeholder="e.g. Doe"
												className={`form_control ${styles.form_control}`}
												required
												value={LastName}
												onChange={e => SetLastName(e.target.value)}
											/>
										</div>
										<div className={styles.form_grp}>
											<label htmlFor="email">Email Address</label>
											<input 
												type="email" 
												placeholder="e.g. jane.doe@example.com"
												className={`form_control ${styles.form_control}`} 
												required
												value={FormEmail}
												onChange={e => SetFormEmail(e.target.value)}
											/>
										</div>
										<div className={styles.form_grp}>
											<label htmlFor="organisation">Organisation</label>
											<input 
												type="text" 
												placeholder="e.g. Red Cross"
												className={`form_control ${styles.form_control}`}
												required
												value={Organisation}
												onChange={e => SetOrganisation(e.target.value)}
											/>
										</div>
										<div className={styles.form_grp}>
											<label htmlFor="position">Position</label>
											<input 
												type="text" 
												placeholder="e.g. Manager"
												className={`form_control ${styles.form_control}`}
												required
												value={Position}
												onChange={e => SetPosition(e.target.value)}
											/>
										</div>
										<div className={styles.form_grp}>
											<label htmlFor="position">Message</label>
											<textarea 
												placeholder="Write your message here" 
												className={`form_control ${styles.form_control}`}
												required
												value={Message}
												onChange={e => SetMessage(e.target.value)}
											></textarea>
										</div>
										<div className={styles.form_grp}>
											<button 
												type="submit" 
												className={`btn ${styles.btn}`}
											>
												Submit
											</button>
										</div>
									</form>
								</div>
							</div>
						</div>
					</div> : <Spinner />
				}
			</div>
		</PanelLayout>
	)
}

export default contact