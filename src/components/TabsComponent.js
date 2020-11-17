import { observer } from 'mobx-react-lite'
import React, { useEffect, useState } from 'react'
import { useHistory, useRouteMatch } from 'react-router-dom'
import { getQuery } from '../api/api'
import {TabsStore, QueriesStore} from '../store/queriesStore'
import handleState from '../utils/handleState'

const TabsComponent = observer(() => {
	const history = useHistory()
	const { url } = useRouteMatch()
	const { tabs, currentTab, switchTab, removeTab } = TabsStore
	const match = useRouteMatch(`${url}/:queryurl`)
	const { setQuery, removeQuery, query, updateQuery } = QueriesStore
	const [editTabName, setEditTabName] = useState(false)
	const [queryName, setQueryName] = useState({})

	useEffect(() => {
		async function updateTabs() {
			if (match) {
				const { data } = await getQuery(match.params.queryurl)
				if (typeof data === 'object') {
					if (query.map(query=>query.id).indexOf(data.id) === -1) {
						setQuery(data, data.id)
						setQueryName({[currentTab]: data.name})
					}
				} 
			}
		}
		updateTabs()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])
	useEffect(() => {
		setEditTabName(false)
		setQueryName(handleState({...queryName}) || {[currentTab]: 'New Query'})
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [tabs.length])
	const handleEdit = e => setQueryName({...queryName, [currentTab]: e.target.value})
	const switchTabHandler = (tabid) => {
		switchTab(tabid)
		let id = tabs.map(tab => tab.id).indexOf(tabid)
		query[id].url ? history.push(`${url}/${query[id].url}`) : history.push(`${url}`)
		setEditTabName(false)
	}
	const addNewTabHandler = (e) => {
		e.preventDefault()
		setQuery({query: '', variables: '{}', name: 'New Query'})
	}
	const removeTabHandler = (index, event) => {
		removeQuery(index)
		removeTab(index, event)
	}
	const renameQueryHandler = (tabID, i) => {
		setEditTabName((prev)=>!prev)
		if (editTabName && queryName[tabID] && queryName[tabID].length) {
			queryName[tabID]!==query[i].name && updateQuery({name: queryName[tabID]}, i)
		}
	}

	return (
		<div className="tabs">
			<ul className="nav nav-tabs" >
				{
					tabs.map((tab, i) => (
						<li 
							className="nav-item" key={i}
							onClick={() => currentTab !== tab.id && switchTabHandler(tab.id)}
						>
							<a href="# " className={'nav-link '+(currentTab === tab.id && 'active')} key={i}>
								{
								(editTabName && currentTab === tab.id) 
									? 	<>
											<input type="text" 
												value={queryName ? queryName[currentTab] : 'New Query'} 
												className="tabs__edit"
												onChange={handleEdit}
											/>
											<i className="fas fa-check" onClick={()=>renameQueryHandler(currentTab, i)}/>
										</>
									: 	<span className={currentTab === tab.id ? 'cursor-edit' : undefined}
											onClick={()=>currentTab === tab.id && renameQueryHandler(currentTab, i)}
										>
											{(('saved' in query[i]) && query[i].saved) || !('saved' in query[i]) 
											? tab.name : `*${tab.name}`}
										</span>
								}
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
