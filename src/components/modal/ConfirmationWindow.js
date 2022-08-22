import { observer } from 'mobx-react-lite'
import React from 'react'
import { Modal } from 'react-bootstrap'
import modalStore from '../../store/modalStore'

const ConfirmationWindow = observer(() => {
	const { confirmationIsOpen, toggleConfirmation, 
		confirmationMessage, confirmationAction } = modalStore
	const confirmHandler = () => {
		confirmationAction()
		toggleConfirmation()
	}
	return (
		<Modal
			className='confirmation-modal'
			centered
			fade
			show={confirmationIsOpen}
			onHide={toggleConfirmation}
		>
			<p>{confirmationMessage}</p>
			<div className="buttons flex" style={{'justifyContent': 'space-around', 'width': '100%'}}>
				<button type="button" className="btn btn-primary btn-sm" onClick={()=>toggleConfirmation()}>Cancel</button>
				<button type="button" className="btn btn-danger btn-sm" onClick={confirmHandler}>Confirm</button>
			</div>	
		</Modal>
	)
})

export default ConfirmationWindow
