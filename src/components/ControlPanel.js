import React from 'react'
import TabsComponent from './TabsComponent'
import ProfileComponent from './ProfileComponent'

function ControlPanel({ user, setUser }) {
	return (
		<div className="controlpanel">
			<TabsComponent />
			<ProfileComponent user={user} setUser={setUser}  />
		</div>
	)
}

export default ControlPanel
