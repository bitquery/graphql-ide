import React, { useState } from 'react'
import { useToasts } from 'react-toast-notifications'
import modalStore from '../../store/modalStore'
import {TabsStore, QueriesStore} from '../../store/queriesStore'

function SaveQueryForm() {
	const { addToast } = useToasts()
	const [name, setName] = useState('')
	const [description, setDescription] = useState('')
	const { saveQuery, queryParams } = QueriesStore
	const { toggleSaveQuery } = modalStore
	const { renameCurrentTab } = TabsStore

	const saveHandler = async (e) => {
		e.preventDefault()
		let params = queryParams
		if (name) {
			params.name = name
			if (description) params.description = description
			let status = await saveQuery(params)
			if (status !== 400) renameCurrentTab(name)
			toggleSaveQuery()
		} else { addToast('Name is required', {appearance: 'error'}) }
	}

	return (
		<form onSubmit={saveHandler} className="modal modal__signup reset__form" >
			<p className="p-modal">Query name (required)</p>
			<input type="text" className="query__save"  
				value={name} onChange={e => setName(e.target.value)}
			/>  
			<p className="p-modal">Description (optional)</p>
			<input type="text" className="query__save" 
				value={description} onChange={e => setDescription(e.target.value)}
			/>  
			<button type="submit" className="button button_filled" >Save</button>
		</form>
	)
}

export default SaveQueryForm
