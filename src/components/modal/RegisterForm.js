import React, { useState } from 'react'
import { signUp } from '../../api/api'
import { useToasts } from 'react-toast-notifications'
import modalStore from '../../store/modalStore'
import { validEmail } from '../../utils/common'

function RegisterForm({ active }) {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const { addToast } = useToasts()
	const { toggleLogin, toggleModal, toggleRegister } = modalStore
	const closeHandler = () => {
		toggleModal()
		toggleRegister()		
	}
	const backHandler = () => {
		toggleRegister()
		toggleLogin()		
	}
	const register = async e => {
		e.preventDefault()
		if (password && validEmail(email)) {
			try {
				const { data } = await signUp(email, password)
				addToast(data, {appearance: 'success'})
				toggleRegister()
				toggleModal()
			} catch (e) {
				addToast(e.response.data, {appearance: 'error'})
			}
		}
	}
	return (
		<form className={'modal__form '+(!active && 'modal__form_hide')} >
			<p className="p-modal">Email</p>
			<input type="text" className="query__save" value={email} onChange={e => setEmail(e.target.value)} />  
			<p className="p-modal">Password</p>
			<input type="password" className="query__save" value={password} onChange={e => setPassword(e.target.value)} />  
			<button className="button button_filled" onClick={register}>Sign Up</button>
			<i className="handler handler__back fas fa-chevron-left" onClick={backHandler} />
			<i className="handler handler__close fas fa-times" onClick={closeHandler} />
		</form>
	)
}

export default RegisterForm
