import { observer } from 'mobx-react-lite'
import React from 'react'
import Modal from 'react-modal'
import modalStore from '../../store/modalStore'

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
		maxHeight: '500px',
		minWidth: '250px',
		width: '30%',
		backgroundColor: '#f0f0f0',
		backgroundClip: 'padding-box',
		border: '1px solid rgba(0, 0, 0, 0.2)',
		borderRadius: '0.3rem',
		outline: 0,
	}
}

Modal.setAppElement('#graphql_ide')

const ConfirmationWindow = observer(({message, action}) => {
	const { confirmationIsOpen, toggleConfirmation } = modalStore
	const confirmHandler = () => {
		action()
		toggleConfirmation()
	}
	return (
		<Modal
			isOpen={confirmationIsOpen}
			onRequestClose={toggleConfirmation}
			style={customStyles}
			contentLabel="Confirmation Modal"
		>
			<p>{message}</p>
			<div className="buttons flex" style={{'justifyContent': 'space-around', 'width': '100%'}}>
				<button type="button" className="btn btn-primary btn-sm" onClick={toggleConfirmation}>Cancel</button>
				<button type="button" className="btn btn-danger btn-sm" onClick={confirmHandler}>Confirm</button>
			</div>	
		</Modal>
	)
})

export default ConfirmationWindow
