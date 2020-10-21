import React, { useEffect, useState } from 'react'
import { useToasts } from 'react-toast-notifications'
import modalStore from '../store/modalStore'
import queriesStore from '../store/queriesStore'
import tabsStore from '../store/tabsStore'
import copy from 'copy-to-clipboard'
import { generateLink } from '../utils/common'

function ShareQueryForm({ user }) {
	const { addToast } = useToasts()
	const [name, setName] = useState('')
	const [queryLink, setQueryLink] = useState('')
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
		user && params.url && saveQuery(params)
	}, [params.url])
	function shareHandler(e) {
		e.preventDefault()
		if (name) {
			setQueryLink(generateLink())
			toggleSaveQuery()
			renameCurrentTab(name)
			addToast('Query link copied to clipboard', {appearance: 'success'})
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
