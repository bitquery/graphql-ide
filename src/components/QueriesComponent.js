import React, { useState } from 'react'
import { Link, useRouteMatch } from 'react-router-dom'
import {TabsStore, QueriesStore} from '../store/queriesStore'
import copy from 'copy-to-clipboard'
import { useToasts } from 'react-toast-notifications'
import { observer } from 'mobx-react-lite'

const QueriesComponent = observer(({ queries }) => {
	const { url } = useRouteMatch()
	const { addToast } = useToasts()
	const [hoverElementIndex, setHoverElementIndex] = useState(false)
	const { addNewTab, switchTab, tabs } = TabsStore
	const { setQuery, setCurrentQuery, query, currentQuery } = QueriesStore
	const showDescription = (i1, i2) => i1===i2 ? true : false
	const handleClick = (queryFromGallery) => {
		if (query.map(query => query.id).indexOf(queryFromGallery.id) === -1) {
			const params = {
				query: queryFromGallery.query,
				variables: queryFromGallery.arguments,
				url: queryFromGallery.url
			}
			setQuery(params, queryFromGallery.id)
			setCurrentQuery(params, queryFromGallery.id)
			addNewTab(queryFromGallery.name)
		} else {
			let tabID = query.map(query => query.id).indexOf(queryFromGallery.id)
			switchTab(tabs[tabID].id)
		}
	}
	const queryIsOpen = (queryFromGallery) => 
		queryFromGallery.id === currentQuery.id ? true : false		
	
	const handleCopy = (queryurl) => {
		copy(`${window.location.protocol}://${window.location.host}${url}/${queryurl}`)
		addToast('Link copied to clipboard', {appearance: 'success'})
	}

	return (
		queries.queries.map((query, index) => (
			<li className="list-group-item" key={index}
				onMouseEnter={() => setHoverElementIndex(index)}
				onMouseLeave={() => setHoverElementIndex(-1)}
			> 
				<div className="gallery__query__wrapper flex">
					<Link to={`${url}/${query.url}`} onClick={() => handleClick(query)}> {query.name} </Link>
					{
						query.url &&
						<button type="button" className="btn btn-sm btn-outline-primary"
							onClick={()=>handleCopy(query.url)}
						>
							Get link
							<span className="shared-link"></span>
						</button>
					}
				</div>
				{ 
					(showDescription(hoverElementIndex, index) || queryIsOpen(query)) && 
						<label className="gallery__query__description" > 
							{query.description} 
						</label>
				}
			</li>
		))
	)
})

export default QueriesComponent
