import React from 'react'
import WidgetSelect from './bitqueditor/components/WidgetSelect'
import DisplayedData from './bitqueditor/components/DisplayedData'
import { observer } from 'mobx-react-lite'

const WidgetEditorControls = observer(
	function WidgetEditorControls({model, name, plugins, setDataSource, dataSource}) {
	return (
		<nav className="navbar navbar-expand-lg navbar-light bg-light">
			<a className="navbar-brand" href="# ">Display</a>
			<div className="collapse navbar-collapse" id="navbarSupportedContent">
				<ul className="navbar-nav mr-auto">
					<DisplayedData 
						model={model}
						dataSource={dataSource}
						setDataSource={setDataSource}
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
					/>
				</ul>
			</div>
		</nav>
	)
})

export default WidgetEditorControls
