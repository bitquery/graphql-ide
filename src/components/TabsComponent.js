import { observer } from 'mobx-react-lite'
import React, { useEffect, useState } from 'react'
import { useHistory, useRouteMatch } from 'react-router-dom'
import { getQuery } from '../api/api'
import {TabsStore, QueriesStore} from '../store/queriesStore'
import { useToasts } from 'react-toast-notifications'
import copy from 'copy-to-clipboard'

const TabsComponent = observer(() => {
	const history = useHistory()
	const { url } = useRouteMatch()
	const { tabs, currentTab, switchTab, removeTab } = TabsStore
	const match = useRouteMatch(`${url}/:queryurl`)
	const { setQuery, removeQuery, query, updateQuery } = QueriesStore
	const { addToast } = useToasts()
	const [editTabName, setEditTabName] = useState(false)
	const [queryName, setQueryName] = useState('')

	useEffect(() => {
		async function updateTabs() {
			if (match) {
				const { data } = await getQuery(match.params.queryurl)
				if (typeof data === 'object') {
					if (query.map(query=>query.id).indexOf(data.id) === -1) {
						setQuery(data, data.id)
					}
				} 
			}
		}
		updateTabs()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])
	const switchTabHandler = (tabid) => {
		switchTab(tabid)
		let id = tabs.map(tab => tab.id).indexOf(tabid)
		query[id].url ? history.push(`${url}/${query[id].url}`) : history.push(`${url}`)
		setQueryName('')
	}
	const addNewTabHandler = (e) => {
		e.preventDefault()
		setQuery({query: '', variables: '{}', name: 'New Query'})
	}
	const removeTabHandler = (index, event) => {
		removeQuery(index)
		removeTab(index, event)
		setEditTabName(false)
	}
	const getQueryUrl = (index, e) => {
		e.preventDefault()
	 	if (query[index].url) {
			copy(`${window.location.protocol}://${window.location.host}${url}/${query[index].url}`)
			addToast('Query link copied to clipboard!', {appearance: 'success'})
		} else {
			addToast('This query is not shared now', {appearance: 'error'})
		}
	}
	const renameQueryHandler = (i) => {
		setEditTabName((prev)=>!prev)
		if (editTabName && queryName.length) {
			updateQuery({name: queryName}, i)
		}
	}

	return (
		<div className="tabs">
			<ul className="nav nav-tabs" >
				{
					tabs.map((tab, i) => (
						<li 
							className="nav-item" key={i}
							onClick={() => switchTabHandler(tab.id)}
							onContextMenu={e => getQueryUrl(i, e)}
						>
							<a href="# " className={'nav-link '+(currentTab === tab.id && 'active')} key={i}>
								{ (editTabName && currentTab === tab.id) 
									? <input type="text" value={queryName} onChange={e=>setQueryName(e.target.value)} /> 
										: (('saved' in query[i]) && query[i].saved) || !('saved' in query[i])
											? tab.name : `*${tab.name}` }
								<i className={'tab__edit fas fa-pencil-alt '+(currentTab === tab.id && 'tab__edit_active')}
									onClick={()=>renameQueryHandler(i)}
								/>
								<i className="tab__close fas fa-times" onClick={(e) => removeTabHandler(i, e)} />
							</a>
						</li>
					))
				}
				<li 
					className="nav-item"
					onClick={addNewTabHandler}
				><a href="# " className="nav-link"><i className="tab__add fas fa-plus"/></a></li>
			</ul>
		</div>
	)
})

export default TabsComponent
