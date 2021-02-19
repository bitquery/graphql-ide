import React from 'react'
import TabsComponent from './TabsComponent'
import ProfileComponent from './ProfileComponent'
import {QueriesStore} from '../store/queriesStore'
import { observer } from 'mobx-react-lite'

const ControlPanel = observer(function ControlPanel() {
	const { isMobile } = QueriesStore
	return (
		<div className={'controlpanel ' + (isMobile ? ' controlpanel-fullscreen' : '')}>
			<TabsComponent />
			<ProfileComponent />
		</div>
	)
})

export default ControlPanel
