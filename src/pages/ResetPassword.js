import React from 'react'
import { Route, Switch, useRouteMatch } from 'react-router-dom'
import ResetPasswordForm from '../components/ResetPasswordForm'

function ResetPassword() {
	let match = useRouteMatch()
	return (
		<div className="reset">
			<Switch>
				<Route path={`${match.path}/:token`} >
					<ResetPasswordForm />
				</Route>
			</Switch>
		</div>
	)
}

export default ResetPassword
