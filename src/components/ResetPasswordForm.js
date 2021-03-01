import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useToasts } from 'react-toast-notifications'
import { Link } from 'react-router-dom'
import axios from 'axios'

function ResetPasswordForm() {
	const style = {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center'
	}
	const [password, setPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')
	let { token } = useParams()
	const { addToast } = useToasts()
	const resetPassword = async e => {
		e.preventDefault()
		if (password === confirmPassword) {
			try {
				const { data } = await axios.post('/api/reset', {
					password,
					token
				})
				addToast(data, {appearance: 'success'})
			} catch (e) {
				console.log(e.response.data)
				addToast(e.response.data, {appearance: 'error'})
			}
		} else { 
			addToast('Passwords do not match!', {appearance: 'error'})
		}
	}
	return (
		<form style={style} onSubmit={resetPassword} className="reset__form" >
			<Link to="/">Home</Link>
			<h1>Confirm new password</h1>
			<p className="p-modal">New password</p>
			<input type="password" className="query__save" 
				value={password} onChange={e => setPassword(e.target.value)} 
			/>  
			<p className="p-modal">Confirm password</p>
			<input type="password" className="query__save" 
				value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} 
			/>  
			<button className="button button_filled" type="submit">Change password</button>
		</form>
	)
}

export default ResetPasswordForm
