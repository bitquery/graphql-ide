import { observer } from 'mobx-react-lite'
import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getQuery } from '../api/api'
import {TabsStore, QueriesStore} from '../store/queriesStore'
import { useToasts } from 'react-toast-notifications'
import copy from 'copy-to-clipboard'

const TabsComponent = observer(() => {
	const { tabs, currentTab, switchTab, removeTab, addNewTab, renameCurrentTab } = TabsStore
	const { queryurl } = useParams()
	const { setQuery, removeQuery, query } = QueriesStore
	const { addToast } = useToasts()

	useEffect(() => {
		async function updateTabs() {
			if (queryurl) {
				const { data } = await getQuery(queryurl)
				const params = {
					query: data.query,
					variables: data.arguments,
					url: data.url
				}
				setQuery(params, data.id)
				addNewTab(data.name)
			}
		}
		updateTabs()
	}, [])
	const addNewTabHandler = () => {
		addNewTab('New Tab')
		setQuery({query: '{}', variables: '{}'})
	}
	const removeTabHandler = (index, event) => {
		removeQuery(index)
		removeTab(index, event)
	}
	const getQueryUrl = (index, e) => {
		e.preventDefault()
	 	if (query[index].url) {
			copy(`http://${window.location.host}/${query[index].url}`)
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
