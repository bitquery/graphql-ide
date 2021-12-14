import React, { useEffect, useState } from 'react'
import CsvIcon from '../../icons/CsvIcon'

function WidgetView({ el, config, dataSource, displayedData, children, renderFunc }) {
	const [table, setTable] = useState(null)
	const downloadCSV = () => {
		table.download('csv', 'data.csv')
	}
	useEffect(async () => {
		if (dataSource && config && displayedData && dataSource.data) {
			const fakeWidget = document.getElementById(el).firstChild
			fakeWidget && document.getElementById(el).removeChild(fakeWidget)
			let tablevar = typeof renderFunc === 'function' && await renderFunc(dataSource, config, el)
			tablevar && setTable(tablevar)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [JSON.stringify(config), JSON.stringify(dataSource), displayedData, renderFunc])
	if (!dataSource || !displayedData) return (<div></div>)
	return (
		<>
			{children}
			{'columns' in config && <CsvIcon onClick={downloadCSV} />}
			<div className="table-striped" style={{'width': '100%', 'height': '100%', 'overflowY': 'hidden'}} id={el} />
		</>
	)
}

export default WidgetView
