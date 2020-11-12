import React from 'react'
import { useState } from 'react'
import { useRouteMatch } from 'react-router-dom'
import { useToasts } from 'react-toast-notifications'
import modalStore from '../../store/modalStore'
import { QueriesStore, TabsStore } from '../../store/queriesStore'
import { generateLink } from '../../utils/common'
import copy from 'copy-to-clipboard'

function EditDialog({active}) {
	const { addToast } = useToasts()
	const { url } = useRouteMatch()
	const [name, setName] = useState('')
	const [description, setDescription] = useState('')
	const [shared, setShared] = useState(false)
	const [queryUrl, setQueryUrl] = useState('')
	const { saveQuery, queryParams } = QueriesStore
	const { toggleEditDialog, toggleModal } = modalStore
	const { renameCurrentTab } = TabsStore
	const closeHandler = () => {
		toggleModal()
		toggleEditDialog()		
	}
	const saveHandler = async (e) => {
		e.preventDefault()
		let params = queryParams
		let data = null
		if (name) {
			params.name = name
			if (shared) {
				params.url = generateLink()
				setQueryUrl(params.url)
			}
			if (description) params.description = description
			console.log(params)
			data = await saveQuery(params)
			if (data.status !== 400) {
				renameCurrentTab(name)
				addToast(data.msg, {appearance: 'success'})
			} else { 
				addToast(data.data.msg, {appearance: 'error'})
			}
		} else { addToast('Name is required', {appearance: 'error'}) }
	}

	return (
		<div className={'modal__form '+(!active && 'modal__form_hide')}>
			<div className="access-control__wrapper">
				<p>Query attributes and access control</p>
				<p style={{'marginBottom': 0}}>Query name (required)</p>
				<input type="text" className="query__save"  
					value={name} onChange={e => setName(e.target.value)}
				/>  
				<p style={{'marginBottom': 0}}>Description (optional)</p>
				<textarea className="query__save" rows="4"
					value={description} onChange={e => setDescription(e.target.value)} 
				/>
				<i className="handler handler__close fas fa-times" onClick={closeHandler}></i>
				<div className="access-control flex"
					style={{'justifyContent': 'space-evenly', 'width': '100%'}}
				>
					<div className="access-control__title">
						Access control:
					</div>
					<div className="access-control__controls" >
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
				<div className="input-group mb-3">
					<input type="text" className="form-control" value={queryUrl && `${window.location.protocol}://${window.location.host}${url}/${queryUrl}`} readOnly placeholder="Query link" aria-label="Query link" aria-describedby="basic-addon2"/>
					<div className="input-group-append">
						<button className="btn btn-outline-secondary" type="button" onClick={()=>copy(`${window.location.protocol}://${window.location.host}${url}/${queryUrl}`)}><i className="fas fa-link" /></button>
					</div>
				</div>
				<div className="buttons flex" style={{'justifyContent': 'space-evenly', 'width': '100%'}}>
					<button type="button" className="btn btn-secondary btn-sm" onClick={closeHandler}>Cancel</button>
					<button type="button" className="btn btn-primary btn-sm" onClick={saveHandler}>Save</button>
					<button type="button" className="btn btn-outline-danger btn-sm" >Delete</button>
				</div>	
			</div>
		</div>
	)
}

export default EditDialog
