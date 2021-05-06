import React, { useState } from 'react'
import axios from 'axios'
import { useToasts } from 'react-toast-notifications'
import { validEmail } from '../../utils/common'
import modalStore from '../../store/modalStore'

function ResetPassword({active}) {
	const [email, setEmail] = useState('')
	const { toggleLogin, toggleModal, toggleForgotPassword } = modalStore
	const { addToast } = useToasts()
	const backHandler = () => {
		toggleForgotPassword()
		toggleLogin()
	}
	const closeHandler = () => {
		toggleForgotPassword()
		toggleModal()
	}
	const sendPasswordResetLink = async e => {
		e.preventDefault()
		if (validEmail(email)) {
			try {
				const { data } = await axios.post('/api/forgot', { email })
				closeHandler()
				addToast(data, { appearance: 'success' })
			} catch (e) {
				addToast(e.response.data, { appearance: 'error' })
			}
		}
	}

	return (
		<form onSubmit={sendPasswordResetLink} className={'modal__form '+(!active && 'modal__form_hide')} >
			<h2>Forgot password</h2>
			<p>Enter your email below and reset password instruction will be sent </p>
			<p className="p-modal">Email</p>
			<input type="text" className="query__save" value={email} onChange={e => setEmail(e.target.value)} />
			<i className="handler handler__back fas fa-chevron-left" onClick={backHandler} />
			<i className="handler handler__close fas fa-times" onClick={closeHandler} />
			<button className="button button_filled" type="submit">GO</button>
		</form>
	)
}

export default ResetPassword