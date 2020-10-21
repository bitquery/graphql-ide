import { observer } from 'mobx-react-lite'
import React, { useEffect, useRef, useState } from 'react'
import Modal from 'react-modal'
import { Link } from 'react-router-dom'
import modalStore from '../../store/modalStore'
import queriesStore, { UserStore } from '../../store/queriesStore'
import tabsStore from '../../store/tabsStore'
import { generateLink } from '../../utils/common'
import copy from 'copy-to-clipboard'
import { useToasts } from 'react-toast-notifications'
import SaveQueryForm from '../SaveQueryForm'
import ShareQueryForm from '../ShareQueryForm'

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

const SaveQueryWindow = observer(() => {
	const { addToast } = useToasts()
	const [name, setName] = useState('')
	const [description, setDescription] = useState('')
	const [queryLink, setQueryLink] = useState('')
	const { saveQueryIsOpen, shareQueryIsOpen, toggleSaveQuery, toggleShareQuery } = modalStore
	const { currentQuery, saveQuery, currentVariables } = queriesStore
	const { renameCurrentTab } = tabsStore
	const { user } = UserStore
	const [params, setParams] = useState({})

	useEffect(() => {
		user &&
			setParams({
				account_id: user.id,
				query: currentQuery,
				arguments: currentVariables,
				name: name,
				description: description || null
			})
	}, [user, name, description, currentVariables, currentQuery])
	useEffect(() => {
		if(user) {
			setParams({...params, url: queryLink})
			copy(`http://localhost:3000/${queryLink}`)
		}
	}, [queryLink])
	useEffect(() => {
		user && saveQuery(params)
	}, [params.url])

	function shareHandler() {
		if (name) {
			setQueryLink(generateLink())
			toggleSaveQuery()
			renameCurrentTab(name)
			addToast('Query link copied to clipboard', {appearance: 'success'})
		} else { addToast('Name is required', {appearance: 'error'}) }
	}

    return (
		<>
			<Modal
				isOpen={saveQueryIsOpen}
				onRequestClose={toggleSaveQuery}
				style={customStyles}
				contentLabel="Example Modal"
			>
				<SaveQueryForm />
			</Modal>
			<Modal
				isOpen={shareQueryIsOpen}
				onRequestClose={toggleShareQuery}
				style={customStyles}
				contentLabel="Example Modal"
			>
				<ShareQueryForm user={user} />
			</Modal>
		</>
    )
})

export default SaveQueryWindow
