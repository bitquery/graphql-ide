import React from 'react'
import TabsComponent from './TabsComponent'
import ProfileComponent from './ProfileComponent'

function ControlPanel() {
	return (
		<div className="controlpanel">
			<TabsComponent />
			<ProfileComponent />
		</div>
	)
}

export default ControlPanel
