import { observer } from 'mobx-react-lite'
import React, { useEffect } from 'react'
import { useRouteMatch } from 'react-router-dom'
import { getQuery } from '../api/api'
import {TabsStore, QueriesStore} from '../store/queriesStore'
import { useToasts } from 'react-toast-notifications'
import copy from 'copy-to-clipboard'

const TabsComponent = observer(() => {
	const { tabs, currentTab, switchTab, removeTab, addNewTab } = TabsStore
	const match = useRouteMatch('/graphqlide/:queryurl')
	const { setCurrentQuery ,setQuery, removeQuery, query } = QueriesStore
	const { addToast } = useToasts()

	useEffect(() => {
		async function updateTabs() {
			if (match) {
				const { data } = await getQuery(match.params.queryurl)
				if (typeof data === 'object') {
					const params = {
						query: data.query,
						variables: data.arguments,
						url: data.url
					}
					setQuery(params, data.id)
					addNewTab(data.name)
				} 
			}
		}
		updateTabs()
	}, [])
	const addNewTabHandler = () => {
		addNewTab('New Tab')
		setQuery({query: '{}', variables: '{}'})
		setCurrentQuery({query: '{}', variables: '{}'})
	}
	const removeTabHandler = (index, event) => {
		removeQuery(index)
		removeTab(index, event)
	}
	const getQueryUrl = (index, e) => {
		e.preventDefault()
	 	if (query[index].url) {
			copy(`${window.location.protocol}://${window.location.host}/graphqlide/${query[index].url}`)
			addToast('Query link copied to clipboard!', {appearance: 'success'})
		} else {
			addToast('This query is not shared now', {appearance: 'error'})
		}
	}

	return (
		<div className="tabs">
			<ul>
				{
					tabs.map((tab, i) => (
						<li 
							className={(currentTab === tab.id ? 'active' : '')} key={i}
							onClick={() => switchTab(tab.id)}
							onContextMenu={e => getQueryUrl(i, e)}
						>
							{ tab.name }
							<span 
								className="tab__close"
								onClick={(e) => removeTabHandler(i, e)}
							/> 
						</li>
					))
				}
				<li 
					className="tabs__add"
					onClick={addNewTabHandler}
				><span className="tab__add" /></li>
			</ul>
		</div>
	)
})

export default TabsComponent
