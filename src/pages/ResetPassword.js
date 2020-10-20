import React, { useState } from 'react'
import axios from 'axios'
import { Route, Switch, useRouteMatch } from 'react-router-dom'
import { useToasts } from 'react-toast-notifications'
import ResetPasswordForm from '../components/ResetPasswordForm'

function ResetPassword() {
	const [email, setEmail] = useState('')
	let match = useRouteMatch()
	const { addToast } = useToasts()
	const style = {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center'
	}
	const sendPasswordResetLink = async e => {
		e.preventDefault()
		try {
			const { data } = await axios.post('/api/forgot', { email })
			addToast(data, { appearance: 'success' })
		} catch (e) {
			addToast(e.response.data, { appearance: 'error' })
		}
	}

	return (
		
		<div className="reset">
			<Switch>
				<Route path={`${match.path}/:token`} >
					<ResetPasswordForm />
				</Route>
				<Route path={`${match.path}`} >
					<form style={style} onSubmit={sendPasswordResetLink} className="reset__form" >
						<h2>Enter your email</h2>
						<p className="p-modal">Email</p>
						<input type="text" className="query__save" value={email} onChange={e => setEmail(e.target.value)} />  
						<button className="button button_filled" type="submit">GO</button>
					</form>
				</Route>
			</Switch>
		</div>
	)
}

export default ResetPassword
