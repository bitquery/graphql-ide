import React from 'react'
import copy from 'copy-to-clipboard'
import { useToasts } from 'react-toast-notifications'
import modalStore from '../store/modalStore'
import { QueriesStore, UserStore } from '../store/queriesStore'
import { useRouteMatch } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import ReactTooltip from 'react-tooltip'

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
			<ReactTooltip place="top"/>
			<span data-tip={query.url ? 'Get query link' : 'Query is private'}>
				<button type="button" 
					className="gallery__query__control btn btn-sm btn-outline-primary" 
					onClick={()=>handleCopy(query.url)}
					disabled={!query.url && true}
				>
					<i className="fas fa-link" />
				</button>
			</span>
			<span data-tip={!user ? 'You must login or register to save query' 
				: isSaved ? 'Query does not modified yet' : 'Save query'}
			>
				<button type="button" 
					className="gallery__query__control btn btn-sm btn-outline-primary" 
					onClick={()=>handleSave(query)}
					disabled={isSaved ? true : false}
				>
					<i className="far fa-save" />
				</button>
			</span>
			<span data-tip={!user ? 'You must login or register to fork query' : 'Fork query'}>
				<button type="button" 
					className="gallery__query__control btn btn-sm btn-outline-primary"
					onClick={e=>handleFork(query, e)} 
					disabled={user ? false : true}
				>
					<i className="fas fa-code-branch" />
				</button>
			</span>
			<span data-tip={(user && query.account_id!==user.id) ? 'Query does not belongs to you' 
				: !user ? 'You must login or register to interact with query' 
				: 'Edit query attributes and sharing'}
			>
				<button type="button" 
					className="gallery__query__control btn btn-sm btn-outline-primary"
					onClick={()=>{toggleModal();toggleEditDialog()}}
					disabled={(user && query.account_id!==user.id)||(!user) && true}
				>
					<i className="fas fa-pencil-alt" />
				</button>
			</span>
		</div>
	)
})

export default QueriesControls
