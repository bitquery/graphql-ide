import React, { useEffect, useState } from 'react'

function WidgetSelect({value, model, setValue, plugins}) {
	const [supportedCharts, setSupportedCharts] = useState([])
	useEffect(() => {
		setSupportedCharts([])
		if (model) {
			let typesList = Object.keys(model).map(node => model[node])
			plugins.forEach(plugin => {
				plugin.supportsModel(typesList) && setSupportedCharts(old => [...old, plugin.name])
			})
		}
	}, [model])
	useEffect(() => {
		if(supportedCharts.length === 1) setValue(supportedCharts[0])
	}, [supportedCharts.length])
	return (
		<select className="custom-select" value={value} onChange={e=>setValue(e.target.value)}>
			{
				supportedCharts.map((chart, i)=><option key={i} value={plugins[i].id}>{chart}</option>)
			}
		</select>
	)
}

export default WidgetSelect
