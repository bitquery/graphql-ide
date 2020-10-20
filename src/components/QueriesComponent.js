import React, { useState } from 'react'
import tabsStore from '../store/tabsStore'

function QueriesComponent({ queries }) {
	const [hoverElementIndex, setHoverElementIndex] = useState(false)
	const { addNewTab, renameCurrentTab } = tabsStore
	const showDescription = (i1, i2) => i1===i2 ? true : false
	const handleClick = name => {
		addNewTab()
		renameCurrentTab(name)
	}

	return (
		queries.map((query, index) => (
			<li className="gallery__query" key={index} > 
				<p  className="gallery__query__body"
					onMouseEnter={() => setHoverElementIndex(index)}
					onMouseLeave={() => setHoverElementIndex(-1)}
					onClick={() => handleClick(query.name)}
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
