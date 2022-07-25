import React, { useState } from 'react'
import { login } from '../../api/api'
import { useToasts } from 'react-toast-notifications'
import { UserStore } from '../../store/queriesStore'
import modalStore from '../../store/modalStore'
import axios from 'axios'
import { validEmail } from '../../utils/common'
import { Button, Modal, Form, Container, Row, Col } from 'react-bootstrap';

function LoginForm({ active }) {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [resend, setResend] = useState(false)
	const { getUser } = UserStore
	const { toggleRegister, toggleLogin, toggleModal, toggleForgotPassword } = modalStore
	const { addToast } = useToasts()
	const dontHaveAccountHandler = () => {
		toggleLogin()
		toggleRegister()
	}
	const forgotPasswordHandler = () => {
		toggleLogin()
		toggleForgotPassword()
	}
	const logIn = async e => {
		e.preventDefault()
		if (validEmail(email) && password) {
			try {
				const { data } = await login(email, password)
				console.log(data)
				addToast(data, {appearance: 'success'})
				getUser()
				toggleLogin()
				toggleModal()
			} catch (e) { 
				addToast(e.response.data, {appearance: 'error'});
				(e.response.data[0] === 'A') && setResend(true)
			}
		}
	}
	const resendActivationLink = async e => {
		try {
			const { data } = await axios.post('/api/resendactivation', {email})
			addToast(data, {appearance: 'success'})
		} catch (error) {
			addToast(error.response.data, {appearance: 'error'})
		}

	}
	
	return active && (
		<>
			<Modal.Header>
				<Modal.Title>Please login to continue</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Form onSubmit={logIn}>
					<Form.Group>
						<Form.Label>Email address</Form.Label>
						<Form.Control type="email" value={email} onChange={e => setEmail(e.target.value)} />
					</Form.Group>
					<Form.Group>
						<Form.Label>Password</Form.Label>
						<Form.Control type="password" value={password} onChange={e => setPassword(e.target.value)} />
					</Form.Group>
					<Form.Group className="text-center">
						<Button variant="primary" type="submit" >Submit</Button>
					</Form.Group>
					{resend &&<a href="# " onClick={resendActivationLink}>Check Your email or resend activation link</a>}
				</Form>
				<Container>
					<Row>
						<Col>
							<a href="# " data-toggle="modal" data-target="#forgotModal" onClick={forgotPasswordHandler}>Forgot password?</a>
						</Col>
						<Col className="text-right">
							<a href="# " data-toggle="modal" data-target="#signupModal" onClick={dontHaveAccountHandler}>Do not have account?</a>
						</Col>
					</Row>
				</Container>
			</Modal.Body>
		</>
	)
}

export default LoginForm
