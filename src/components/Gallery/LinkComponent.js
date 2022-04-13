import React from 'react'
import { Link, useHistory } from 'react-router-dom'
import { TabsStore, QueriesStore } from '../../store/queriesStore'

function LinkComponent({ propquery, as }) {
	const { switchTab, tabs } = TabsStore
	const { setQuery, query } = QueriesStore
	const history = useHistory()
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
	const menu = (props) => {
		return (
			<div onClick={() => {props.onClick(); history.push(props.to)}}>
				Open query
			</div>
		)
	}
	const props = {
		to: queryUrl(propquery.url),
		onClick: () => handleClick(propquery)
	}
	if (as === 'menu') props.component = menu
    return (
        <Link {...props}> 
			{isSaved(propquery) ? '' : '*'}{propquery.name}
        </Link>
    )
}

export default LinkComponent
