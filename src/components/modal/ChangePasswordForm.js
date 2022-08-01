import axios from 'axios'
import React from 'react'
import { useState } from 'react'
import { Button, Form, Modal } from 'react-bootstrap'
import { useToasts } from 'react-toast-notifications'
import modalStore from '../../store/modalStore'

function ChangePassword({active}) {
	const { toggleChangePassword, toggleModal } = modalStore
	const { addToast } = useToasts()
	const [oldPwd, setOldPwd] = useState('')
	const [newPwd, setNewPwd] = useState('')
	const closeHandler = () => {
		toggleChangePassword()
		toggleModal()
	}
	const changePwd = async (e) => {
		e.preventDefault()
		if (oldPwd && newPwd) {
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
		} else {
			addToast('Fill all fields', { appearance: 'error' })
		}
	}
	
	return active && (
		<>
			<Modal.Header>Here you can change password</Modal.Header>
			<Modal.Body>
				<Form onSubmit={changePwd} >
					<Form.Group>
						<Form.Label>Old Password</Form.Label>
						<Form.Control type="password" value={oldPwd} onChange={e => setOldPwd(e.target.value)} />
					</Form.Group>
					<Form.Group>
						<Form.Label>New Password</Form.Label>
						<Form.Control type="password" value={newPwd} onChange={e => setNewPwd(e.target.value)} />
					</Form.Group>
					<Form.Group className="d-flex justify-content-around">
						<Button variant="primary" type="cancel" onClick={closeHandler} >Cancel</Button>
						<Button variant="primary" type="submit" >Submit</Button>
					</Form.Group>
				</Form>	
			</Modal.Body>
		</>
	)
}

export default ChangePassword