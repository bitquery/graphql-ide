import React, { useState } from 'react'
import { useHistory, useRouteMatch } from 'react-router-dom'
import {TabsStore, QueriesStore} from '../store/queriesStore'
import copy from 'copy-to-clipboard'

function QueriesComponent ({ queries }) {
	const { url } = useRouteMatch()
	const history = useHistory()
	const [hoverElementIndex, setHoverElementIndex] = useState(false)
	const { addNewTab, switchTab, tabs } = TabsStore
	const { setQuery, setCurrentQuery, query } = QueriesStore
	const showDescription = (i1, i2) => i1===i2 ? true : false
	const handleClick = (queryFromGallery) => {
		history.push(`${url}/${queryFromGallery.url}`)
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
			<li className="list-group-item" key={index} > 
				<div className="gallery__query__wrapper flex">
					<a  className="text-default"
						onMouseEnter={() => setHoverElementIndex(index)}
						onMouseLeave={() => setHoverElementIndex(-1)}
						onClick={() => handleClick(query)}
					> 
						{query.name} 
					</a>
					{
						query.url &&
						<button type="button" class="btn btn-sm btn-outline-primary"
							onClick={()=>copy(`${window.location.protocol}://${window.location.host}${url}/${query.url}`)}
						>
							Get link
							<span className="shared-link"></span>
						</button>
					}
				</div>
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
