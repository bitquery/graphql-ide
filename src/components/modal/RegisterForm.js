import React, { useState } from 'react'
import { signUp } from '../../api/api'
import { useToasts } from 'react-toast-notifications'
import modalStore from '../../store/modalStore'
import { validEmail } from '../../utils/common'

function RegisterForm({ active }) {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [accountName, setName] = useState('')
	const [companyName, setCompanyName] = useState('')
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
		if (password && validEmail(email) && accountName) {
			try {
				const { data } = await signUp(email, password, accountName, companyName)
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
			<div style={{'display': 'flex', 'width': '100%', 'justifyContent': 'center', 'position': 'relative'}}>
				<div className="p-modal">Email (used for login)</div>
				{!email && <div className="required">*required</div>}
			</div>
			<input type="text" className="query__save" value={email} onChange={e => setEmail(e.target.value)} />  
			<div style={{'display': 'flex', 'width': '100%', 'justifyContent': 'center', 'position': 'relative'}}>
				<div className="p-modal">Password</div>
				{!password && <div className="required">*required</div>}
			</div>
			<input type="password" className="query__save" value={password} onChange={e => setPassword(e.target.value)} />  
			<div style={{'display': 'flex', 'width': '100%', 'justifyContent': 'center', 'position': 'relative'}}>
				<div className="p-modal">Name</div>
				{!accountName && <div className="required">*required</div>}
			</div>
			<input type="text" className="query__save" value={accountName} onChange={e => setName((e.target.value).trim())} />  
			<div className="p-modal">Company Name</div>
			<input type="text" className="query__save" value={companyName} onChange={e => setCompanyName(e.target.value)} />  
			<button className="button button_filled" onClick={register}>Sign Up</button>
			<i className="handler handler__back fas fa-chevron-left" onClick={backHandler} />
			<i className="handler handler__close fas fa-times" onClick={closeHandler} />
		</form>
	)
}

export default RegisterForm
