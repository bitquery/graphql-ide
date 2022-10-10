import React, { useState } from 'react'
import axios from 'axios'
import { useToasts } from 'react-toast-notifications'
import { validEmail } from '../../utils/common'
import modalStore from '../../store/modalStore'
import { Button, Form, Modal } from 'react-bootstrap'

function ResetPassword({active}) {
	const [email, setEmail] = useState('')
	const { fade, toggleLogin, toggleModal, toggleForgotPassword } = modalStore
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

	return active && (
		<>
			<Modal.Header>Forgot password</Modal.Header>
			<Modal.Body>
				<Form onSubmit={sendPasswordResetLink} >
					<p>Enter your email below and reset password instruction will be sent </p>
					<Form.Group>
						<Form.Label>Email</Form.Label>
						<Form.Control type="email" value={email} onChange={e => setEmail(e.target.value)} />
					</Form.Group>
					<Form.Group className="d-flex justify-content-around">
						<Button type="cancel" onClick={backHandler}>Back</Button>
						<Button type="submit">Submit</Button>
					</Form.Group>
				</Form>
			</Modal.Body>
		</>
	)
}

export default ResetPassword