import React, { useEffect, useRef, useState } from 'react'
import CsvIcon from '../../icons/CsvIcon'
import { QueriesStore } from '../../../store/queriesStore'

function WidgetView({ el, config, dataSource, displayedData, children, renderFunc, widget, setWidgetInstance }) {
	const { currentQuery } = QueriesStore
	const ref = useRef(null)
	const [table, setTable] = useState(null)
	const downloadCSV = () => {
		table.download('csv', 'data.csv')
	}
	useEffect(async () => {
		if (widget) {
			// const fakeWidget = document.getElementById(el).firstChild
			// fakeWidget && document.getElementById(el).removeChild(fakeWidget)
			// let tablevar = typeof renderFunc === 'function' && await renderFunc(dataSource, config, el)
			// tablevar && setTable(tablevar)
			const Widget = eval(`(${widget})`)
			const widgetInstance = new Widget(ref.current, currentQuery.query)
			setWidgetInstance(widgetInstance)
		}
		// eslint-disable-next-line 
	}, [JSON.stringify(config), JSON.stringify(dataSource), displayedData, widget])
	return (
		<>
			{children}
			{/* NEED CONDITION FOR CSV DOWNLOAD BUTTON {config && 'columns' in config && <CsvIcon onClick={downloadCSV} />} */}
			<div ref={ref} className="table-striped" style={{'width': '100%', 'height': '100%', 'overflowY': 'scroll'}} id={el} />
		</>
	)
}

export default WidgetView
