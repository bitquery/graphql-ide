import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Link } from 'react-router-dom'
import axios from 'axios'

function ResetPasswordForm() {
	const style = {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center'
	}
	const [password, setPassword] = useState('')
	let { token } = useParams()
	const resetPassword = async e => {
		e.preventDefault()
		try {
			const { data } = await axios.post('/api/reset', {
				password,
				token
			})
			toast(data, {type: 'success'})
		} catch (e) {
			console.log(e.response.data)
			toast(e.response.data, {type: 'error'})
		}
	}
	return (
		<form style={style} onSubmit={resetPassword} className="reset__form" >
			<Link to='/'>Home</Link>
			<h1>Confirm new password</h1>
			<p className="p-modal">New password</p>
			<input type="password" className="query__save" 
				value={password} onChange={e => setPassword(e.target.value)} 
			/>

			<button className="button button_filled" type="submit">Change password</button>
		</form>
	)
}

export default ResetPasswordForm
