import React, { useEffect, useState } from 'react'
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"
import Loader from "react-loader-spinner"

function WidgetSelect({value, model, setValue, plugins}) {
	const [supportedCharts, setSupportedCharts] = useState([])
	useEffect(() => {
		setSupportedCharts([])
		if (model) {
			let typesList = Object.keys(model).map(node => model[node])
			plugins.forEach(plugin => {
				plugin.supportsModel(typesList) && setSupportedCharts(prev => [...prev, plugin.name])
			})
		}
	}, [JSON.stringify(model), value])
	if (!Object.keys(model).length) return (
		<div className="custom-select">
			<Loader
				type="Oval"
				color="#3d77b6"
				height={25}
				width={25}
			/>
		</div>
	)
	return (
			<select className="custom-select" value={value} onChange={e=>setValue(e.target.value)}>
				{ supportedCharts.map((chart, i)=><option key={i} value={plugins[i].id}>{chart}</option>) }
			</select>
	)
}

export default WidgetSelect
