import React, { useEffect, useMemo, useState, useRef, createRef } from 'react'
import 'gridstack/dist/gridstack.min.css';
import {GridStack} from 'gridstack';
import 'gridstack/dist/h5/gridstack-dd-native';
import { QueriesStore, UserStore } from '../store/queriesStore'
import { getValueFrom } from '../utils/common'

function DashBoard({plugins}) {
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
	const { user } = UserStore
	//setup grid
	useEffect(() => {
		gridRef.current = GridStack.init(
			{
			  float: false,
			  acceptWidgets: function(el) { return true; },
			 
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
	//update items when dropend
	useEffect(() => {
		count !== 0 && setItems([...items, { id: `item-${count}` }])

	}, [count])
	//update grid items
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
		if (items.length) {
			grid.makeWidget(refs.current[items[items.length-1].id].current)
			grid.update(refs.current[items[items.length-1].id].current, {w:3 , h:3})
		}
		grid.commit()
		const qrh = e => {
			if (items.length > 0) {
				let indexx = plugins.map(plugin => plugin.id).indexOf(e.detail.widget_id)
				const WidgetComponent = indexx>=0 ? plugins[indexx] : plugins[0]
				const dataSource = {
					query: e.detail.query,
					variables: JSON.parse(e.detail.arguments),
					displayed_data: e.detail.displayed_data,
					key: process.env.REACT_APP_IDE_GUEST_API_KEY,
					setupData: (json) => ('data' in json) ? getValueFrom(json.data, e.detail.displayed_data) : null,
					fetcher: function() {
						let keyHeader = {'X-API-KEY': this.key}
						return fetch(
							'https://graphql.bitquery.io',
							{
								method: 'POST',
								headers: {
									Accept: 'application/json',
									'Content-Type': 'application/json',
									...keyHeader
								},
								body: JSON.stringify({query: e.detail.query, variables: e.detail.arguments}),
								credentials: 'same-origin',
							},
						)
					}
				}
				console.log(WidgetComponent.id, items[items.length-1].id)
				WidgetComponent.renderer(dataSource, JSON.parse(e.detail.config), items[items.length-1].id)}
			}
		window.addEventListener('query-request', qrh)
		return () => {
			window.removeEventListener('query-request', qrh)
		}
	  }, [items])

	return (
		<div 
			className="grid-stack controlled" 
			
		>
			{items.map((item, i) => 
				(
					<div ref={refs.current[item.id]} key={item.id} className={'grid-stack-item ui-draggable ui-resizable ui-resizable-autohide'}>
						<div className="grid-stack-item-content">
							<div style={{'width': '100%', 'height': '100%', 'overflowY': 'hidden'}} id={item.id} />
						</div>
					</div>
				)
			)}
		</div>
	)
}

export default DashBoard
