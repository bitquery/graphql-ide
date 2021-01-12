import React, { useEffect, useState } from 'react'
import WidgetSelect from './bitqueditor/components/WidgetSelect'
import DisplayedData from './bitqueditor/components/DisplayedData'
import { observer } from 'mobx-react-lite'

const WidgetEditorControls = observer(
	function WidgetEditorControls({model, name, plugins, setDataSource, dataSource}) {
	const [dataWidgets, setDataWidgets] = useState() 
	const [dataIndexInModel, setDataIndexInModel] = useState(0)
	useEffect(() => {
		let info = []
		let insert = null
		Object.keys(model).forEach((node, i) => {
			plugins.forEach(plugin => { 
				insert = plugin.supportsModel(model[node]) ?  true : false
				info.length > i ? info[i].push(insert) : info.push([insert])
			})
		})
		if (info.length) info[0][0] = true
		setDataWidgets(info)
		console.log(info)
	}, [JSON.stringify(model)])
	return (
		<nav className="navbar navbar-expand-lg navbar-light bg-light">
			<a className="navbar-brand" href="# ">Display</a>
			<div className="collapse navbar-collapse" id="navbarSupportedContent">
				<ul className="navbar-nav mr-auto">
					<DisplayedData 
						model={model}
						dataWidgets={dataWidgets}
						setDataIndexInModel={setDataIndexInModel}
						plugins={plugins}
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
						dataWidgets={dataWidgets}
						dataIndexInModel={dataIndexInModel}
						plugins={plugins} 
					/>
				</ul>
			</div>
		</nav>
	)
})

export default WidgetEditorControls
