import axios from 'axios'
import React from 'react'
import { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useToasts } from 'react-toast-notifications'
import logo from '../assets/images/bitquery_logo.png'

function ChangePassword() {
	const style = {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center'
	}
	const { addToast } = useToasts()
	const [oldPwd, setOldPwd] = useState('')
	const [newPwd, setNewPwd] = useState('')
	const [confirmNewPwd, setConfirmNewPwd] = useState('')
	let history = useHistory()
	
	const changePwd = async (e) => {
		e.preventDefault()
		if (newPwd === confirmNewPwd && oldPwd && newPwd) {
			try {
				const { data } = await axios.post('/api/changepassword', {
					oldPwd,
					newPwd
				})
				console.log(data)
				setTimeout(() => {
					history.push('/')
				}, 3000)
				addToast(data, { appearance: 'success' })
				addToast('Redirect in 3 seconds...', { appearance: 'success' })
			} catch (error) {
				addToast(error.response.data, { appearance: 'error' })
			}
		} else if (newPwd !== confirmNewPwd) {
			addToast('Passwords do not match!', { appearance: 'error' })
		} else {
			addToast('Fill all fields', { appearance: 'error' })
		}
	}
	
	return (
		<div className="reset__password">
			<form style={style} onSubmit={changePwd} className="reset__form" >
				<h2>Here you can change password</h2>
				<p className="p-modal">Old Password</p>
				<input type="password" className="query__save" value={oldPwd} onChange={e => setOldPwd(e.target.value)} />  
				<p className="p-modal">New Password</p>
				<input type="password" className="query__save" value={newPwd} onChange={e => setNewPwd(e.target.value)} />  
				<p className="p-modal">Confirm Password</p>
				<input type="password" className="query__save" value={confirmNewPwd} onChange={e => setConfirmNewPwd(e.target.value)} />  
				<button className="button button_filled" type="submit">Apply</button>
			</form>
		</div>
	)
}

export default ChangePassword
