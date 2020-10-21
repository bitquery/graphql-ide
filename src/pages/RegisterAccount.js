import React, { useState } from 'react'
import { signUp } from '../api/api'
import { useToasts } from 'react-toast-notifications'

function RegisterAccount() {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const { addToast } = useToasts()

	const style = {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center'
	}
	const register = async e => {
		e.preventDefault()
		try {
			const { data } = await signUp(email, password)
			addToast(data, {appearance: 'success'})
		} catch (e) {
			addToast(e.response.data[1], {appearance: 'error'})
		}
	}

	return (
		<div className="reset">
			<form style={style} onSubmit={register} className="reset__form" >
				<h2>Register Account</h2>
				<p className="p-modal">Email</p>
				<input type="text" className="query__save" value={email} onChange={e => setEmail(e.target.value)} />  
				<p className="p-modal">Password</p>
				<input type="text" className="query__save" value={password} onChange={e => setPassword(e.target.value)} />  
				<button className="button button_filled" type="submit">Sign Up</button>
			</form>
		</div>
	)
}

export default RegisterAccount