import React, { useContext } from 'react'
import Modal from 'react-modal'
import { ModalContext } from './ModalContext'

const customStyles = {
	overlay: {
		position: 'fixed',
		zIndex: 4,
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

function SaveQueryWindow() {

	const { saveQueryIsOpen, toggleSaveQuery } = useContext(ModalContext)

    return (
		<Modal
			isOpen={saveQueryIsOpen}
			onRequestClose={toggleSaveQuery}
			style={customStyles}
			contentLabel="Example Modal"
		>
			<div className="modal modal__signup">
				<p className="p-modal">Query name (required)</p>
				<input type="text" className="query__save"  />  
				<p className="p-modal">Description (optional)</p>
				<input type="text" className="query__save" />  
				<button className="button button__signup">Save</button>
				<p v-if="link">
					Your link 
					<a href="">{`http://localhost:8080/query/`}</a>
				</p>
			</div>
		</Modal>
    )
}

// ReactDOM.render(<App />, appElement);
export default SaveQueryWindow
