import React, { useState, useEffect, useRef } from 'react'
import { useHistory } from 'react-router-dom'
import { toast } from 'react-toastify'
import modalStore from '../../store/modalStore'
import { QueriesStore, TabsStore } from '../../store/queriesStore'
import { deleteQuery } from '../../api/api'
import ReactTooltip from 'react-tooltip'
import ConfirmationWindow from '../modal/ConfirmationWindow'
import { observer } from 'mobx-react-lite'
import { generateTags } from '../../utils/generateTags'
import useEventListener from '../../utils/useEventListener'
import { Modal, Form, Button } from 'react-bootstrap'

const EditDialog = observer(function EditDialog({active}) {
	const { saveQuery, queryParams, currentQuery,
		saveToggle, query, removeQuery, updateQuery } = QueriesStore
	const { index } = TabsStore
	const [name, setName] = useState(currentQuery.name || '')
	const [description, setDescription] = useState(currentQuery.description || '')
	const [shared, setShared] = useState(!!currentQuery.url || true)
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
	const history = useHistory()
	useEffect(() => {
		if (currentQuery.tags) {
			setTags(currentQuery.tags.split(','))
		} else {
			const autoTags = generateTags(currentQuery.query, currentQuery.variables)
			autoTags && setTags([...new Set(autoTags)])
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
	const queryNameHandler = e => {
		setName(e.target.value)
		setQueryUrl(e.target.value.trim().replaceAll(' ', '-').replace(/[^a-zA-Z0-9-_]/g, ''))
	}
	const saveHandler = async (e) => {
		e.preventDefault()
		let params = currentQuery.layout ? {...currentQuery} : queryParams
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
			if (tags.length) params.tags = tags
			data = await saveQuery({...params, isDraggable: false, isResizable: false})
			if (data.status !== 400) {
				renameCurrentTab(name)
				updateQuery({tags: tags.join(','), url: data.url}, index)
				data.msg && toast(<div id={data.id}>{data.msg}</div>, {type: 'success'})
				closeHandler()
			} else { 
				toast(data.data.msg, {type: 'error'})

			}
		} else { toast('Name is required', {type: 'error'}) }
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
		toast(data.data, {type: 'success'})
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
					<Form.Label htmlFor="queryName">Query name (required)</Form.Label>
					<Form.Control ref={nameInput} type="email"
						id="queryName" value={name === 'New Query' ? '' : name}
						onChange={queryNameHandler} 
					/>
				</Form.Group>
				<Form.Group>
					<Form.Label htmlFor="queryDescription">Description (optional)</Form.Label>
					<Form.Control as="textarea" rows={4}
						id="queryDescription"
						value={description}
						onChange={e => setDescription(e.target.value)} 
					/>
				</Form.Group>
				<div className="tags__list">
					{ tags.length ? tags.map(tag => 
						<div
							key={tag}
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
							value={inputTagValue || ''}
							onChange={e => setInputTagValue(e.target.value)}
						/>
				</div>
				<fieldset className="access-control flex"
					style={{'justifyContent': 'space-evenly', 'width': '100%'}}
				>
					<legend className="access-control__title">Access control:</legend>
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
				</fieldset>
				<Form.Group className="d-flex justify-content-between">
					<Button variant="secondary" onClick={closeHandler} >Cancel</Button>
					<span data-tip={!name ? 'Name is required' : ''} data-for="savequerybutton">
						<Button 
							variant="primary"
							style={{backgroundColor: '#002aff'}}
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
