import React, { useEffect, useState } from 'react'
import { useToasts } from 'react-toast-notifications'
import modalStore from '../store/modalStore'
import {TabsStore, QueriesStore} from '../store/queriesStore'
import copy from 'copy-to-clipboard'
import { generateLink } from '../utils/common'

function ShareQueryForm() {
	const { addToast } = useToasts()
	const [name, setName] = useState('')
	const [queryLink, setQueryLink] = useState('')
	const [description, setDescription] = useState('')
	const { saveQuery, queryParams } = QueriesStore
	const { toggleShareQuery } = modalStore
	const { renameCurrentTab } = TabsStore

	useEffect(() => {
		copy(`http://localhost:3000/${queryLink}`)
	}, [queryLink])

	const shareHandler = (e) => {
		e.preventDefault()
		let params = queryParams
		if (name) {
			params.name = name
			if(description) params.description = description
			params.url = generateLink()
			setQueryLink(params.url)
			saveQuery(params)
			renameCurrentTab(name)
			toggleShareQuery()
		} else { addToast('Name is required', {appearance: 'error'}) }
	}

	return (
		<form onSubmit={shareHandler} className="modal modal__signup reset__form" >
			<p className="p-modal">Query name (required)</p>
			<input type="text" className="query__save"  
				value={name} onChange={e => setName(e.target.value)}
			/>  
			<p className="p-modal">Description (optional)</p>
			<input type="text" className="query__save" 
				value={description} onChange={e => setDescription(e.target.value)}
			/>  
			<button type="submit" className="button button_filled" >Get Query Link</button>
		</form>
	)
}

export default ShareQueryForm
