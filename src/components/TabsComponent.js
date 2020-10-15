import React, { useEffect } from 'react'

function TabsComponent({tabs, currentTab, setCurrentTab, setTabs}) {

	useEffect(() => {
		tabs.length === 0 && addNewTab()
		setCurrentTab( tabs[tabs.length-1] )
		console.log('render')
	}, [tabs])

	const switchTab = tab => {
		setCurrentTab(tab)
	}
	const removeTab = (index, event) => {
		event.stopPropagation()
		setTabs(tabs.filter((tab, i) => i !== index))
		setCurrentTab( tabs[index+1] || tabs[0] || '1' )
	}
	const addNewTab = () => {
		setTabs([...tabs, +tabs[tabs.length-1]+1 || '1'])
		
	}

	return (
		<div className="tabs">
			<ul>
				{
					tabs.map((tab, i) => (
						<li 
							className={(currentTab == tab ? 'active' : '')} key={i}
							onClick={() => switchTab(tab)}
						>
							{ tab }
							<span 
								className="tab__close"
								onClick={(e) => removeTab(i, e)}
							/> 
						</li>
					))
				}
				<li 
					className="tabs__add"
					onClick={addNewTab}
				><span className="tab__add" /></li>
			</ul>
		</div>
	)
}

export default TabsComponent
