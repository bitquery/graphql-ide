import { observer } from 'mobx-react-lite'
import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getQuery } from '../api/api'
import queriesStore from '../store/queriesStore'
import tabsStore from '../store/tabsStore'

const TabsComponent = observer(() => {
	const { tabs, currentTab, switchTab, removeTab, addNewTab, renameCurrentTab } = tabsStore
	const { query } = useParams()
	const { setCurrentQuery, setQuery, removeQuery } = queriesStore

	useEffect(() => {
		async function updateTabs() {
			if (query) {
				const { data } = await getQuery(query)
				setQuery(data.query)
				addNewTab(data.name)
				setCurrentQuery(data.query)
			}
		}
		updateTabs()
	}, [])
	const addNewTabHandler = () => {
		addNewTab('New Tab')
		setQuery('{}')
	}
	const removeTabHandler = (index, event) => {
		removeQuery(index)
		removeTab(index, event)
	}

	return (
		<div className="tabs">
			<ul>
				{
					tabs.map((tab, i) => (
						<li 
							className={(currentTab === tab.id ? 'active' : '')} key={i}
							onClick={() => switchTab(tab.id)}
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
