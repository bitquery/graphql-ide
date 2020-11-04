import { observer } from 'mobx-react-lite'
import React, { useEffect } from 'react'
import { useHistory, useRouteMatch } from 'react-router-dom'
import { getQuery } from '../api/api'
import {TabsStore, QueriesStore} from '../store/queriesStore'
import { useToasts } from 'react-toast-notifications'
import copy from 'copy-to-clipboard'

const TabsComponent = observer(() => {
	const history = useHistory()
	const { url } = useRouteMatch()
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
	const switchTabHandler = (tabid) => {
		switchTab(tabid)
		let id = tabs.map(tab => tab.id).indexOf(tabid)
		query[id].url ? history.push(`${url}/${query[id].url}`) : history.push(`${url}`)
	}
	const addNewTabHandler = (e) => {
		e.preventDefault()
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
			copy(`${window.location.protocol}://${window.location.host}${url}/${query[index].url}`)
			addToast('Query link copied to clipboard!', {appearance: 'success'})
		} else {
			addToast('This query is not shared now', {appearance: 'error'})
		}
	}

	return (
		<div className="tabs">
			<ul className="nav nav-tabs" >
				{
					tabs.map((tab, i) => (
						<li 
							// className={(currentTab === tab.id ? 'active' : '')} key={i}
							className="nav-item" key={i}
							onClick={() => switchTabHandler(tab.id)}
							onContextMenu={e => getQueryUrl(i, e)}
						>
							<a href="#" className={'nav-link '+(currentTab === tab.id ? 'active' : '')} key={i}>{ tab.name }
							<span 
								className="tab__close"
								onClick={(e) => removeTabHandler(i, e)}
							/> 
							</a>
							
						</li>
					))
				}
				<li 
					className="nav nav-tabs"
					onClick={addNewTabHandler}
				><a href="" className="nav-link active"><span className="tab__add" /></a></li>
			</ul>
		</div>
	)
})

export default TabsComponent
