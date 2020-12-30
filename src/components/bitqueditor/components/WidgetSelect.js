import { observer } from 'mobx-react-lite'
import React, { useEffect, useState } from 'react'
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"
import { QueriesStore, TabsStore } from '../../../store/queriesStore'


const WidgetSelect = observer(function WidgetSelect({model, plugins, name}) {
	const { updateQuery, currentQuery } = QueriesStore
	const { index } = TabsStore
	const [supportedCharts, setSupportedCharts] = useState([])
	useEffect(() => {
		if (currentQuery.widget_id && !supportedCharts.length) {
			let inx = plugins.map(pl => pl.id).indexOf(currentQuery.widget_id)
			inx>=0 && setSupportedCharts([plugins[inx].name])
		} else if (supportedCharts.length) { setSupportedCharts([]) }
		if (Object.keys(model).length) {
			let typesList = Object.keys(model).map(node => model[node])
			plugins.forEach(plugin => {
				plugin.supportsModel(typesList) && setSupportedCharts(prev => [...prev, plugin.name])
			})
		}
	}, [JSON.stringify(model)])

	return (
			
			<li className="nav-item dropdown">
				<a 	className="nav-link dropdown-toggle" 
					id="navbarDropdown" 
					role="button" 
					data-toggle="dropdown" 
					aria-haspopup="true" 
					aria-expanded="false"
				>
					{currentQuery.widget_id ? name : 'Widgets'}
				</a>
				<div className="dropdown-menu" aria-labelledby="navbarDropdown">
					{ supportedCharts.map((chart, i)=>
						<a className="dropdown-item" 
							onClick={()=>updateQuery({widget_id: plugins[i] && plugins[i].id}, index)}
							href="# " 
							key={i} 
						>
							{chart}
						</a >) 
					}
				</div>
			</li>
	)
})

export default WidgetSelect
