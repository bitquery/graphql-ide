import React, { useState } from 'react'
import Modal from 'react-modal'
import { login } from '../../api/api'
import modalStore from '../../store/modalStore'
import { observer } from 'mobx-react-lite'
import { Link } from 'react-router-dom'
import { UserStore } from '../../store/queriesStore'

const customStyles = {
	overlay: {
		position: 'fixed',
		zIndex: 10,
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		backgroundColor: 'rgba(255, 255, 255, 0.75)'
	},
	content : {
		top                   : '50%',
		left                  : '50%',
		right                 : 'auto',
		bottom                : 'auto',
		marginRight           : '-50%',
		transform             : 'translate(-50%, -50%)',
		overflow: 'auto',
		display: 'flex',
		flexDirection: 'column',
		maxHeight: '450px',
		minWidth: '450px',
		width: '40%',
		backgroundColor: '#353848',
		backgroundClip: 'padding-box',
		border: '1px solid rgba(0, 0, 0, 0.2)',
		borderRadius: '0.3rem',
		outline: 0,
	}
}
Modal.setAppElement('#root')

const RegisterWindow = observer(() => {
	const { getUser } = UserStore
	const { registerIsOpen, toggleRegister } = modalStore
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')

	const logIn = async () => {
		try {
			const { data } = await login(email, password)
			console.log(data)
			getUser()
			toggleRegister()
		} catch (e) { console.log(e.response.data[2].message) }
	}

    return (
		<Modal
			isOpen={registerIsOpen}
			onRequestClose={toggleRegister}
			style={customStyles}
			contentLabel="Example Modal"
		>
			<div className="modal modal__signup">
				<p className="p-modal">Email</p>
				<input type="text" className="query__save" value={email} onChange={e => setEmail(e.target.value)} />  
				<p className="p-modal">Password</p>
				<input type="password" className="query__save" value={password} onChange={e => setPassword(e.target.value)} />  
				<button className="button button_filled"onClick={logIn}>Login</button>
				<Link to="/reset" onClick={toggleRegister} >Forgot password?</Link>
				<Link to="/register" onClick={toggleRegister} >Do not have account?</Link>
			</div>
		</Modal>
    )
})

export default RegisterWindow
