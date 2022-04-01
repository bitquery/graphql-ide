import React from 'react'
import Modal from 'react-modal'
import LoginForm from './LoginForm'
import EditDialog from './EditDialog'
import ApiKeyModal from './ApiKeyModal'
import RegisterForm from './RegisterForm'
import { observer } from 'mobx-react-lite'
import SaveQueryFrom from './SaveQueryForm'
import modalStore from '../../store/modalStore'
import StatisticsModal from './StatisticsModal'
import ForgotPasswordForm from './ForgotPasswordForm'
import ChangePasswordForm from './ChangePasswordForm'
import DashbaordSettings from './DashbaordSettings'

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
		minWidth: '450px',
		width: '40%',
		backgroundColor: '#f0f0f0',
		backgroundClip: 'padding-box',
		border: '1px solid rgba(0, 0, 0, 0.2)',
		borderRadius: '0.3rem',
		outline: 0,
	}
}

Modal.setAppElement('#graphql_ide')

const ModalWindow = observer(() => {
	const { 
		fade, registerIsOpen, loginIsOpen, modalIsOpen,
		saveQueryIsOpen, editDialogIsOpen, apiKeyIsOpen, statisticsModalIsOpen,
		forgotPasswordIsOpen, changePasswordIsOpen, dashboardSettingsIsOpen,
		toggleModal, toggleLogin, toggleRegister, toggleStatisticsModal,
		toggleSaveQuery, toggleEditDialog, toggleApiKey,
		toggleForgotPassword, toggleChangePassword, toggleDashboardSettings
	} = modalStore
	
	const onRequestClose = () => {
		toggleModal()
		loginIsOpen && toggleLogin()
		apiKeyIsOpen && toggleApiKey()
		registerIsOpen && toggleRegister()
		saveQueryIsOpen && toggleSaveQuery()
		editDialogIsOpen && toggleEditDialog()
		forgotPasswordIsOpen && toggleForgotPassword()
		changePasswordIsOpen && toggleChangePassword()
		statisticsModalIsOpen && toggleStatisticsModal()
		dashboardSettingsIsOpen && toggleDashboardSettings()
	}
	
    return (
		<Modal
			isOpen={modalIsOpen}
			onRequestClose={fade ? null : onRequestClose}
			style={customStyles}
			contentLabel="Example Modal"
			overlayClassName={fade ? "Overlay" : ''}
		>
			<LoginForm active={loginIsOpen} />
			<ApiKeyModal active={apiKeyIsOpen} />
			<EditDialog active={editDialogIsOpen} />
			<RegisterForm active={registerIsOpen} />
			<SaveQueryFrom  active={saveQueryIsOpen} />
			<StatisticsModal active={statisticsModalIsOpen} />
			<ChangePasswordForm active={changePasswordIsOpen} />
			<ForgotPasswordForm active={forgotPasswordIsOpen} />
			<DashbaordSettings active={dashboardSettingsIsOpen} />
		</Modal>
    )
})

export default ModalWindow
