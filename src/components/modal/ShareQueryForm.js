import React, { useEffect, useState } from 'react'
import { useToasts } from 'react-toast-notifications'
import modalStore from '../../store/modalStore'
import {TabsStore, QueriesStore} from '../../store/queriesStore'
import copy from 'copy-to-clipboard'
import { generateLink } from '../../utils/common'
import { useHistory, useRouteMatch } from 'react-router-dom'

function ShareQueryForm() {
	const { addToast } = useToasts()
	const history = useHistory()
	const { url } = useRouteMatch()
	const [name, setName] = useState('')
	const [queryLink, setQueryLink] = useState('')
	const [description, setDescription] = useState('')
	const { saveQuery, queryParams, updateQuery } = QueriesStore
	const { toggleShareQuery } = modalStore
	const { renameCurrentTab } = TabsStore

	useEffect(() => {
		copy(`${window.location.protocol}://${window.location.host}${url}/${queryLink}`)
	}, [queryLink])

	const shareHandler = async (e) => {
		e.preventDefault()
		let params = queryParams
		let data = null
		if (name) {
			params.name = name
			if(description) params.description = description
			params.url = generateLink()
			data = await saveQuery(params)
			if (data.status !== 400) {
				setQueryLink(params.url)
				renameCurrentTab(name)
				history.push(`${url}/${params.url}`)
				addToast(data.msg, {appearance: 'success'})
			} else {
				addToast(data.data.msg, {appearance: 'error'})
			}
			toggleShareQuery()
		} else { addToast('Name is required', {appearance: 'error'}) }
	}

	return (
		<form onSubmit={shareHandler} className="modal__form" >
			<p className="p-modal">Query name (required)</p>
			<input type="text" className="query__save"  
				value={name} onChange={e => setName(e.target.value)}
			/>  
			<p className="p-modal">Description (optional)</p>
			<textarea className="query__save" rows="4"
				value={description} onChange={e => setDescription(e.target.value)} 
			/>
			<button type="submit" className="button button_filled" >Get Query Link</button>
			<i className="handler handler__close fas fa-times" onClick={toggleShareQuery} />

		</form>
	)
}

export default ShareQueryForm
