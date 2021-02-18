import React from 'react'
import modalStore from '../../store/modalStore'
import { UserStore } from '../../store/queriesStore'
import { makekey } from '../../utils/common'
import { regenerateKey } from '../../api/api'

function ApiKeyModal({ active }) {
    const { user } = UserStore
	const { toggleModal, toggleApiKey } = modalStore
	const closeHandler = () => {
		toggleModal()
		toggleApiKey()		
	}
	return (
		<form className={'modal__form '+(!active && 'modal__form_hide')} >
			API key - {user?.key}
            <button className="button button_filled" onClick={()=>regenerateKey(makekey())}>Re-generate key</button>
			<i className="handler handler__close fas fa-times" onClick={closeHandler} />
		</form>
	)
}

export default ApiKeyModal
