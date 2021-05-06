import React from 'react'
import modalStore from '../../store/modalStore'
import { UserStore } from '../../store/queriesStore'
import { makekey } from '../../utils/common'
import copy from 'copy-to-clipboard'
import { useToasts } from 'react-toast-notifications'
import { observer } from 'mobx-react-lite'

const ApiKeyModal = observer(function ApiKeyModal({ active }) {
    const { user, regenKey } = UserStore
	const { addToast } = useToasts()
	const { toggleModal, toggleApiKey, toggleConfirmation } = modalStore
	const closeHandler = e => {
		e.preventDefault()
		toggleModal()
		toggleApiKey()		
	}
	const handleCopy = () => {
		copy(user.key)
		addToast('Copied to clipboard', {appearance: 'success'})
	}
	const confirm = () => {
		toggleConfirmation('You are re-creating API key. All applications that uses this key will not work, Are you sure?', 
		()=>regenKey(makekey()))
	}
	return (
		<div className={'modal__form '+(!active && 'modal__form_hide')} >
			
			<p className="mb-0 mt-3">API key must be included as HTTP header in every GraphQL request. Header name is X-API-KEY</p>
			<div className="input-group mb-3 mt-3 flex-nowrap" style={{maxWidth: '500px'}}>
				<div className="input-group-prepend">
    				<span className="input-group-text">API key</span>
				</div>
				<input readOnly type="text" className="form-control" value={user ? user.key: ''} aria-describedby="basic-addon2"/>
				<div className="input-group-append">
					<button className="btn btn-outline-secondary" type="button" onClick={handleCopy}>
						<i className="fas fa-copy" />
					</button>
				</div>
			</div>
			<p>Your graphql API endpoint URL - https://graphql.bitquery.io</p>
			<button className="button button_filled m-0" onClick={closeHandler}>Ok</button>
			<button type="button" style={{position: 'absolute', bottom: 0, left: 0}} className="btn btn-link" onClick={confirm}>Re-generate key</button>
			<i className="handler handler__close fas fa-times" onClick={closeHandler} />
</div>
	)
})

export default ApiKeyModal
