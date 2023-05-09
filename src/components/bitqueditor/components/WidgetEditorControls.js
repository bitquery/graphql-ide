import React, { useEffect, useState } from 'react'
import WidgetSelect from './WidgetSelect'
import DisplayedData from './DisplayedData'
import ResponseDataType from './ResponseDataType'
import { QueriesStore, TabsStore } from '../../../store/queriesStore'
import { observer } from 'mobx-react-lite'
import { getWidgetConfig } from '../../../api/api'
import JsonWidget from './JsonWidget'
import ToolbarButton from './ToolbarButton'

const WidgetEditorControls = observer(
	function WidgetEditorControls({abortRequest, getResult, model, name, plugins, setDataSource, dataSource, number}) {
	const { currentQuery, defaultWidget, updateQuery, schema } = QueriesStore
	const { toggleMode, jsonMode, codeMode, viewMode, index } = TabsStore
	const [dataWidgets, setDataWidgets] = useState([]) 
	const [dataIndexInModel, setDataIndexInModel] = useState(0)
	/* useEffect(() => {
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
	}, []) */
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

	const onClick = widget_id => {
		updateQuery({ widget_id }, index)
		schema.length && abortRequest()
	}

	return <div className='d-flex p-2' style={{backgroundColor: '#f6f7f8'}}>
		<ToolbarButton
			title='JSON'
			onClick={() => onClick('json.widget')}
			style={{color: currentQuery.widget_id === 'json.widget' ? 'blue' : '#555'}}
		/>
		<ToolbarButton
			title='Widget'
			onClick={() => onClick('config.widget')}
			style={{color: currentQuery.widget_id === 'config.widget' ? 'blue' : '#555'}}
		/>
	</div>
})

export default WidgetEditorControls
