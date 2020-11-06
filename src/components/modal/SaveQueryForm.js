import React, { useState } from 'react'
import { useToasts } from 'react-toast-notifications'
import modalStore from '../../store/modalStore'
import {TabsStore, QueriesStore} from '../../store/queriesStore'

function SaveQueryForm({active}) {
	const { addToast } = useToasts()
	const [name, setName] = useState('')
	const [description, setDescription] = useState('')
	const { saveQuery, queryParams } = QueriesStore
	const { toggleSaveQuery, toggleModal } = modalStore
	const { renameCurrentTab } = TabsStore
	const closeHandler = () => {
		toggleModal()
		toggleSaveQuery()		
	}
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
			toggleModal()
			toggleSaveQuery()
		} else { addToast('Name is required', {appearance: 'error'}) }
	}

	return (
		<form onSubmit={saveHandler} className={'modal__form '+(!active && 'modal__form_hide')} >
			<p className="p-modal">Query name (required)</p>
			<input type="text" className="query__save"  
				value={name} onChange={e => setName(e.target.value)}
			/>  
			<p className="p-modal">Description (optional)</p>
			<textarea className="query__save" rows="4"
				value={description} onChange={e => setDescription(e.target.value)} 
			/>
			<button type="submit" className="button button_filled" >Save</button>
			<i className="handler handler__close fas fa-times" onClick={closeHandler}></i>
		</form>
	)
}

export default SaveQueryForm
