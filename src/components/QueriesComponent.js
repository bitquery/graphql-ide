import React, { useState } from 'react'
import { Link, useHistory, useRouteMatch } from 'react-router-dom'
import { TabsStore, QueriesStore } from '../store/queriesStore'
import { observer } from 'mobx-react-lite'
import QueriesControls from './QueriesControls'

const QueriesComponent = observer(({ queries }) => {
	const { url } = useRouteMatch()
	let history = useHistory()
	const [hoverElementIndex, setHoverElementIndex] = useState(false)
	const { switchTab, tabs } = TabsStore
	const { setQuery, query, currentQuery } = QueriesStore
	const showDescription = (i1, i2) => i1===i2 ? true : false
	const handleClick = (queryFromGallery) => {
		if (query.map(query => query.id).indexOf(queryFromGallery.id) === -1) {
			const params = {
				query: queryFromGallery.query,
				variables: queryFromGallery.arguments,
				url: queryFromGallery.url,
				name: queryFromGallery.name,
				description: queryFromGallery.description && queryFromGallery.description
			}
			setQuery(params, queryFromGallery.id)
		} else {
			let tabID = query.map(query => query.id).indexOf(queryFromGallery.id)
			switchTab(tabs[tabID].id)
		}
	}
	const queryIsOpen = (queryFromGallery) => 
		queryFromGallery.id === currentQuery.id ? true : false		
	
	return (
		queries.queries.map((query, index) => (
			<li className="list-group-item" key={index}
				onMouseEnter={() => setHoverElementIndex(index)}
				onMouseLeave={() => setHoverElementIndex(-1)}
				onClick={()=>{history.push(`${url}/${query.url}`);handleClick(query)}}
			> 
				<div className="gallery__query__wrapper flex">
					<Link to={`${url}/${query.url}`} onClick={() => handleClick(query)}> {query.name} </Link>
				</div>
				{ 
					(showDescription(hoverElementIndex, index) || queryIsOpen(query)) && 
						<>
							<label className="gallery__query__description" > 
								{query.description} 
							</label>
							<QueriesControls query={query} />
						</>
				}
			</li>
		))
	)
})

export default QueriesComponent
