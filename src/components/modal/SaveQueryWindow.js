import { observer } from 'mobx-react-lite'
import React, { useState } from 'react'
import Modal from 'react-modal'
import { Link } from 'react-router-dom'
import modalStore from '../../store/modalStore'
import queriesStore from '../../store/queriesStore'
import tabsStore from '../../store/tabsStore'
import { generateLink } from '../../utils/common'

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

const SaveQueryWindow = observer(({ user }) => {
	const [queryLink, setQueryLink] = useState('')
	const [name, setName] = useState('')
	const [description, setDescription] = useState('')
	const { saveQueryIsOpen, toggleSaveQuery } = modalStore
	const { currentQuery, saveQuery, currentVariables } = queriesStore
	const { renameCurrentTab } = tabsStore

	const params = () => {
		let params = {
			account_id: user.id,
			query: currentQuery,
			arguments: currentVariables,
			name: name,
			description: description || null,
		}
		return {
			value: () => params,
			withLink: () => {
				params.url = generateLink()
				setQueryLink(params.url)
				return params
			}
		}
	}
	const saveHandler = () => {
		saveQuery(params().value())
		toggleSaveQuery()
		renameCurrentTab(name)
	}
	const shareHandler = () => {
		saveQuery(params().withLink())
		renameCurrentTab(name)
	}

    return (
		<Modal
			isOpen={saveQueryIsOpen}
			onRequestClose={toggleSaveQuery}
			style={customStyles}
			contentLabel="Example Modal"
		>
			<div className="modal modal__signup">
				<p className="p-modal">Query name (required)</p>
				<input type="text" className="query__save"  
					value={name} onChange={e => setName(e.target.value)}
				/>  
				<p className="p-modal">Description (optional)</p>
				<input type="text" className="query__save" 
					value={description} onChange={e => setDescription(e.target.value)}
				/>  
				<button className="button button_filled" onClick={saveHandler} >Save</button>
				<button className="button button_filled" onClick={shareHandler} >Share</button>
				{ queryLink && <Link to={`/${queryLink}`}>http://localhost:3000/{queryLink}</Link> }
			</div>
		</Modal>
    )
})

export default SaveQueryWindow
