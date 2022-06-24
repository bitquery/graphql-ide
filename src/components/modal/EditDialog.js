import React from 'react'
import { useState } from 'react'
import { useRouteMatch } from 'react-router-dom'
import { useToasts } from 'react-toast-notifications'
import modalStore from '../../store/modalStore'
import { QueriesStore, TabsStore } from '../../store/queriesStore'
import copy from 'copy-to-clipboard'
import { deleteQuery } from '../../api/api'
import { useEffect } from 'react'
import ReactTooltip from 'react-tooltip'
import ConfirmationWindow from '../modal/ConfirmationWindow'
import { useRef } from 'react'
import { observer } from 'mobx-react-lite'
import { generateTags } from '../../utils/generateTags'
import useEventListener from '../../utils/useEventListener'

const EditDialog = observer(function EditDialog({active}) {
	const { addToast } = useToasts()
	const { url } = useRouteMatch()
	const { saveQuery, queryParams, currentQuery, sharedQueries,
		saveToggle, query, removeQuery } = QueriesStore
	const [name, setName] = useState(currentQuery.name||'')
	const [description, setDescription] = useState(currentQuery.description)
	const [shared, setShared] = useState(!!currentQuery.url)
	const [queryUrl, setQueryUrl] = useState(currentQuery.url)
	const [tags, setTags] = useState([])
	const [inputTagValue, setInputTagValue] = useState('')
	const { toggleEditDialog, toggleModal, toggleConfirmation } = modalStore
	const { renameCurrentTab } = TabsStore
	const nameInput = useRef('')
	const closeHandler = () => {
		toggleModal()
		toggleEditDialog()		
	}
	useEffect(() => {
		const autoTags = generateTags(currentQuery.query)
		autoTags && setTags(autoTags)
	}, [])
	const addOrDeleteTag = ({ key }) => {
		if (key === 'Enter' && inputTagValue) {
			setTags(prev => [...prev, inputTagValue])
			setInputTagValue('')
		} else if (key === 'Backspace' && !inputTagValue) {
			setTags(prev => prev.slice(0, -1))
		}
	}
	useEventListener('keydown', addOrDeleteTag)
	useEffect(() => {
		if (shared && !currentQuery.url) {
			setQueryUrl(name.trim().replaceAll(' ', '-').replace(/[^a-zA-Z0-9-_]/g, ''))
		}
		// eslint-disable-next-line 
	}, [shared])
	const handleCopy = () => {
		copy(`${window.location.protocol}//${window.location.host}${url.match(/^\/([^?\/]+)/)[0]}/${queryUrl}`)
		addToast('Link Copied to clipboard', {appearance: 'success'})
	}
	const queryNameHandler = e => {
		setName(e.target.value)
		setQueryUrl(e.target.value.trim().replaceAll(' ', '-').replace(/[^a-zA-Z0-9-_]/g, ''))
	}
	const saveHandler = async (e) => {
		e.preventDefault()
		const fixWrongUrl = (queries, url) => {
			const identicalUrl = queries.filter(query => query.url === url)
			console.log(url, identicalUrl)
			if (identicalUrl.length) {
				return fixWrongUrl(queries ,url+'1')
			} else {
				return url
			}
		}
		let params = currentQuery.layout ? {...currentQuery} : queryParams
		let data = null
		if (name) {
			params.name = name
			if (shared) {
				if (!params.url) {
					params.url = fixWrongUrl(sharedQueries, queryUrl)
				}
			} else {
				params.url = null
				setQueryUrl('')
			}
			if (description) params.description = description
			if (tags.length) params.tags = tags
			data = await saveQuery({...params, isDraggable: false, isResizable: false})
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
		const data = await deleteQuery(currentQuery.id, currentQuery.layout)
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
				<i className="handler handler__close fas fa-times" onClick={closeHandler}></i>
				<p style={{'marginBottom': '.5rem'}}>Query name (required)</p>
				<input type="text" className="query__save"  
					style={{'marginBottom': '1rem'}}
					ref={nameInput}
					value={name==='New Query' ? '' : name} onChange={queryNameHandler}
				/>  
				<p style={{'marginBottom': '.5rem'}}>Description (optional)</p>
				<textarea className="query__save" rows="4"
					style={{'marginBottom': '1rem'}}
					value={description} onChange={e => setDescription(e.target.value)} 
				/>
				{/* tags tags tags */}
				<div className="access-control__tags flex">
					{ tags.length ? tags.map(tag => <div className="access-control__tags__tag">{tag}</div>) : null }
					<input 
						type="text"
						className="access-control__tags__input"
						value={inputTagValue}
						onChange={e => setInputTagValue(e.target.value)}
					/>
				</div>
				{/* tags tags tags */}
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
						value={queryUrl && (`${window.location.protocol}://${window.location.host}${url.match(/^\/([^?\/]+)/)[0]}/${queryUrl}`||'')} 
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
})

export default EditDialog
