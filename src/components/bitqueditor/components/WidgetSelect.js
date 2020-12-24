import { observer } from 'mobx-react-lite'
import React, { useEffect, useState } from 'react'
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"
import { QueriesStore, TabsStore } from '../../../store/queriesStore'


const WidgetSelect = observer(function WidgetSelect({value, model, setValue, plugins}) {
	const { updateQuery } = QueriesStore
	const { index } = TabsStore
	const [supportedCharts, setSupportedCharts] = useState([])
	useEffect(() => {
		if (value && !supportedCharts.length) {
			let inx = plugins.map(pl => pl.id).indexOf(value)
			inx>=0 && setSupportedCharts([plugins[inx].name])
		} else { setSupportedCharts([]) }
		if (Object.keys(model).length) {
			let typesList = Object.keys(model).map(node => model[node])
			plugins.forEach(plugin => {
				plugin.supportsModel(typesList) && setSupportedCharts(prev => [...prev, plugin.name])
			})
		}
	}, [JSON.stringify(model)])
	if (!Object.keys(model).length && !value) return (
		<div className="custom-select">
			loading..
		</div>
	)
	return (
			<select className="custom-select" value={value} onChange={e=>updateQuery({widget_id: e.target.value}, index)}>
				{ supportedCharts.map((chart, i)=><option key={i} value={plugins[i].id}>{chart}</option>) }
			</select>
	)
})

export default WidgetSelect
