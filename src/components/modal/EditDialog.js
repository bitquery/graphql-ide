import React, { useState, useEffect, useRef } from 'react'
import { useRouteMatch } from 'react-router-dom'
import { useToasts } from 'react-toast-notifications'
import modalStore from '../../store/modalStore'
import { QueriesStore, TabsStore } from '../../store/queriesStore'
import copy from 'copy-to-clipboard'
import { deleteQuery, checkUrl } from '../../api/api'
import ReactTooltip from 'react-tooltip'
import ConfirmationWindow from '../modal/ConfirmationWindow'
import { observer } from 'mobx-react-lite'
import { generateTags } from '../../utils/generateTags'
import useEventListener from '../../utils/useEventListener'
import { Modal, Form, Button } from 'react-bootstrap'

const EditDialog = observer(function EditDialog({active}) {
	const { addToast } = useToasts()
	const { url } = useRouteMatch()
	const { saveQuery, queryParams, currentQuery, sharedQueries,
		saveToggle, query, removeQuery, updateQuery } = QueriesStore
	const { index } = TabsStore
	const [name, setName] = useState(currentQuery.name||'')
	const [description, setDescription] = useState(currentQuery.description)
	const [shared, setShared] = useState(!!currentQuery.url)
	const [queryUrl, setQueryUrl] = useState(currentQuery.url)
	const [tags, setTags] = useState([])
	const [inputTagValue, setInputTagValue] = useState('')
	const { toggleEditDialog, toggleModal, toggleConfirmation } = modalStore
	const { renameCurrentTab } = TabsStore
	const nameInput = useRef('')
	const tagsInput = useRef(null)
	const closeHandler = () => {
		toggleModal()
		toggleEditDialog()		
	}
	useEffect(() => {
		if (currentQuery.saved) {
			setTags(currentQuery.tags.split(','))
		} else {
			const autoTags = generateTags(currentQuery.query)
			autoTags && setTags(autoTags)
		}
	}, [])
	const addOrDeleteTag = ({ key }) => {
		const isCurrentlyFocused = element => element === document.activeElement
		if (isCurrentlyFocused(tagsInput.current)) {
			if (key === 'Enter' && inputTagValue) {
				setTags(prev => [...new Set( [ ...prev, inputTagValue ] )])
				setInputTagValue('')
			} else if (key === 'Backspace' && !inputTagValue) {
				setTags(prev => prev.slice(0, -1))
			}
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
		console.log(url)
		copy(`${window.location.protocol}//${window.location.host}${url.match(/^\/([^?\/]+)/)[0]}/${queryUrl}`)
		addToast('Link Copied to clipboard', {appearance: 'success'})
	}
	const queryNameHandler = e => {
		setName(e.target.value)
		setQueryUrl(e.target.value.trim().replaceAll(' ', '-').replace(/[^a-zA-Z0-9-_]/g, ''))
	}
	const saveHandler = async (e) => {
		e.preventDefault()
		const fixWrongUrl = async (url) => {
			const { status } = await checkUrl(url)
			if (status === 200) {
				return await fixWrongUrl(`${url}_1`)
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
					params.url = await fixWrongUrl(queryUrl)
				}
			} else {
				params.url = null
				setQueryUrl('')
			}
			if (description) params.description = description
			if (tags.length) params.tags = tags
			if (params.endpoint_url !== 'https://graphql.bitquery.io') {
				addToast('You can not save query with non-https://graphql.bitquery.io URL', {appearance: 'error'})
			}
			data = await saveQuery({...params, isDraggable: false, isResizable: false})
			if (data.status !== 400) {
				renameCurrentTab(name)
				updateQuery({tags: tags.join(',')}, index)
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

	const deleteTag = tag => {
		setTags(prev => prev.filter(prevTag => prevTag !== tag))
	}

	return active && (
		<>
			<ConfirmationWindow 
				message={'Are you sure you want to delete this query?'} 
				action={deleteHandler}
			/>
			<Modal.Header>
				<Modal.Title> Query attributes and access control </Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Form.Group>
					<Form.Label>Query name (required)</Form.Label>
					<Form.Control ref={nameInput} type="email" 
						value={name==='New Query' ? '' : name}
						onChange={queryNameHandler} 
					/>
				</Form.Group>
				<Form.Group>
					<Form.Label>Description (optional)</Form.Label>
					<Form.Control as="textarea" rows={4}
						value={description}
						onChange={e => setDescription(e.target.value)} 
					/>
				</Form.Group>
				<div className="tags__list">
					{ tags.length ? tags.map(tag => 
						<div 
							className="tags__tag"
							onClick={() => deleteTag(tag)}
						>
							#{tag}
						</div>) : null }
						<Form.Control
							ref={tagsInput}
							type="text"
							placeholder='Add tags here'
							className="tags__input"
							value={inputTagValue}
							onChange={e => setInputTagValue(e.target.value)}
						/>
				</div>
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
				<Form.Group className="d-flex justify-content-between">
					<Button variant="secondary" onClick={closeHandler} >Cancel</Button>
					<span data-tip={!name ? 'Name is required' : ''} data-for="savequerybutton">
						<Button 
							variant="primary"
							onClick={saveHandler}
							disabled={(!nameInput.current.value && !name) || name==='New Query' ? true : false}
						>Save</Button>
					</span>
					<ReactTooltip id="savequerybutton" place="top"/>
					<Button variant="outline-danger" onClick={confirm} disabled={!currentQuery.id ? true : false} >Delete</Button>
				</Form.Group>
			</Modal.Body>
		</>
	)
})

export default EditDialog
