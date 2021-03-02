import React, { useEffect, useState } from 'react'
import WidgetSelect from './bitqueditor/components/WidgetSelect'
import DisplayedData from './bitqueditor/components/DisplayedData'
import { observer } from 'mobx-react-lite'
import { QueriesStore, TabsStore } from '../store/queriesStore'

const WidgetEditorControls = observer(
	function WidgetEditorControls({model, name, plugins, setDataSource, dataSource, number}) {
	const [dataWidgets, setDataWidgets] = useState([]) 
	const [dataIndexInModel, setDataIndexInModel] = useState(0)
	const { updateQuery } = QueriesStore
	const { index } = TabsStore
	useEffect(() => {
		let info = []
		let insert = null
		Object.keys(model).forEach((node, i) => {
			plugins.forEach(plugin => { 
				insert = plugin.supportsModel({[node]: model[node]}) ? true : false
				info.length > i ? info[i].push(insert) : info.push([insert])
			})
		})
		if (JSON.stringify(dataWidgets) !== JSON.stringify(info)) {
			setDataWidgets(info)
		}
		console.log(info)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [JSON.stringify(model)])
	const generalJson = () => {
		console.log(model)
		updateQuery({
			displayed_data: Object.keys(model).filter(key => !key.includes('.'))[0],
			widget_id: plugins[0].id
		}, index)
	}
	return (
		<nav className="navbar navbar-expand-lg navbar-light bg-light">
			<a className="navbar-brand" href="# ">Display</a>
			<div className="collapse navbar-collapse" id="navbarSupportedContent">
				<ul className="navbar-nav mr-auto">
					<DisplayedData 
						model={model}
						number={number}
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
			{dataSource?.displayed_data &&
				<button className="topBar__button" onClick={generalJson}>General JSON</button>}
		</nav>
	)
})

export default WidgetEditorControls
