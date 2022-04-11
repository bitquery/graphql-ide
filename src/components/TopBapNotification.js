import { observer } from 'mobx-react-lite'
import React, { useEffect, useState } from 'react'
import { UserStore } from '../store/queriesStore'

const TopBapNotification = observer(function TopBapNotification() {
	const { user } = UserStore
	const [show, setShow] = useState(true)
	useEffect(() => {
		if (sessionStorage.getItem('notificated') === 'true') {
			setShow(false)
		}
	}, [])
	const close = () => {
		setShow(false)
		sessionStorage.setItem('notificated', 'true')
	}
	return (show && user) ? (
		<div className="main_notification">
			<p>We have introduced Points, &nbsp;<a target="_blank" rel="noopener" href="https://community.bitquery.io/t/introducing-points/874">Click here</a>&nbsp; to learn how it will impact your
			billing.</p>
			<i className="handler handler__close fas fa-times" onClick={close} />
		</div>
	) : null
})

export default TopBapNotification
