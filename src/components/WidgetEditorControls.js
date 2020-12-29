import React from 'react'
import WidgetSelect from './bitqueditor/components/WidgetSelect'
import DisplayedData from './bitqueditor/components/DisplayedData'
import { QueriesStore } from '../store/queriesStore'
import { observer } from 'mobx-react-lite'

const WidgetEditorControls = observer(
	function WidgetEditorControls({model, name, setValue, plugins}) {
	const { currentQuery } = QueriesStore
	return (
		<nav className="navbar navbar-expand-lg navbar-light bg-light">
			<a className="navbar-brand" href="# ">Display</a>
			<div className="collapse navbar-collapse" id="navbarSupportedContent">
				<ul className="navbar-nav mr-auto">
					<DisplayedData 
						model={model}
						value={currentQuery.displayed_data || ''}
					/>
					
				</ul>
			</div>
			<a className="navbar-brand" href="# ">Using</a>
			<div className="collapse navbar-collapse" id="navbarSupportedContent">
				<ul className="navbar-nav mr-auto">
					<WidgetSelect 
						name={name}
						plugins={plugins} 
						model={model} 
						value={currentQuery.widget_id || ''} 
						setValue={setValue} 
					/>
				</ul>
			</div>
		</nav>
	)
})

export default WidgetEditorControls
