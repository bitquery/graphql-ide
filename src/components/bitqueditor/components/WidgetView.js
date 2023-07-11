import React, { useEffect, useRef, useState } from 'react'
import CsvIcon from '../../icons/CsvIcon'
import { QueriesStore } from '../../../store/queriesStore'
import { TabsStore } from '../../../store/queriesStore'
import { observer } from 'mobx-react'

const getData = async ({ endpoint_url, query, variables }) => {
	const response = await fetch(endpoint_url, {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ query, variables }),
		credentials: 'same-origin',
	});
	if (response.status !== 200) {
		throw new Error(response.error);
	}
	const { data } = await response.json();
	if (data.errors) {
		throw new Error(data.errors[0].message);
	}
	return data
};

const WidgetView = observer(function WidgetView({ el, config, dataSource, children, widget, widgetInstance, setWidgetInstance, loading }) {
	const { currentQuery, updateQuery } = QueriesStore
	const { index } = TabsStore
	const ref = useRef(null)
	const [table, setTable] = useState(null)
	const downloadCSV = () => {
		table.download('csv', 'data.csv')
	}

	useEffect(async () => {
		if (widgetInstance && ref.current.children.length) {
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
			const query = {
				query: currentQuery.query,
				variables: JSON.parse(currentQuery.variables),
				endpoint_url: currentQuery.endpoint_url
			}
			const widgetInstance = new Widget(ref.current, query, getData)
			setWidgetInstance(widgetInstance)
			const isSubscription = currentQuery.query.startsWith('subscription')
			if (dataSource?.data) {
				widgetInstance.onData(dataSource.data, isSubscription)
			}
		}
		// eslint-disable-next-line 
	}, [JSON.stringify(dataSource.data), widget, currentQuery.widget_id])

	return (
		<>
			{children}
			{/* NEED CONDITION FOR CSV DOWNLOAD BUTTON {config && 'columns' in config && <CsvIcon onClick={downloadCSV} />} */}
			<div ref={ref} className="table-striped" style={{ 'width': '100%', 'height': '100%', 'overflowY': 'scroll' }} id={el} />
		</>
	)
})

export default WidgetView
