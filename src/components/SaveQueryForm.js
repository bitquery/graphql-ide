import React, { useEffect, useState } from 'react'
import { useToasts } from 'react-toast-notifications'
import modalStore from '../store/modalStore'
import queriesStore from '../store/queriesStore'
import tabsStore from '../store/tabsStore'

function SaveQueryForm({ user }) {
	const { addToast } = useToasts()
	const [name, setName] = useState('')
	const [description, setDescription] = useState('')
	const { currentQuery, saveQuery, currentVariables } = queriesStore
	const { toggleSaveQuery } = modalStore
	const { renameCurrentTab } = tabsStore
	const [params, setParams] = useState({})

	useEffect(() => {
		user &&
			setParams({
				account_id: user.id,
				query: currentQuery,
				arguments: currentVariables,
				name: name,
				description: description || null,
				url: null
			})
	}, [user, name, description, currentVariables, currentQuery])
	const saveHandler = () => {
		if (name) {
			saveQuery(params)
			toggleSaveQuery()
			renameCurrentTab(name)
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
