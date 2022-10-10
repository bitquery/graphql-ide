import React, { useState, createRef } from 'react'
import { signUp } from '../../api/api'
import { useToasts } from 'react-toast-notifications'
import modalStore from '../../store/modalStore'
import { validEmail } from '../../utils/common'
import ReCAPTCHA from "react-google-recaptcha"
import { Button, Form, Modal } from 'react-bootstrap'

function RegisterForm({ active }) {
	const recaptchaRef = createRef()
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [accountName, setName] = useState('')
	const [companyName, setCompanyName] = useState('')
	const [captcha, setCaptcha] = useState('')
	const { addToast } = useToasts()
	const { fade, toggleLogin, toggleModal, toggleRegister } = modalStore
	const closeHandler = () => {
		toggleModal()
		toggleRegister()		
	}
	const backHandler = () => {
		toggleRegister()
		toggleLogin()		
	}
	function onChange(value) {
		setCaptcha(value)
	}
	const register = async e => {
		e.preventDefault()
		if (password && validEmail(email) && accountName && captcha) {
			try {
				const { data } = await signUp(email, password, accountName, companyName, captcha)
				addToast(data, {appearance: 'success'})
				toggleRegister()
				toggleModal()
			} catch (e) {
				recaptchaRef.current.reset()
				addToast(e.response.data, {appearance: 'error'})
			}
		} else {
			addToast('Email is not valid or fill all required fields', {appearance: 'error'})
		}
	}
	return active && (
		<>
			<Modal.Body>
				<Form onSubmit={register} className="d-flex flex-column" >
					<Form.Group>
						<Form.Label>Email (used for login)</Form.Label>
						{!email && <div className="required">*required</div>}
						<Form.Control type="email" value={email} onChange={e => setEmail(e.target.value)} />
					</Form.Group>
					<Form.Group>
						<Form.Label>Password</Form.Label>
						{!password && <div className="required">*required</div>}
						<Form.Control type="password" value={password} onChange={e => setPassword(e.target.value)} />
					</Form.Group>
					<Form.Group>
						<Form.Label>Name</Form.Label>
						{!accountName && <div className="required">*required</div>}
						<Form.Control type="text" value={accountName} onChange={e => setName((e.target.value).trim())} />
					</Form.Group>
					<Form.Group>
						<Form.Label>Company Name</Form.Label>
						{!accountName && <div className="required">*required</div>}
						<Form.Control type="text" value={companyName} onChange={e => setCompanyName(e.target.value)} />
					</Form.Group>
					<Form.Group className="d-flex justify-content-center">
						<ReCAPTCHA
							ref={recaptchaRef}
							sitekey="6LfZXscaAAAAAPTYeT0IbcFE1-2v-MlJ3aAj5SaY"
							onChange={onChange}
						/>
					</Form.Group>
					<Form.Group className="d-flex justify-content-around">
						<Button type="cancel" onClick={backHandler} > Back </Button>
						<Button type="submit" > Sign Up </Button>
					</Form.Group>
				</Form>
			</Modal.Body>
		</>
	)
}

export default RegisterForm
