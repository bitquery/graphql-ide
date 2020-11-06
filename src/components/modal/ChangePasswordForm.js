import axios from 'axios'
import React from 'react'
import { useState } from 'react'
import { useToasts } from 'react-toast-notifications'
import modalStore from '../../store/modalStore'

function ChangePassword({active}) {
	const { toggleChangePassword, toggleModal } = modalStore
	const { addToast } = useToasts()
	const [oldPwd, setOldPwd] = useState('')
	const [newPwd, setNewPwd] = useState('')
	const [confirmNewPwd, setConfirmNewPwd] = useState('')
	const closeHandler = () => {
		toggleChangePassword()
		toggleModal()
	}
	const changePwd = async (e) => {
		e.preventDefault()
		if (newPwd === confirmNewPwd && oldPwd && newPwd) {
			try {
				const { data } = await axios.post('/api/changepassword', {
					oldPwd,
					newPwd
				})
				toggleModal()
				toggleChangePassword()
				addToast(data, { appearance: 'success' })
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
			<form onSubmit={changePwd} className={'modal__form '+(!active && 'modal__form_hide')} >
				<h2>Here you can change password</h2>
				<p className="p-modal">Old Password</p>
				<input type="password" className="query__save" value={oldPwd} onChange={e => setOldPwd(e.target.value)} />  
				<p className="p-modal">New Password</p>
				<input type="password" className="query__save" value={newPwd} onChange={e => setNewPwd(e.target.value)} />  
				<p className="p-modal">Confirm Password</p>
				<input type="password" className="query__save" value={confirmNewPwd} onChange={e => setConfirmNewPwd(e.target.value)} />  
				<i className="handler handler__close fas fa-times" onClick={closeHandler} />
				<button className="button button_filled" type="submit">Apply</button>
			</form>
		</div>
	)
}

export default ChangePassword