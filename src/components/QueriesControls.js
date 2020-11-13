import React from 'react'
import copy from 'copy-to-clipboard'
import { useToasts } from 'react-toast-notifications'
import modalStore from '../store/modalStore'
import { QueriesStore, UserStore } from '../store/queriesStore'
import { useRouteMatch } from 'react-router-dom'
import { observer } from 'mobx-react-lite'

const QueriesControls = observer(({query, isSaved}) => {
	const { addToast } = useToasts()
	const { url } = useRouteMatch()
	const { saveQuery, queryParams, setQuery } = QueriesStore
	const { toggleModal, toggleEditDialog } = modalStore
	const { user } = UserStore

	const handleFork = (query, e) => {
		setQuery({...query, name: `Copy of ${query.name}`})
		e.stopPropagation()
	}
	const handleCopy = (queryurl) => {
		copy(`${window.location.protocol}://${window.location.host}${url}/${queryurl}`)
		addToast('Link copied to clipboard', {appearance: 'success'})
	}
	const handleSave = (query) => {
		if (user) {
			if (query.id === null) {
				toggleEditDialog()
				toggleModal()
			} else if (!query.saved) {
				saveQuery(queryParams)
			}
		} else {
			addToast('Login required to save or share queries', {appearance: 'error'})
		}
	}

	return (
		<div className="gallery__query__controls">
			<button type="button" 
				className="gallery__query__control btn btn-sm btn-outline-primary" 
				onClick={()=>handleCopy(query.url)}
				disabled={!query.url && true}
			>
				<i className="fas fa-link" />
			</button>
			<button type="button" 
				className="gallery__query__control btn btn-sm btn-outline-primary" 
				onClick={()=>handleSave(query)}
				disabled={isSaved ? true : false}
			>
				<i className="far fa-save" />
			</button>
			<button type="button" 
				className="gallery__query__control btn btn-sm btn-outline-primary"
				onClick={e=>handleFork(query, e)} 
			>
				<i className="fas fa-code-branch" />
			</button>
			<button type="button" 
				className="gallery__query__control btn btn-sm btn-outline-primary"
				onClick={()=>{toggleModal();toggleEditDialog()}}
				disabled={(user && query.account_id!==user.id)||(!user) && true}
			>
				<i className="fas fa-pencil-alt" />
			</button>
		</div>
	)
})

export default QueriesControls
