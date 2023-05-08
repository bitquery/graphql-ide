import React, { useEffect, useRef, useState } from 'react'
import CsvIcon from '../../icons/CsvIcon'
import { QueriesStore } from '../../../store/queriesStore'

function WidgetView({ el, config, dataSource, displayedData, children, renderFunc, widget, widgetInstance, setWidgetInstance }) {
	const { currentQuery } = QueriesStore
	const ref = useRef(null)
	const [table, setTable] = useState(null)
	const downloadCSV = () => {
		table.download('csv', 'data.csv')
	}
	useEffect(async () => {
		if (widget) {
			/* while(ref.current.firstChild) {
				ref.current.removeChild(ref.current.firstChild)
			} */
			// const fakeWidget = document.getElementById(el).firstChild
			// fakeWidget && document.getElementById(el).removeChild(fakeWidget)
			// let tablevar = typeof renderFunc === 'function' && await renderFunc(dataSource, config, el)
			// tablevar && setTable(tablevar)
			const Widget = eval(`(${widget})`)
			const widgetInstance = new Widget(ref.current, currentQuery.query)
			setWidgetInstance(widgetInstance)
			if (dataSource?.data) {
				widgetInstance.onData(dataSource.data, true)
			}
		}
		// eslint-disable-next-line 
	}, [JSON.stringify(config), JSON.stringify(dataSource.data), widget, currentQuery.widget_id])

	return (
		<>
			{children}
			{/* NEED CONDITION FOR CSV DOWNLOAD BUTTON {config && 'columns' in config && <CsvIcon onClick={downloadCSV} />} */}
			<div ref={ref} className="table-striped" style={{'width': '100%', 'height': '100%', 'overflowY': 'scroll'}} id={el} />
		</>
	)
}

export default WidgetView
