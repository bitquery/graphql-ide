import React, { useState } from 'react'
import tabsStore from '../store/tabsStore'
import QueriesStore from '../store/queriesStore'

function QueriesComponent ({ queries }) {
	const [hoverElementIndex, setHoverElementIndex] = useState(false)
	const { addNewTab, renameCurrentTab } = tabsStore
	const { setQuery } = QueriesStore
	const showDescription = (i1, i2) => i1===i2 ? true : false
	const handleClick = (name, query) => {
		addNewTab(name)
		setQuery(query)
	}

	return (
		queries.map((query, index) => (
			<li className="gallery__query" key={index} > 
				<p  className="gallery__query__body"
					onMouseEnter={() => setHoverElementIndex(index)}
					onMouseLeave={() => setHoverElementIndex(-1)}
					onClick={() => handleClick(query.name, query.query)}
				> 
					{`${query.name}${query.query}`} 
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
