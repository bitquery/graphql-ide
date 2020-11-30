import { observer } from 'mobx-react-lite'
import React, { useEffect, useState } from 'react'
import { useCallback } from 'react'
import { useHistory, useRouteMatch } from 'react-router-dom'
import { getQuery } from '../api/api'
import {TabsStore, QueriesStore} from '../store/queriesStore'
import handleState from '../utils/handleState'
import useEventListener from '../utils/useEventListener'

const TabsComponent = observer(() => {
	const history = useHistory()
	const { url } = useRouteMatch()
	const { tabs, currentTab, switchTab, index } = TabsStore
	const match = useRouteMatch(`${url}/:queryurl`)
	const { setQuery, removeQuery, query, updateQuery, currentQuery } = QueriesStore
	const [editTabName, setEditTabName] = useState(false)
	const [queryName, setQueryName] = useState({})

	useEffect(() => {
		async function updateTabs() {
			if (match) {
				const { data } = await getQuery(match.params.queryurl)
				if (typeof data === 'object') {
					if (query.map(query=>query.id).indexOf(data.id) === -1) {
						setQuery({...data, variables: data.arguments}, data.id)
						setQueryName({[currentTab]: data.name})
					}
				} 
			}
		}
		updateTabs()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])
	const editTabNameHandler = useCallback(({key}) => {
		if (key==='Enter') {
			setEditTabName(prev=>prev?!prev:prev)
			updateIfNeeded()
		} else if (key==='Escape') {
			setEditTabName(prev=>prev?!prev:prev)
			setQueryName({[currentTab]: tabs[index].name})
		}
	}, [setEditTabName, currentTab, queryName])
	useEventListener('keyup', editTabNameHandler)	
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
	const addNewTabHandler = () => {
		setQuery({query: '', variables: '{}', name: 'New Query', endpoint_url: currentQuery.endpoint_url})
	}
	const removeTabHandler = (index, event) => {
		event.stopPropagation()
		removeQuery(index)
	}
	const updateIfNeeded = () => {
		if (editTabName && queryName[currentTab] && queryName[currentTab].length) {
			queryName[currentTab]!==query[index].name && updateQuery({name: queryName[currentTab]}, index)
		}
	}
	const renameQueryHandler = () => {
		setEditTabName((prev)=>!prev)
		updateIfNeeded()
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
											<i className="fas fa-check" onClick={renameQueryHandler}/>
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
