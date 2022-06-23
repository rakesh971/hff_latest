import React from 'react'
import Header from '../Headers/Header'
import AdminHeader from '../Headers/AdminHeader'
import Footer from '../Footer/Footer'
import { useRouter } from 'next/router'

const PanelLayout = ({children}) => {

	const router = useRouter()

	return (
		<div>
			{
				router.pathname.startsWith("/admin") ?
				<AdminHeader/> : <Header/>
			}
			<div className="content">
				{children}
			</div>
			<Footer/>
		</div>
	)
}

export default PanelLayout
