import React, { useEffect, useState } from 'react'
import WidgetSelect from './WidgetSelect'
import DisplayedData from './DisplayedData'
import { QueriesStore, TabsStore } from '../../../store/queriesStore'
import { observer } from 'mobx-react-lite'

const WidgetEditorControls = observer(
	function WidgetEditorControls({model, name, plugins, setDataSource, dataSource, number}) {
	const { currentQuery, defaultWidget } = QueriesStore
	const { toggleMode, jsonMode, codeMode, viewMode } = TabsStore
	const [dataWidgets, setDataWidgets] = useState([]) 
	const [dataIndexInModel, setDataIndexInModel] = useState(0)
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
			{(('widget_id' in currentQuery) && currentQuery.widget_id !== defaultWidget) && 
				<div className="btn-group btn-group-toggle" data-toggle="buttons">
					<label className={"btn btn-secondary topBar__button "+(viewMode && 'active')}>
						<input type="radio" name="options" 
							id="option1" autoComplete="off" 
							defaultChecked={true}
							onClick={()=>toggleMode('view')}
						/> View
					</label>
					<label className={"btn btn-secondary topBar__button "+(jsonMode && 'active')}>
						<input type="radio" name="options" 
							id="option2" autoComplete="off" 
							defaultChecked={false}
							onClick={()=>toggleMode('json')}
						/> JSON
					</label>
					<label className={"btn btn-secondary topBar__button "+(codeMode && 'active')}>
						<input type="radio" name="options" 
							id="option3" autoComplete="off"
							defaultChecked={false}
							onClick={()=>toggleMode('code')}
						/> JS
					</label>
				</div>}
		</nav>
	)
})

export default WidgetEditorControls
