import React, { useEffect, useState } from 'react'

function TopBapNotification() {
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
	return show ? (
		<div className="main_notification">
			We have introduced Points, &nbsp;<a target="_blank" rel="noopener" href="https://community.bitquery.io/t/introducing-points/874">Click here</a>&nbsp; to learn how it will impact your
			billing.
			<i className="handler handler__close fas fa-times" onClick={close} />
		</div>
	) : null
}

export default TopBapNotification
