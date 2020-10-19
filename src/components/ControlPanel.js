import React from 'react'
import TabsComponent from './TabsComponent'
import Profile from './Profile'

function ControlPanel({ user, setUser }) {
	return (
		<div className="controlpanel">
			<TabsComponent />
			<Profile user={user} setUser={setUser}  />
		</div>
	)
}

export default ControlPanel
