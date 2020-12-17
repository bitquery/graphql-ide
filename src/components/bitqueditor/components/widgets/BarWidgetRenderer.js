import React, { useEffect, useState } from 'react'
import vega from 'vega'
import vegaLite from 'vega-lite'
import vegaEmbed from 'vega-embed'
import { getValueFrom } from '../../../../utils/common'

function BarWidgetRenderer({ el, config, dataSource }) {

	useEffect(() => {
		if (dataSource && config && config.data && dataSource.data) {
			let values = getValueFrom(dataSource.data, config.data) || {}
			let cfg = {
				$schema: 'https://vega.github.io/schema/vega-lite/v4.json',
				description: 'A simple bar chart with embedded data.',
				width: "container",
				height: "container",
				mark: 'bar',
				...config,
				data: {
					values
				}
			}
			try {
				el && vegaEmbed(`#${el}`, cfg)
				
			} catch (error) {
				console.log(error)
			}
		}
	}, [JSON.stringify(config), JSON.stringify(dataSource)])
	if (!dataSource) return (<div></div>)
	return (
		<div className="widget-display" >
			<div style={{'width': '100%', 'padding': '10px'}} id={el} />
		</div>
	)
}

export default BarWidgetRenderer
