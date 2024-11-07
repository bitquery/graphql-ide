import React from 'react'
import EditDialog from './EditDialog'
import ApiKeyModal from './ApiKeyModal'
import { observer } from 'mobx-react-lite'
import modalStore from '../../store/modalStore'
import StatisticsModal from './StatisticsModal'
import DashbaordSettings from './DashbaordSettings'
import { Modal } from 'react-bootstrap'

const ModalWindow = observer(() => {
	const {
		fade, modalIsOpen, editDialogIsOpen, apiKeyIsOpen,
		statisticsModalIsOpen, dashboardSettingsIsOpen,
		toggleModal, toggleStatisticsModal, toggleEditDialog,
		toggleApiKey, toggleDashboardSettings
	} = modalStore

	const onRequestClose = () => {
		toggleModal()
		apiKeyIsOpen && toggleApiKey()
		editDialogIsOpen && toggleEditDialog()
		statisticsModalIsOpen && toggleStatisticsModal()
		dashboardSettingsIsOpen && toggleDashboardSettings()
	}

	return (
		<Modal
			centered
			fade={fade.toString()}
			show={modalIsOpen}
			size={statisticsModalIsOpen ? 'lg' : 'md'}
			onHide={fade ? null : onRequestClose}
		>
			<ApiKeyModal active={apiKeyIsOpen} />
			<EditDialog active={editDialogIsOpen} />
			<StatisticsModal active={statisticsModalIsOpen} />
			<DashbaordSettings active={dashboardSettingsIsOpen} />
		</Modal>
    )
})

export default ModalWindow
