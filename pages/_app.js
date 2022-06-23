import 'normalize.css/normalize.css'
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import '../styles/reset.css'
import 'react-toastify/dist/ReactToastify.css';
import '../styles/globals.scss'
import { SessionProvider } from "next-auth/react"
import { ToastContainer } from 'react-toastify';

function MyApp({ Component, pageProps }) {
  	return (
		<SessionProvider session={pageProps.session} >
			<Component {...pageProps} />
			<ToastContainer
				position="bottom-center"
				autoClose={4000}
				hideProgressBar={false}
				newestOnTop={false}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
				style={{
					fontSize: '16px',
					lineHeight: '1.6',
					fontFamily: "'Lato', sans-serif",
				}}
			/>
		</SessionProvider>
	)
}

export default MyApp
