import React, { useEffect, useRef } from 'react'
import { QueriesStore } from '../../../store/queriesStore'
import { observer } from 'mobx-react'

import JsonWidget from "./JsonComponent";

const WidgetView = observer(function WidgetView({ children, widget, dataSource, ready }) {
	const { currentQuery } = QueriesStore
	const refJson = useRef(null)
	const refChart = useRef(null)

	useEffect(() => {
		const initWidget = async () => {
			try {
				if  ((dataSource && dataSource.historyDataSource) || (dataSource && dataSource.subscriptionDataSource)) {
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
			} catch (error){
				console.error("error init widget:", error);
			}

		}
		initWidget()
		// eslint-disable-next-line 
	}, [dataSource])

	useEffect(() => {
		window.dispatchEvent(new Event('resize'))
	}, [currentQuery.widget_id])

	return (
		<>
			{children}
			{/* NEED CONDITION FOR CSV DOWNLOAD BUTTON {config && 'columns' in config && <CsvIcon onClick={downloadCSV} />} */}
			{(dataSource?.historyDataSource && currentQuery.widget_id !== 'config.widget' && ready) && 
				<div className='response-time'>
					<i className="bi bi-clock-fill mr-1"/>
					{currentQuery.responseTime > 999 ? currentQuery.responseTime/1000 : currentQuery.responseTime}
					{currentQuery.responseTime > 999 ? 's' : 'ms'}
			</div>}
			<div ref={refJson} className={"result-window result-window-json " + (currentQuery.widget_id !== 'config.widget' ? 'result-window-active' : '')} />
			<div ref={refChart} className={"result-window result-window-chart " + (currentQuery.widget_id === 'config.widget' ? 'result-window-active' : '')} />
		</>
	)
})

export default WidgetView
