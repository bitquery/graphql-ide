import React, { useEffect } from 'react'
import renderFunc from './barWidgetRenderFunc'
import axios from 'axios'

function BarWidgetRenderer({ el, config, dataSource, displayedData, children }) {
	useEffect(() => {
		if (dataSource && config && displayedData && dataSource.data) {
			let js = undefined
			axios.get('/api/js').then(data => {
				js = data.data
				console.log(`
					let ds = new dataSourceWidget(\`${dataSource.query}\`, \`${dataSource.variables}\`, \`${dataSource.displayed_data}\`)
					${js}
					const config = ${JSON.stringify(config)}
					renderFunc(ds, config, '${el}')
				`)
			})
			renderFunc(dataSource, config, el)
		}
	}, [JSON.stringify(config), JSON.stringify(dataSource), displayedData, renderFunc])
	if (!dataSource) return (<div></div>)
	return (
		<>
			{children}
			<div style={{'width': '100%', 'overflowY': 'hidden'}} id={el} />
		</>
	)
}

export default BarWidgetRenderer
