import React from 'react'
import TabsComponent from './TabsComponent'
import Profile from './Profile'
// import modal from '../store/modalStore'

function ControlPanel({ tabs, currentTab, setCurrentTab, setTabs, user, setUser }) {
	return (
		<div className="controlpanel">
			<TabsComponent
				tabs={tabs}
				currentTab={currentTab}
				setCurrentTab={setCurrentTab}
				setTabs={setTabs}
			/>
			<Profile user={user} setUser={setUser}  />
		</div>
	)
}

export default ControlPanel
