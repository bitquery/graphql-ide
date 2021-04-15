import React, { useState, useEffect } from 'react'
import _ from "lodash";
import { observer } from 'mobx-react-lite'
import { toJS } from 'mobx'
import RGL, { WidthProvider } from "react-grid-layout"
import { getValueFrom } from '../utils/common'
import { QueriesStore } from '../store/queriesStore'
const ReactGridLayout = WidthProvider(RGL);

const DashboardReactFunctional = observer(({className = 'layout', rowHeight = 100, plugins}) => {
	const { currentQuery } = QueriesStore
	const [dashboard_id, setdashboard_id] = useState(0)
	const [widgets_ids, setwidgets_ids] = useState([])
	const [layout, setlayout] = useState([])
	const [items, setitems] = useState(currentQuery.layout || [])
	const [queries, setqueries] = useState([])
	const [newCounter, setnewCounter] = useState(1)
	
	useEffect(() => {
		const qrh = e => {
			const query = e.detail ? e.detail : e
			if (items.length > 0) {
				console.log('here')
				let indexx = plugins.map(plugin => plugin.id).indexOf(query.widget_id)
				const WidgetComponent = indexx>=0 ? plugins[indexx] : plugins[0]
				const dataSource = {
					query: toJS(query.query),
					variables: toJS(query.arguments) ? JSON.parse(toJS(query.arguments)) : JSON.parse(toJS(query.variables)),
					displayed_data: toJS(query.displayed_data),
					key: process.env.REACT_APP_IDE_GUEST_API_KEY,
					setupData: (json) => ('data' in json) ? getValueFrom(json.data, toJS(query.displayed_data)) : null,
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
							body: JSON.stringify({query: toJS(query.query), variables: toJS(query.arguments) || toJS(query.variables)}),
							credentials: 'same-origin',
						},
						)
					}
				}
				console.log(WidgetComponent.id, items[items.length-1].i)
				console.log(JSON.parse(toJS(query.config)), toJS(query.i) || items[items.length-1].i+1)
				setwidgets_ids([...widgets_ids, query.widget_id])
				WidgetComponent.renderer(dataSource, JSON.parse(toJS(query.config)), toJS(query.i) || items[items.length-1].i)
				setqueries([...queries, toJS(query)])
			}
		}
		window.addEventListener('query-request', qrh)
		return () => {
			window.removeEventListener('query-request', qrh)
		}
	}, [])
	const createElement = el => {
		const removeStyle = {
			position: "absolute",
			right: "2px",
			top: 0,
			cursor: "pointer"
		};
		const i = el.add ? "+" : el.i;
		return (
			<div key={i} data-grid={el}>
				<div 
				style={{'width': '100%', 'height': '100%', 'overflowY': 'hidden'}} 
				id={el.i} 
				/>
					<span
					className="remove"
					style={removeStyle}
					onClick={() => onRemoveItem(i)}
					>
						x
					</span>
			</div>
		);
	}
	const onRemoveItem = i => {
		console.log("removing", i);
		const index = i[1]
		let newItems = [...items]
		newItems.splice(index, 1)
		for (let k = index; k < newItems.length; k++) {
			console.log(newItems)
			newItems[k].i = `n${newItems[k].i.split('')[1]--}`
		}
		console.log(newItems)
		setitems({items: newItems})
	}
	const onAddItem = () => {
		console.log("adding", "n" + newCounter);
		setitems([...items, {
			i: "n" + newCounter,
			x: (items.length * 2) % (12),
			y: Infinity,
			w: 2,
			h: 2
		}])
		setnewCounter(prev => prev + 1)
	}
	const onLayoutChange = (layout) => {
		// saveToLS("layout", layout);
		setlayout({layout})
	}
	const onDrop = (layout, layoutItem, _event) => {
		console.log("adding", "n" + newCounter);
		
		setitems([...items, {
			i: "n" + newCounter,
			x: (items.length * 2) % (12),
			y: Infinity,
			w: 2,
			h: 2
		}])
		setnewCounter(prev => prev + 1)
		// alert(`Dropped element props:\n${JSON.stringify(layoutItem, ['x', 'y', 'w', 'h'], 2)}`);
	};
	return (
		<div>
			<button >Save</button>
			<ReactGridLayout
				onLayoutChange={onLayoutChange}
				className={className}
				rowHeight={rowHeight}
				onDrop={onDrop}
				isDroppable={true}
				onResize={()=>window.dispatchEvent(new Event('resize'))}
				onResizeStop={()=>window.dispatchEvent(new Event('resize'))}
			>
				{_.map(items, el => createElement(el))}
			</ReactGridLayout>
		</div>
	)
})

export default DashboardReactFunctional
