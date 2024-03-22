import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { TabsStore, QueriesStore } from '../../store/queriesStore'
import { observer } from 'mobx-react-lite'
import QueriesControls from './QueriesControls'
import LinkComponent from './LinkComponent'
import GraphqlIcon from '../icons/GraphqlIcon'


const QueriesComponent = observer(function QueriesComponent({ queries }) {
	
	
	let history = useHistory()
	const [hoverElementIndex, setHoverElementIndex] = useState(false)
	const { switchTab, tabs } = TabsStore
	const { setQuery, setDashboardQuery, query, currentQuery } = QueriesStore
	const showDescription = (i1, i2) => i1===i2 ? true : false
	const handleClick = (queryFromGallery) => {
		if (query.map(query => query.id).indexOf(queryFromGallery.id) === -1) {
			let data = {...queryFromGallery}
			if (queryFromGallery.widget_ids) {
				let widget_ids = queryFromGallery.widget_ids.split(',')
				let dbqueries = queries.queries.filter(query => query.widget_number && widget_ids.includes((query.widget_number).toString()))
				data = {...queryFromGallery, dbqueries}
			}
			let newQuery = {...data}
			if ('layout' in newQuery) newQuery = {...newQuery, isDraggable: false, isResizable: false}
			if ('javascript' in newQuery) newQuery = {...newQuery, javascript: JSON.parse(newQuery.javascript)}
			setQuery(newQuery, queryFromGallery.id)
		} else {
			let tabID = query.map(query => query.id).indexOf(queryFromGallery.id)
			switchTab(tabs[tabID].id)
		}
	}
	const dragEnd = (queryFromGallery) => {
		setDashboardQuery(queryFromGallery, queryFromGallery.id)
		window.dispatchEvent(new CustomEvent('query-request', {detail: queryFromGallery}))
	}
	const queryUrl = queryUrl => queryUrl ? `/${queryUrl}` : '/'
	const queryIsOpen = (queryFromGallery) => 
		queryFromGallery.id === currentQuery.id ? true : false	
	const isSaved = baseQuery => {
		for (let i =0; i<query.length; i++) {
			if (!((('saved' in query[i]) && query[i].saved) || !('saved' in query[i]))) {
				if (baseQuery.id === query[i].id) return false
			}
		}
		return true
	}	
	
	return (
		('queries'in queries) && queries.queries.map((baseQuery, index) => (
			<li className={'list-group-item grid-stack-item droppable-element ' + 
				((showDescription(hoverElementIndex, index) || queryIsOpen(baseQuery)) && 'flex-col text-break')}
				key={index}
				onMouseEnter={() => setHoverElementIndex(index)}
				onMouseLeave={() => setHoverElementIndex(-1)}
				onDragEnd={() => dragEnd(baseQuery)}
				draggable={true}
				unselectable="on"
				onDragStart={e => e.dataTransfer.setData("text/plain", "")}
				onClick={()=>{history.push(queryUrl(baseQuery.url));handleClick(baseQuery)}}
			> 
				<div className="gallery__query__wrapper flex">
					{baseQuery.layout ? <i className="fas fa-th"></i> 
					: baseQuery.widget_id==='json.widget' || !baseQuery.widget_id 
					? <GraphqlIcon fill={'#000000'} width={'16px'} height={'16px'}/> 
					: <i className="fas fa-chart-bar bitquery-ico"></i>}
					<LinkComponent propquery={baseQuery} />
				</div>
				{ 
					(showDescription(hoverElementIndex, index) || queryIsOpen(baseQuery)) && 
						<>
							<label className="gallery__query__description" > 
								{baseQuery.description} 
							</label>
							<QueriesControls query={baseQuery} isSaved={isSaved(baseQuery)} />
						</>
				}
			</li>
		))
	)
})

export default QueriesComponent
