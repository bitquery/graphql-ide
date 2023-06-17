import React, { useEffect, useRef, useState } from 'react'
import CsvIcon from '../../icons/CsvIcon'
import { QueriesStore } from '../../../store/queriesStore'
import { observer } from 'mobx-react'

const WidgetView = observer(function WidgetView({ el, config, dataSource, children, widget, widgetInstance, setWidgetInstance, loading }) {
	const { currentQuery } = QueriesStore
	const ref = useRef(null)
	const [table, setTable] = useState(null)
	const downloadCSV = () => {
		table.download('csv', 'data.csv')
	}
	useEffect(async () => {
		if (widgetInstance && !loading && ref.current.children.length) {
			if (dataSource?.data) {
				widgetInstance.onData(dataSource.data, true)
			}
		} else if (widget && !ref.current.children.length) {
			//temp for fit height in IDE
			const explicitHeight = widget.match(/height:.*\d(px| +|)(,|)( +|)$/gm)
			if (explicitHeight) {
				widget = widget.replace(explicitHeight[0], '')
			}
			const Widget = eval(`(${widget})`)
			const widgetInstance = new Widget(ref.current, currentQuery.query)
			setWidgetInstance(widgetInstance)
			if (dataSource?.data) {
				widgetInstance.onData(dataSource.data, true)
			}
		}
		// eslint-disable-next-line 
	}, [JSON.stringify(config), JSON.stringify(dataSource.data), widget, currentQuery.widget_id, loading])

	return (
		<>
			{children}
			{/* NEED CONDITION FOR CSV DOWNLOAD BUTTON {config && 'columns' in config && <CsvIcon onClick={downloadCSV} />} */}
			<div ref={ref} className="table-striped" style={{ 'width': '100%', 'height': '100%', 'overflowY': 'scroll' }} id={el} />
		</>
	)
})

export default WidgetView
