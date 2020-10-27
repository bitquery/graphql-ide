import React, { useState } from 'react'
import {TabsStore, QueriesStore} from '../store/queriesStore'

function QueriesComponent ({ queries }) {
	const [hoverElementIndex, setHoverElementIndex] = useState(false)
	const { addNewTab } = TabsStore
	const { setQuery, setCurrentQuery } = QueriesStore
	const showDescription = (i1, i2) => i1===i2 ? true : false
	const handleClick = (query) => {
		const params = {
			query: query.query,
			variables: query.arguments,
			url: query.url
		}
		setQuery(params, query.id)
		setCurrentQuery(params, query.id)
		addNewTab(query.name)
	}

	return (
		queries.map((query, index) => (
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
