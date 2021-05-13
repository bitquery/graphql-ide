import React from 'react'
import { Link } from 'react-router-dom'
import { TabsStore, QueriesStore } from '../../store/queriesStore'

function LinkComponent({ propquery }) {
	const { switchTab, tabs } = TabsStore
	const { setQuery, query } = QueriesStore
	const queryUrl = queryUrl => queryUrl ? `${process.env.REACT_APP_IDE_URL}/${queryUrl}` : `${process.env.REACT_APP_IDE_URL}`
	const isSaved = baseQuery => {
		for (let i =0; i<query.length; i++) {
			if (!((('saved' in query[i]) && query[i].saved) || !('saved' in query[i]))) {
				if (baseQuery.id === query[i].id) return false
			}
		}
		return true
	}
	const handleClick = (queryFromGallery) => {
		if (query.map(query => query.id).indexOf(queryFromGallery.id) === -1) {
			let data = {...queryFromGallery, variables: queryFromGallery.arguments}
			
			setQuery(data, queryFromGallery.id)
		} else {
			let tabID = query.map(query => query.id).indexOf(queryFromGallery.id)
			switchTab(tabs[tabID].id)
		}
	}
    return (
        <Link to={queryUrl(propquery.url)} onClick={() => handleClick(propquery)}> 
            {isSaved(propquery) ? propquery.name : `*${propquery.name}`}
        </Link>
    )
}

export default LinkComponent
