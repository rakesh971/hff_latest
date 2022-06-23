import React, { useEffect, useState, useContext } from 'react' 
import { useRouter } from 'next/router'
import OtpInput from "react-otp-input";
import { toast } from 'react-toastify';
import { signIn, useSession } from "next-auth/react";
import PanelLayout from '../../Components/Common/PanelLayout/PanelLayout';
import useServer from '../../Hooks/useServer';
import styles from './Login.module.scss'

const login = () => {
	
	const router = useRouter();

	const { data: session } = useSession();
  	const  [callApi, Loading, setLoading ] = useServer()
    const [btnText, setBtnText] = useState('Log In');
    const [username, setUsername] = useState('himanshu@craftnotion.com');
    const [password, setPassword] = useState('00000000');
    const [email, setEmail] = useState('');
    const [rpass, setRpass] = useState('');
    const [rpassConfirm, setRpassConfirm] = useState('');
    const [showMode, setShowMode] = useState('login');
    const [otp, setOtp] = useState('');

    const login = async (e, username, password) => {
		e.preventDefault();
			console.log('click on login')
		setBtnText('Authenticating...')
			console.log( "credentials => ",username )
			console.log( "credentials => ",password )

    const result = await signIn("login-domain", {
		redirect: false,
		username: username,
		password,
			});
			console.log(result)
			if (result.error) {
				toast.error(result.error);			
			}
			setBtnText("Login");
		}

    const forgotPassword = async (e, email, isOtp) => {
        e.preventDefault();
		let response = await callApi('auth/forget-password', {email: email, otp: isOtp ? otp : ''}, false, 'post', false);
		if (response.error === 2) {
			setShowMode('otp')
		} else if (response.error === 1) {
			setShowMode('change')
		}
    }

    const resetPassword = async (e, rpass, rpassConfirm) => {
        e.preventDefault();
		let response = await  callApi('auth/forget-password/1', {
            email: email,
            password: rpass,
            password_confirmation: rpassConfirm,
            otp: otp
        }, false, 'put', false);

		if (response.error === 1) {
			localStorage.setItem('user-info', JSON.stringify(response.data))
			localStorage.setItem('token', JSON.stringify(response.token))
			router.push("/admin");
			toast(response.msg, {
				position: "bottom-center",
				type: "success",
				autoClose: 1500,
				hideProgressBar: true,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
			});
		} else {
			toast(response.msg, {
				position: "bottom-center",
				type: "error",
				autoClose: 1500,
				hideProgressBar: true,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
			});
		}
    }

    useEffect(() => {
		if (session) {
			router.push("/admin/home/banner");
		}
	  }, [session]);

	return (
		<PanelLayout>
			<div className={styles.auth}>
				<div className={styles.wrapper}>
					{
						showMode === 'login' &&
						<>
							<div className={styles.auth_header}>
								<h1>Log in</h1>
							</div>
							<form>
								<div className={`form_grp ${styles.form_grp}`}>
									<label htmlFor="username">Email Address</label>
									<input
										autoComplete="on"
										type="email"
										value={username}
										onChange={e => setUsername(e.target.value)}
										className={`form_control ${styles.form_control}`}
										placeholder="admin@hff.com"
									/>
								</div>
								<div className={`form_grp ${styles.form_grp}`}>
									<div className={styles.flex_item}>
										<label htmlFor="password">Password</label>
										<button className={`btn ${styles.btn} ${styles.forgot_btn}`} type="button" onClick={() => setShowMode('forgot')}>Forgot password?</button>
									</div>
									<input
										autoComplete="on"
										type="password"
										value={password}
										onChange={e => setPassword(e.target.value)}
										className={`form_control ${styles.form_control}`}
										placeholder="Enter your password"
									/>
								</div>
								<button className={`btn ${styles.btn} ${styles.btn_submit}`} type="submit" onClick={(e) => login(e, username, password)} disabled={btnText === 'Log In' ? false : true}>
									<span>{btnText}</span>
								</button>
							</form>
						</>
					}
					{
						showMode === 'forgot' &&
						<>
							<div className={styles.auth_header}>
								<h1>Forgot Password</h1>
							</div>
							<form>
								<div className={`form_grp ${styles.form_grp}`}>
									<label htmlFor="username">Email Address</label>
									<input
										autoComplete="on"
										type="email"
										value={email}
										onChange={e => setEmail(e.target.value)}
										className={styles.form_control}
										placeholder="admin@wheeler.com"
									/>
								</div>
								<button className={`btn ${styles.btn} ${styles.btn_submit}`} onClick={(e) => forgotPassword(e, email, false)}>
									Verify Email
								</button>
								<button className={`btn ${styles.btn} ${styles.btn_submit} ${styles.gray}`} onClick={(e) => setShowMode('login')}>
									back to login
								</button>
							</form>
						</>
					}
					{
						showMode === 'otp' &&
						<div className={styles.otp_area}>
							<div className={styles.auth_header}>
								<h1>Verify OTP</h1>
							</div>
							<OtpInput
								value={otp}
								onChange={otp => {
									console.info(otp);
									setOtp(otp);
								}}
								numInputs={4}
								inputStyle={{
									fontSize: "24px",
									width: "36px",
									height: "36px",
									margin: "8px",
									borderTop: "0px",
									borderLeft: "0px",
									borderRight: "0px",
									outline: "none",
									borderColor: "rgba(0,0,0,0.15)",
									color: 'rgba(0,0,0,0.75)'
								}}
								focusStyle={{
									borderColor: '#001E62',
									color: '#001E62'
								}}
								containerStyle={{
									marginBottom: '50px',
									padding: "10px",
									justifyContent: 'center'
								}}
								isInputNum
							/>
							<button className={`btn ${styles.btn} ${styles.btn_submit} ${otp.length === 4 ? '' : 'gray'}`} disabled={otp.length === 4 ? false : true} onClick={(e) => forgotPassword(e, email, true)}>Verify OTP</button>
							<button className={`btn ${styles.btn} ${styles.btn_submit} ${styles.gray}`} type="button" onClick={(e) => forgotPassword(e, email, false)}>Resend OTP?</button>
							<button className={`btn ${styles.btn} ${styles.btn_submit} ${styles.gray}`} onClick={(e) => {
								setOtp('')
								setUsername('')
								setPassword('')
								setEmail('')
								setShowMode('login')
							}}>
								Cancel
							</button>
						</div>
					}
					{
						showMode === 'change' &&
						<>
							<div className={styles.auth_header}>
								<h1>Reset Password</h1>
							</div>
							<form>
								<div className={`form_grp ${styles.form_grp}`}>
									<label htmlFor="newpassword">New Password</label>
									<input
										autoComplete="on"
										type="password"
										value={rpass}
										onChange={e => setRpass(e.target.value)}
										className={`form_control ${styles.form_control}`}
										placeholder="Enter new password"
									/>
								</div>
									<div className={`form_grp ${styles.form_grp}`}>
										<div className={styles.flex_item}>
											<label htmlFor="password">Confirm Password</label>
										</div>
										<input
											autoComplete="on"
											type="password"
											value={rpassConfirm}
											onChange={e => setRpassConfirm(e.target.value)}
											className={`form_control ${styles.form_control}`}
											placeholder="Enter confirm password"
										/>
									</div>
									<button className={`btn ${styles.btn_submit} ${rpass === rpassConfirm ? '' : 'gray'}`} onClick={(e) => resetPassword(e, rpass, rpassConfirm)} disabled={rpass === rpassConfirm ? false : true}>
										Reset Password
									</button>
									<button className={`btn ${styles.btn} ${styles.btn_submit} ${styles.gray}`} onClick={(e) => {
										setOtp('')
										setUsername('')
										setPassword('')
										setEmail('')
										setRpass('')
										setRpassConfirm('')
										setShowMode('login')
									}}>
										Cancel
									</button>
							</form>
						</>
					}
				</div>
			</div>
		</PanelLayout>
	)
}

export default login