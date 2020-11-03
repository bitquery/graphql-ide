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
		let data = null
		if (name) {
			params.name = name
			if (description) params.description = description
			data = await saveQuery(params)
			if (data.status !== 400) {
				renameCurrentTab(name)
				addToast(data.msg, {appearance: 'success'})
			} else { 
				addToast(data.data.msg, {appearance: 'error'})
			}
			toggleSaveQuery()
		} else { addToast('Name is required', {appearance: 'error'}) }
	}

	return (
		<form onSubmit={saveHandler} className="modal__form " >
			<p className="p-modal">Query name (required)</p>
			<input type="text" className="query__save"  
				value={name} onChange={e => setName(e.target.value)}
			/>  
			<p className="p-modal">Description (optional)</p>
			<textarea className="query__save" rows="4"
				value={description} onChange={e => setDescription(e.target.value)} 
			/>
			<button type="submit" className="button button_filled" >Save</button>
			<button className="handler handler__close" onClick={toggleSaveQuery} />
		</form>
	)
}

export default SaveQueryForm
