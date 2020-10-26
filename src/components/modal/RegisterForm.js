import React, { useState } from 'react'
import { signUp } from '../../api/api'
import { useToasts } from 'react-toast-notifications'
import modalStore from '../../store/modalStore'

function RegisterForm({ active }) {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const { addToast } = useToasts()
	const { toggleLogin, closeHandler } = modalStore
	const style = {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center'
	}
	const register = async e => {
		e.preventDefault()
		if (password && email) {
			try {
				const { data } = await signUp(email, password)
				addToast(data, {appearance: 'success'})
				closeHandler()
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
			<input type="text" className="query__save" value={password} onChange={e => setPassword(e.target.value)} />  
			<button className="button button_filled" onClick={register}>Sign Up</button>
			<button className="handler handler__back" onClick={toggleLogin} />
			<button className="handler handler__close" onClick={closeHandler} />
		</form>
	)
}

export default RegisterForm
