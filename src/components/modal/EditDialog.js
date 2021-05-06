import React from 'react'
import { useState } from 'react'
import { useRouteMatch } from 'react-router-dom'
import { useToasts } from 'react-toast-notifications'
import modalStore from '../../store/modalStore'
import { QueriesStore, TabsStore } from '../../store/queriesStore'
import { generateLink } from '../../utils/common'
import copy from 'copy-to-clipboard'
import { deleteQuery } from '../../api/api'
import { useEffect } from 'react'
import ReactTooltip from 'react-tooltip'
import ConfirmationWindow from '../modal/ConfirmationWindow'
import { useRef } from 'react'

function EditDialog({active}) {
	const { addToast } = useToasts()
	const { url } = useRouteMatch()
	const { saveQuery, queryParams, currentQuery, 
		saveToggle, query, removeQuery } = QueriesStore
	const [name, setName] = useState(currentQuery.name||'')
	const [description, setDescription] = useState(currentQuery.description)
	const [shared, setShared] = useState(!!currentQuery.url)
	const [queryUrl, setQueryUrl] = useState(currentQuery.url)
	const { toggleEditDialog, toggleModal, toggleConfirmation } = modalStore
	const { renameCurrentTab } = TabsStore
	const nameInput = useRef('')
	const closeHandler = () => {
		toggleModal()
		toggleEditDialog()		
	}
	useEffect(() => {
		if (shared && !currentQuery.url) {
			setQueryUrl(generateLink())
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [shared])
	const handleCopy = () => {
		copy(`${window.location.protocol}//${window.location.host}${url}/${queryUrl}`)
		addToast('Link Copied to clipboard', {appearance: 'success'})
	}
	const saveHandler = async (e) => {
		e.preventDefault()
		// let params = queryParams
		let params = {...currentQuery}
		let data = null
		if (name) {
			params.name = name
			if (shared) {
				if (!params.url) {
					params.url = queryUrl
				}
			} else {
				params.url = null
				setQueryUrl('')
			}
			if (description) params.description = description
			data = await saveQuery(params)
			if (data.status !== 400) {
				renameCurrentTab(name)
				data.msg && addToast(data.msg, {appearance: 'success'})
				closeHandler()
			} else { 
				addToast(data.data.msg, {appearance: 'error'})
			}
		} else { addToast('Name is required', {appearance: 'error'}) }
	}
	const confirm = () => {
		toggleConfirmation('Are you sure you want to delete this query?', 
		deleteHandler)
	}
	const deleteHandler = async () => {
		const data = await deleteQuery(currentQuery.id)
		saveToggle()
		closeHandler()
		let id = query.map(query=>query.id).indexOf(currentQuery.id)
		removeQuery(id)
		addToast(data.data, {appearance: 'success'})
	}

	return (
		<div className={'modal__form '+(!active && 'modal__form_hide')}>
			
			<ConfirmationWindow 
				message={'Are you sure you want to delete this query?'} 
				action={deleteHandler}
			/>
			<p>Query attributes and access control</p>
			<div className="access-control__wrapper">
				<p style={{'marginBottom': '.5rem'}}>Query name (required)</p>
				<input type="text" className="query__save"  
					style={{'marginBottom': '1rem'}}
					ref={nameInput}
					value={name==='New Query' ? '' : name} onChange={e => setName(e.target.value)}
				/>  
				<p style={{'marginBottom': '.5rem'}}>Description (optional)</p>
				<textarea className="query__save" rows="4"
					style={{'marginBottom': '1rem'}}
					value={description} onChange={e => setDescription(e.target.value)} 
				/>
				<i className="handler handler__close fas fa-times" onClick={closeHandler}></i>
				<div className="access-control flex"
					style={{'justifyContent': 'space-evenly', 'width': '100%'}}
				>
					<div className="access-control__title">
						Access control:
					</div>
					<div className="access-control__controls" style={{'marginBottom': '1rem'}}>
						<div className="form-check">
							<input className="form-check-input" type="radio" id="exampleRadios1" 
								checked={!shared} onChange={()=>setShared(prev=>!prev)} />
							<label className="form-check-label" htmlFor="exampleRadios1">
								Private
							</label>
						</div>
						<div className="form-check">
							<input className="form-check-input" type="radio" id="exampleRadios2" 
								checked={shared} onChange={()=>setShared(prev=>!prev)} />
							<label className="form-check-label" htmlFor="exampleRadios2">
								Shared to everyone
							</label>
						</div>
					</div>
				</div>
				{shared && <div className="input-group mb-3">
					<input type="text" className="form-control query-link" 
						value={queryUrl && (`${window.location.protocol}://${window.location.host}${url}/${queryUrl}`||'')} 
						readOnly 
						placeholder="Query link" aria-label="Query link" aria-describedby="basic-addon2"
					/>
					<div className="input-group-append">
						<button className="btn btn-outline-secondary"
							data-tip="Get query link"
							data-for="getlinkbutton"
							type="button" 
							onClick={handleCopy}
						>
								<i className="fas fa-link" />
						</button>
						<ReactTooltip id="getlinkbutton" place="top"/>
					</div>
				</div>}
				<div className="buttons flex" style={{'justifyContent': 'space-between', 'width': '100%'}}>
					<button type="button" className="btn btn-secondary btn-sm" onClick={closeHandler}>
						Cancel
					</button>
					<span data-tip={!name ? 'Name is required' : ''} data-for="savequerybutton">
						<button  type="button" className="btn btn-primary btn-sm" 
							onClick={saveHandler} 
							disabled={(!nameInput.current.value && !name) || name==='New Query' ? true : false}
						>
							Save
						</button>
					</span>
					<ReactTooltip id="savequerybutton" place="top"/>
					<button type="button" className="btn btn-outline-danger btn-sm" 
						onClick={confirm} disabled={!currentQuery.id ? true : false} 
					>
						Delete
					</button>
				</div>	
			</div>
		</div>
	)
}

export default EditDialog
