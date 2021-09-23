import { observer } from 'mobx-react-lite'
import React, { useState } from 'react'
import modalStore from '../../store/modalStore'
import { QueriesStore, TabsStore } from '../../store/queriesStore'

const DashbaordSettings = observer(function DashbaordSettings({active}) {
	const { updateQuery, currentQuery } = QueriesStore
	const [ prejs, setPreJS ] = useState(currentQuery.javascript?.preprocessing || '')
	const [ postjs, setPostJS ] = useState(currentQuery.javascript?.postprocessing || '')
	const { toggleModal, toggleDashboardSettings } = modalStore
	const { index } = TabsStore
	const closeHandler = e => {
		e.preventDefault()
		toggleModal()
		toggleDashboardSettings()		
	}
	const saveSettings = e => {
		const javascript = {}
		if (prejs) javascript.preprocessing = prejs
		if (postjs) javascript.postprocessing = postjs
		updateQuery({ javascript }, index)
		closeHandler(e)
	}
	return (
		<div className={'modal__form '+(!active && 'modal__form_hide')}>
			<div className="form-group flex flex-col align-items-center w-100">
				<label htmlFor="prejs">Preprocessing</label>
				<textarea className="query__save mb-3" id="prejs" rows="5" value={prejs} onChange={(e) => setPreJS(e.target.value)}></textarea>
				<label htmlFor="postjs">Postprocessing</label>
				<textarea className="query__save mb-3" id="postjs" rows="5" value={postjs} onChange={(e) => setPostJS(e.target.value)}></textarea>
				<button className="button button_filled m-0" onClick={saveSettings}>Done</button>
			</div>
			<i className="handler handler__close fas fa-times" onClick={closeHandler} />
		</div>
	)
})

export default DashbaordSettings
