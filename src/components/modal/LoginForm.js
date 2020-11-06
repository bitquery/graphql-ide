import React, { useState } from 'react'
import { login } from '../../api/api'
import { useToasts } from 'react-toast-notifications'
import { UserStore } from '../../store/queriesStore'
import modalStore from '../../store/modalStore'
import axios from 'axios'
import { validEmail } from '../../utils/common'

function LoginForm({ active }) {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [resend, setResend] = useState(false)
	const { getUser } = UserStore
	const { toggleRegister, toggleLogin, toggleModal, toggleForgotPassword } = modalStore
	const { addToast } = useToasts()
	const closeHandler = () => {
		toggleModal()
		toggleLogin()
	}
	const dontHaveAccountHandler = () => {
		toggleLogin()
		toggleRegister()
	}
	const forgotPasswordHandler = () => {
		toggleLogin()
		toggleForgotPassword()
	}
	const logIn = async e => {
		e.preventDefault()
		if (validEmail(email) && password) {
			try {
				const { data } = await login(email, password)
				console.log(data)
				addToast(data, {appearance: 'success'})
				getUser()
				toggleLogin()
				toggleModal()
			} catch (e) { 
				addToast(e.response.data, {appearance: 'error'});
				(e.response.data[0] === 'A') && setResend(true)
			}
		}
	}
	const resendActivationLink = async e => {
		try {
			const { data } = await axios.post('/api/resendactivation', {email})
			addToast(data, {appearance: 'success'})
		} catch (error) {
			addToast(error.response.data, {appearance: 'error'})
		}

	}
	return (
		<form onSubmit={e => logIn(e)} className={'modal__form '+(!active && 'modal__form_hide')} >
			<p className="p-modal">Email</p>
			<input type="text" className="query__save" value={email} onChange={e => setEmail(e.target.value)} />  
			<p className="p-modal">Password</p>
			<input type="password" className="query__save" value={password} onChange={e => setPassword(e.target.value)} />  
			<button className="button button_filled"onClick={logIn}>Login</button>
			<i className="handler handler__close fas fa-times" onClick={closeHandler} />
			{resend &&<a href="# " onClick={resendActivationLink}>Check Your email or resend activation link</a>}
			<div className="flex modal__form__options">
				<a href="# " onClick={forgotPasswordHandler} >Forgot password?</a>
				<a href="# " onClick={dontHaveAccountHandler}>Do not have account? Sign Up</a>
			</div>
		</form>
	)
}

export default LoginForm
