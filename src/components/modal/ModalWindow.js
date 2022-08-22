import React from 'react'
import LoginForm from './LoginForm'
import EditDialog from './EditDialog'
import ApiKeyModal from './ApiKeyModal'
import RegisterForm from './RegisterForm'
import { observer } from 'mobx-react-lite'
import modalStore from '../../store/modalStore'
import StatisticsModal from './StatisticsModal'
import ForgotPasswordForm from './ForgotPasswordForm'
import ChangePasswordForm from './ChangePasswordForm'
import DashbaordSettings from './DashbaordSettings'
import { Modal } from 'react-bootstrap'

const ModalWindow = observer(() => {
	const { 
		fade, registerIsOpen, loginIsOpen, modalIsOpen,
		editDialogIsOpen, apiKeyIsOpen, statisticsModalIsOpen,
		forgotPasswordIsOpen, changePasswordIsOpen, dashboardSettingsIsOpen,
		toggleModal, toggleLogin, toggleRegister, toggleStatisticsModal,
		toggleEditDialog, toggleApiKey,
		toggleForgotPassword, toggleChangePassword, toggleDashboardSettings
	} = modalStore
	
	const onRequestClose = () => {
		toggleModal()
		loginIsOpen && toggleLogin()
		apiKeyIsOpen && toggleApiKey()
		registerIsOpen && toggleRegister()
		editDialogIsOpen && toggleEditDialog()
		forgotPasswordIsOpen && toggleForgotPassword()
		changePasswordIsOpen && toggleChangePassword()
		statisticsModalIsOpen && toggleStatisticsModal()
		dashboardSettingsIsOpen && toggleDashboardSettings()
	}
	
    return (
		<Modal
			centered
			fade
			show={modalIsOpen}
			size={statisticsModalIsOpen ? 'lg' : 'md'}
			onHide={fade ? null : onRequestClose}
		>
			<LoginForm active={loginIsOpen} />
			<ApiKeyModal active={apiKeyIsOpen} />
			<EditDialog active={editDialogIsOpen} />
			<RegisterForm active={registerIsOpen} />
			<StatisticsModal active={statisticsModalIsOpen} />
			<ChangePasswordForm active={changePasswordIsOpen} />
			<ForgotPasswordForm active={forgotPasswordIsOpen} />
			<DashbaordSettings active={dashboardSettingsIsOpen} />
		</Modal>
    )
})

export default ModalWindow
