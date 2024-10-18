import React from 'react'
import modalStore from '../../store/modalStore'
import { UserStore } from '../../store/queriesStore'
import { makekey } from '../../utils/common'
import copy from 'copy-to-clipboard'
import { toast } from 'react-toastify'
import { observer } from 'mobx-react-lite'
import { Button, Form, Modal } from 'react-bootstrap'
import ConfirmationWindow from './ConfirmationWindow'

const ApiKeyModal = observer(function ApiKeyModal({ active }) {
    const { user, regenKey } = UserStore
	const { toggleModal, toggleApiKey, toggleConfirmation } = modalStore
	const closeHandler = e => {
		e.preventDefault()
		toggleModal()
		toggleApiKey()		
	}
	const handleCopy = () => {
		copy(user.key)
		toast('Copied to clipboard', {type: 'success'})
	}
	const confirm = () => {
		toggleConfirmation('You are re-creating API key. All applications that uses this key will not work, Are you sure?', 
		()=>regenKey(makekey()))
	}
	return active && (
		<>
			<ConfirmationWindow />
			<Modal.Header>
				API key must be included as HTTP header in every GraphQL request. Header name is X-API-KEY
			</Modal.Header>
			<Modal.Body>
				<Form>
					<div className="input-group mb-3 mt-3 flex-nowrap" style={{maxWidth: '500px'}}>
						<div className="input-group-prepend">
							<span className="input-group-text">API key</span>
						</div>
						<input readOnly type="text" className="form-control" value={user ? user.key : ''} aria-describedby="basic-addon2"/>
						<div className="input-group-append">
							<button className="btn btn-outline-secondary" type="button" onClick={handleCopy}>
								<i className="fas fa-copy" />
							</button>
						</div>
					</div>
					<p>Your graphql API endpoint URL - { user?.graphql_legacy_url }</p>
					<Form.Group className="text-center">
						<Button variant="primary" onClick={closeHandler}>Ok</Button>
					</Form.Group>
					<button type="button" style={{position: 'absolute', bottom: 0, left: 0}} className="btn btn-link" onClick={confirm}>Re-generate key</button>
				</Form>
			</Modal.Body>
		</>
	)
})

export default ApiKeyModal
