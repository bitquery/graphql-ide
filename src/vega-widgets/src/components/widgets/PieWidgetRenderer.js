import React, { useEffect } from 'react'
import vega from 'vega'
import vegaLite from 'vega-lite'
import vegaEmbed from 'vega-embed'

function PieWidgetRenderer({ el, config, dataSource, displayedData, children }) {
	useEffect(() => {
		if (dataSource && config && config.data && dataSource.data) {
			let cfg = {
				$schema: 'https://vega.github.io/schema/vega-lite/v4.json',
				description: 'A simple bar chart with embedded data.',
				width: 'container',
				height: 'container',
				mark: {"type": "arc", "tooltip": true},
				selection: {
					highlight: {
						type: "single",
						empty: "none",
						on: "mouseover"
					}
				},
				...config,
				data: {
					values: dataSource.values 
				},
				view: {stroke: null}
			}
			try {
				el && vegaEmbed(`#${el}`, cfg)
			} catch (error) {
				console.log(error)
			}
		}
	}, [JSON.stringify(config), JSON.stringify(dataSource), displayedData])
	if (!dataSource) return (<div></div>)
	return (
		<>
			{children}
			<div style={{'width': '100%', 'overflowY': 'hidden'}} id={el} />
		</>
	)
}

export default PieWidgetRenderer
