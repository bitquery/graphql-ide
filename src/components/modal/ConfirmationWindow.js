import { observer } from 'mobx-react-lite'
import React from 'react'
import { Modal, Button } from 'react-bootstrap'
import modalStore from '../../store/modalStore'

const ConfirmationWindow = observer(() => {
	const { confirmationIsOpen, toggleConfirmation, confirmationMessage, confirmationAction } = modalStore

	const confirmHandler = () => {
		confirmationAction()
		toggleConfirmation()
	}

	return (
		<Modal
			className="confirmation-modal"
			centered
			show={confirmationIsOpen}
			onHide={toggleConfirmation}
		>
			<Modal.Body>
				<p>{confirmationMessage}</p>
			</Modal.Body>
			<Modal.Footer className="d-flex justify-content-around">
				<Button variant="primary" size="sm" onClick={toggleConfirmation}>
					Cancel
				</Button>
				<Button variant="danger" size="sm" onClick={confirmHandler}>
					Confirm
				</Button>
			</Modal.Footer>
		</Modal>
	)
})

export default ConfirmationWindow
