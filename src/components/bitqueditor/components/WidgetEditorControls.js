import React, { useEffect, useState } from 'react'
import WidgetSelect from './WidgetSelect'
import DisplayedData from './DisplayedData'
import ResponseDataType from './ResponseDataType'
import { QueriesStore, TabsStore } from '../../../store/queriesStore'
import { observer } from 'mobx-react-lite'
import { getWidgetConfig } from '../../../api/api'

const WidgetEditorControls = observer(
	function WidgetEditorControls({model, name, plugins, setDataSource, dataSource, number}) {
	const { currentQuery, defaultWidget } = QueriesStore
	const { toggleMode, jsonMode, codeMode, viewMode } = TabsStore
	const [dataWidgets, setDataWidgets] = useState([]) 
	const [dataIndexInModel, setDataIndexInModel] = useState(0)
	useEffect(() => {
		const gwi = async () => {
			const searchParams = new URL(document.location).searchParams
			const configID = searchParams.get('config') ? searchParams.get('config') : null
			if (configID) {
				
				let configString = await getWidgetConfig(configID)
				const config = JSON.parse(configString.data.data)
				console.log(config)
				for (let i=0; i<config.length-1; i++) {
					for (let functionName in config[i]) {
						window[functionName] = eval(`(${config[i][functionName]})`)
					}
				}
				const Widget = eval(`(${config.at(-1)[Object.keys(config.at(-1))[0]]})`)
				const example = document.createElement('div')
				const widgetInstance = new Widget(example, currentQuery.query)
				
				console.log(widgetInstance.onData)

			}
		}
		gwi()
	}, [])
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
		// eslint-disable-next-line 
	}, [JSON.stringify(model)])

	return (
		<nav className="navbar navbar-expand-lg navbar-light bg-light">
			{<ResponseDataType 
				dataSource={dataSource}
				setDataSource={setDataSource}
			/>}
			{<DisplayedData 
				model={model}
				number={number}
				dataWidgets={dataWidgets}
				setDataIndexInModel={setDataIndexInModel}
				plugins={plugins}
				dataSource={dataSource}
				setDataSource={setDataSource}
			/>}
			{<WidgetSelect 
				name={name}
				dataWidgets={dataWidgets}
				dataIndexInModel={dataIndexInModel}
				plugins={plugins} 
			/>}
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
