import React from 'react'
import EditDialog from './EditDialog'
import { observer } from 'mobx-react-lite'
import modalStore from '../../store/modalStore'
import StatisticsModal from './StatisticsModal'
import { Modal } from 'react-bootstrap'
import StartersQueriesModal from "./StartersQueriesModal";

const ModalWindow = observer(() => {
	const {
		modalIsOpen,
		editDialogIsOpen,
		statisticsModalIsOpen,
		startersQueriesModalIsOpen,
		toggleModal,
		toggleStatisticsModal,
		toggleStartersQueriesModal,
		toggleEditDialog,
	} = modalStore

	const onRequestClose = () => {
		toggleModal()
		if(editDialogIsOpen) toggleEditDialog()
		if(statisticsModalIsOpen) toggleStatisticsModal()
		if(startersQueriesModalIsOpen) toggleStartersQueriesModal()
	}

	return (
		<>
		<Modal
			centered
			show={modalIsOpen}
			size={statisticsModalIsOpen ? 'lg' : 'md'}
			onHide={onRequestClose}
		>
			<EditDialog active={editDialogIsOpen} />
			<StatisticsModal active={statisticsModalIsOpen} />
			 <StartersQueriesModal active={startersQueriesModalIsOpen}/>
		</Modal>
		</>
	)
})

export default ModalWindow
