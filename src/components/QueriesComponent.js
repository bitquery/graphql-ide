import React, { useState } from 'react'
import {TabsStore, QueriesStore} from '../store/queriesStore'

function QueriesComponent ({ queries }) {
	const [hoverElementIndex, setHoverElementIndex] = useState(false)
	const { addNewTab, switchTab, tabs } = TabsStore
	const { setQuery, setCurrentQuery, query } = QueriesStore
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

	return (
		queries.queries.map((query, index) => (
			<li className="gallery__query" key={index} > 
				<p  className="gallery__query__body"
					onMouseEnter={() => setHoverElementIndex(index)}
					onMouseLeave={() => setHoverElementIndex(-1)}
					onClick={() => handleClick(query)}
				> 
					{query.name} 
				</p>
				{ 
					showDescription(hoverElementIndex, index) && 
						<label className="gallery__query__description" > 
							{query.description} 
						</label>
				}
			</li>
		))
	)
}

export default QueriesComponent
