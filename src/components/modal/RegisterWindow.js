import React from 'react'
import Modal from 'react-modal'
import modalStore from '../../store/modalStore'
import { observer } from 'mobx-react-lite'
import RegisterForm from './RegisterForm'
import LoginForm from './LoginForm'

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
		backgroundColor: '#d1d1d1',
		backgroundClip: 'padding-box',
		border: '1px solid rgba(0, 0, 0, 0.2)',
		borderRadius: '0.3rem',
		outline: 0,
	}
}
Modal.setAppElement('#graphql_ide')

const RegisterWindow = observer(() => {
	const { registerIsOpen, loginIsOpen, closeHandler } = modalStore

    return (
		<Modal
			isOpen={registerIsOpen}
			onRequestClose={closeHandler}
			style={customStyles}
			contentLabel="Example Modal"
		>
			<LoginForm active={loginIsOpen} />
			<RegisterForm active={loginIsOpen} />
		</Modal>
    )
})

export default RegisterWindow
