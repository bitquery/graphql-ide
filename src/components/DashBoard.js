import React, { useEffect, useMemo } from 'react'
import 'gridstack/dist/gridstack.min.css';
import {GridStack} from 'gridstack';
import 'gridstack/dist/h5/gridstack-dd-native';
import WidgetView from './bitqueditor/components/WidgetView'
import { QueriesStore } from '../store/queriesStore'
import { vegaPlugins } from 'vega-widgets'
import { graphPlugins } from '@bitquery/ide-graph'
import { timeChartPlugins } from '@bitquery/ide-charts'
import { getValueFrom } from '../utils/common'


function DashBoard() {
	const dataSource = {"data":{"bitcoin":{"blocks":[{"count":2016,"date":{"year":2020},"difficulty":13732352106018.34},{"count":1999,"date":{"year":2020},"difficulty":13798783827516.42},{"count":2016,"date":{"year":2020},"difficulty":13912524048945.91},{"count":2016,"date":{"year":2020},"difficulty":14715214060656.53},{"count":2016,"date":{"year":2020},"difficulty":14776367535688.64},{"count":2016,"date":{"year":2020},"difficulty":15138043247082.88},{"count":2016,"date":{"year":2020},"difficulty":15466098935554.65},{"count":2016,"date":{"year":2020},"difficulty":15486913440292.87},{"count":2016,"date":{"year":2020},"difficulty":15546745765529.37},{"count":2016,"date":{"year":2020},"difficulty":15784217546288.15},{"count":2016,"date":{"year":2020},"difficulty":15784744305477.41},{"count":2016,"date":{"year":2020},"difficulty":15958652328578.42},{"count":2016,"date":{"year":2020},"difficulty":16104807485529.38},{"count":2016,"date":{"year":2020},"difficulty":16552923967337.23},{"count":2016,"date":{"year":2020},"difficulty":16787779609932.66},{"count":2016,"date":{"year":2020},"difficulty":16847561611550.27},{"count":2016,"date":{"year":2020},"difficulty":16947802333946.61},{"count":2016,"date":{"year":2020},"difficulty":17345948872516.06},{"count":2016,"date":{"year":2020},"difficulty":17345997805929.09},{"count":2016,"date":{"year":2020},"difficulty":17557993035167.3},{"count":2016,"date":{"year":2020},"difficulty":17596801059571.43},{"count":649,"date":{"year":2020},"difficulty":18599593048299.49},{"count":2016,"date":{"year":2020},"difficulty":18670168558399.59},{"count":2016,"date":{"year":2020},"difficulty":19157154724710.14},{"count":2016,"date":{"year":2020},"difficulty":19298087186262.61},{"count":2016,"date":{"year":2020},"difficulty":19314656404097},{"count":2016,"date":{"year":2020},"difficulty":19997335994446.11},{"count":1367,"date":{"year":2021},"difficulty":18599593048299.49},{"count":2016,"date":{"year":2021},"difficulty":20607418304385.63},{"count":2016,"date":{"year":2021},"difficulty":20823531150111.52},{"count":2016,"date":{"year":2021},"difficulty":21434395961348.92},{"count":2016,"date":{"year":2021},"difficulty":21448277761059.71},{"count":2016,"date":{"year":2021},"difficulty":21724134900047.27},{"count":1641,"date":{"year":2021},"difficulty":21865558044610.55}]}},"displayed_data":"bitcoin.blocks","error":null,"query":"query ($network: BitcoinNetwork!, $date: ISO8601DateTime) {\n  bitcoin(network: $network) {\n    blocks(date: {after: $date}) {\n      count\n      date {\n        year\n      }\n      difficulty\n    }\n  }\n}\n","variables":"{\n  \"network\": \"bitcoin\",\n  \"date\": \"2020-01-01\"\n}"}
	const config = {"transform":[{"sample":1000}],"encoding":{"x":{"field":"date.year","type":"ordinal","sort":null},"y":{"field":"count","type":"quantitative"},"stroke":{"condition":{"selection":"highlight","value":"#000"}}}}
	const { currentQuery } = QueriesStore
	const displayedData = "bitcoin.blocks"
	dataSource.values = getValueFrom(dataSource.data, displayedData)
	const plugins = useMemo(()=> [...vegaPlugins, ...graphPlugins, ...timeChartPlugins], [])
	let indexx = plugins.map(plugin => plugin.id).indexOf(currentQuery.widget_id)
	const WidgetComponent = indexx>=0 ? plugins[indexx] : plugins[0]
	const helper = (event) => {
		let el = document.createElement('div')
		el.setAttribute('id', 'asd')
		return el
	  }
	useEffect(() => {
		let options = {
			float: true,
			class: 'grid-stak-editor',
			alwaysShowResizeHandle: true,
          	minRow: 1,
			acceptWidgets: function(el) { return true; }
		}
		
		var grid = GridStack.init(options);
		GridStack.setupDragIn('.list-group-item.grid-stack-item', { 
			revert: 'invalid',
			scroll: false,
			appendTo: 'body',
			helper: helper
		});
		grid.on('dropped', function(event, previousWidget, newWidget) {
			console.log('Removed widget that was dragged out of grid:', previousWidget);
			console.log('Added widget in dropped grid:', newWidget);
			grid.removeWidget(newWidget.el)
			let node = {w: 1, h: 1}
			node.content = '<div id="asd" style="width: 100%; height: 100%; overflow-y: hidden;"></div>'
			grid.addWidget(node)
			if (dataSource && config && displayedData && dataSource.data) {
				typeof WidgetComponent.renderer === 'function' 
				&& WidgetComponent.renderer(dataSource, config, 'asd')
			}
		});
		  grid.on('resize', function(event, el) {
			window.dispatchEvent(new Event('resize'))
		});
	}, [GridStack, JSON.stringify(currentQuery)])
	return (
		<div className="grid-stack">
		</div>
	)
}

export default DashBoard
