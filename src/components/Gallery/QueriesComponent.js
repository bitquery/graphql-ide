import React, { useEffect, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { TabsStore, QueriesStore } from '../../store/queriesStore'
import { observer } from 'mobx-react-lite'
import QueriesControls from './QueriesControls'
import 'gridstack/dist/gridstack.min.css';
import {GridStack} from 'gridstack';
import 'gridstack/dist/h5/gridstack-dd-native';

const QueriesComponent = observer(function QueriesComponent({ queries }) {
	
	/* useEffect(() => {
		const helper = (event) => {
			let el = document.createElement('div')
			// el.setAttribute('id', 'asd')
			return el
		  }
		let options = {
			acceptWidgets: function(el) { return true; }
		}
		var items = [
			{content: 'my first widget'}, // will default to location (0,0) and 1x1
			{w: 2, content: 'another longer widget!'} // will be placed next at (1,0) and 2x1
		];
		var grid = GridStack.init(options);
		GridStack.setupDragIn('.list-group-item.grid-stack-item', { 
			revert: 'invalid',
			scroll: false,
			appendTo: 'body',
			helper: helper
		});
		grid.load(items);
	}, [GridStack]) */
	let history = useHistory()
	const [hoverElementIndex, setHoverElementIndex] = useState(false)
	const { switchTab, tabs } = TabsStore
	const { setQuery, query, currentQuery } = QueriesStore
	const showDescription = (i1, i2) => i1===i2 ? true : false
	const handleClick = (queryFromGallery) => {
		if (query.map(query => query.id).indexOf(queryFromGallery.id) === -1) {
			setQuery({...queryFromGallery, variables: queryFromGallery.arguments}, queryFromGallery.id)
		} else {
			let tabID = query.map(query => query.id).indexOf(queryFromGallery.id)
			switchTab(tabs[tabID].id)
		}
	}
	const queryUrl = queryUrl => queryUrl ? `${process.env.REACT_APP_IDE_URL}/${queryUrl}` : `${process.env.REACT_APP_IDE_URL}`
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
			<li className="list-group-item grid-stack-item" key={index}
				onMouseEnter={() => setHoverElementIndex(index)}
				onMouseLeave={() => setHoverElementIndex(-1)}
				onClick={()=>{history.push(queryUrl(baseQuery.url));handleClick(baseQuery)}}
			> 
				<div className="gallery__query__wrapper flex">
					<Link to={queryUrl(baseQuery.url)} onClick={() => handleClick(baseQuery)}> 
						{isSaved(baseQuery) ? baseQuery.name : `*${baseQuery.name}`}
					</Link>
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
