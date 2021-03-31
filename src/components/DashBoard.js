import React, { useEffect, useMemo, useState, useRef, createRef } from 'react'
import 'gridstack/dist/gridstack.min.css';
import {GridStack} from 'gridstack';
import 'gridstack/dist/h5/gridstack-dd-native';
import WidgetView from './bitqueditor/components/WidgetView'
import { QueriesStore } from '../store/queriesStore'
import { vegaPlugins } from 'vega-widgets'
import { graphPlugins } from '@bitquery/ide-graph'
import { timeChartPlugins } from '@bitquery/ide-charts'
import { getValueFrom } from '../utils/common'

function DashBoard({dataSource, WidgetComponent}) {
	const [count, setCount] = useState(0)
	const [items, setItems] = useState([])
	const refs = useRef({})
    const gridRef = useRef()
	if (Object.keys(refs.current).length !== items.length) {
		items.forEach(({ id }) => {
		  refs.current[id] = refs.current[id] || createRef()
		})
	}
	const { currentQuery } = QueriesStore

	useEffect(() => {
		gridRef.current = GridStack.init(
			{
			  float: false,
			  acceptWidgets: function(el) { return true; }
			},
			'.controlled'
		)
		const grid = gridRef.current
		GridStack.setupDragIn('.list-group-item.grid-stack-item', { 
			revert: 'invalid',
			scroll: false,
			appendTo: 'body',
			helper: 'clone'
		});
		grid.on('dropped', function(event, previousWidget, newWidget) {
			grid.removeWidget(newWidget.el)
			setCount(prev=>prev+1)
		});
		  grid.on('resize resizestop', function(event, el) {
			window.dispatchEvent(new Event('resize'))
		});
	}, [])
	useEffect(() => {
		count !== 0 && setItems([...items, { id: `item-${count}` }])
	}, [count])
	useEffect(() => {
		gridRef.current =
		  gridRef.current ||
		  GridStack.init(
			{
			  float: true,
			  acceptWidgets: function(el) { return true; }
			},
			'.controlled'
		  )
		const grid = gridRef.current
		grid.batchUpdate()
		grid.removeAll(false)
		items.forEach(({ id }) => {
			grid.makeWidget(refs.current[id].current)
		})
		if (items.length) {
			grid.update(refs.current[items[items.length-1].id].current, {w:3 , h:3})
		}
		grid.commit()
	  }, [items])
	  const handleDrop = e => {
		  console.log(e.target)
		  setItems([...items, { id: `item-${items.length}` }])
	  }

	return (
		<div 
			className="grid-stack controlled" 
			
		>
			{items.map((item, i) => 
				(
					<div ref={refs.current[item.id]} key={item.id} className={'grid-stack-item ui-draggable ui-resizable ui-resizable-autohide'}>
						<div className="grid-stack-item-content">
							<WidgetView 
								renderFunc={WidgetComponent.renderer}
								dataSource={dataSource} 
								displayedData={currentQuery.displayed_data}
								config={currentQuery.config} 
								el={item.id} 
							></WidgetView>
						</div>
					</div>
				)
			)}
		</div>
	)
}

export default DashBoard
