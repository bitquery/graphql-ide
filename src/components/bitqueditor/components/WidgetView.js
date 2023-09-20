import React, { useEffect, useRef } from 'react'
import { QueriesStore } from '../../../store/queriesStore'
import { observer } from 'mobx-react'
import JsonWidget from "./JsonWidget"

const WidgetView = observer(function WidgetView({ children, widget, dataSource }) {
	const { currentQuery } = QueriesStore
	const refJson = useRef(null)
	const refChart = useRef(null)

	useEffect(async () => {
		if (dataSource) {
			if (refJson.current.childNodes.length) {
				refJson.current.removeChild(refJson.current.firstChild)
			}
			if (refChart.current.childNodes.length) {
				refChart.current.removeChild(refChart.current.firstChild)
			}
			const jsonWidgetInstance = new JsonWidget(refJson.current, dataSource.historyDataSource, dataSource.subscriptionDataSource)
			await jsonWidgetInstance.init(!!!widget)
			if (widget) {
				//temp for fit height in IDE
				const explicitHeight = widget.match(/height:.*\d(px| +|)(,|)( +|)$/gm)
				if (explicitHeight) {
					widget = widget.replace(explicitHeight[0], '')
				}
				const ChartWidget = eval(`(${widget})`)
				const chartWidgetInstance = new ChartWidget(refChart.current, dataSource.historyDataSource, dataSource.subscriptionDataSource)
				await chartWidgetInstance.init()
				if (dataSource.historyDataSource) {
					dataSource.historyDataSource.changeVariables()
				}
				if (dataSource.subscriptionDataSource) {
					dataSource.subscriptionDataSource.changeVariables()
				}
			}
		}
		// eslint-disable-next-line 
	}, [dataSource])

	useEffect(() => {
		window.dispatchEvent(new Event('resize'))
	}, [currentQuery.widget_id])

	return (
		<>
			{children}
			{/* NEED CONDITION FOR CSV DOWNLOAD BUTTON {config && 'columns' in config && <CsvIcon onClick={downloadCSV} />} */}
			<div ref={refJson} className={"result-window result-window-json " + (currentQuery.widget_id !== 'config.widget' ? 'result-window-active' : '')} />
			<div ref={refChart} className={"result-window result-window-chart " + (currentQuery.widget_id === 'config.widget' ? 'result-window-active' : '')} />
		</>
	)
})

export default WidgetView
