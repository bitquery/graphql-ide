import React, { useState } from 'react'
import { login } from '../../api/api'
import { Link } from 'react-router-dom'
import { useToasts } from 'react-toast-notifications'
import { UserStore } from '../../store/queriesStore'
import modalStore from '../../store/modalStore'

function LoginForm({ active }) {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const { getUser } = UserStore
	const { registerIsOpen, toggleRegister, toggleLogin, closeHandler } = modalStore
	const { addToast } = useToasts()
	const logIn = async e => {
		e.preventDefault()
		if (email && password) {
			try {
				const { data } = await login(email, password)
				console.log(data)
				addToast(data, {appearance: 'success'})
				getUser()
				toggleRegister()
			} catch (e) { addToast(e.response.data, {appearance: 'error'}) }
		}
	}
	return (
		<form onSubmit={e => logIn(e)} className={'modal__form '+(active && 'modal__form_hide')} >
			<p className="p-modal">Email</p>
			<input type="text" className="query__save" value={email} onChange={e => setEmail(e.target.value)} />  
			<p className="p-modal">Password</p>
			<input type="password" className="query__save" value={password} onChange={e => setPassword(e.target.value)} />  
			<button className="button button_filled"onClick={logIn}>Login</button>
			<Link to="/reset" onClick={toggleRegister} >Forgot password?</Link>
			<a onClick={toggleLogin}>Do not have account?</a>
			<button className="handler handler__close" onClick={closeHandler} />
		</form>
	)
}

export default LoginForm
