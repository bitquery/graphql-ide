import React, { useState } from 'react'
import axios from 'axios'
import { Route, Switch, useHistory, useRouteMatch } from 'react-router-dom'
import { useToasts } from 'react-toast-notifications'
import ResetPasswordForm from '../components/ResetPasswordForm'
import logo from '../assets/images/bitquery_logo.png'

function ResetPassword() {
	const [email, setEmail] = useState('')
	let match = useRouteMatch()
	const { addToast } = useToasts()
	let history = useHistory()
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
					<img className="logo" src={logo} alt="Logo" onClick={() => history.push('/')} />
					<ResetPasswordForm />
				</Route>
				<Route path={`${match.path}`} >
					<img className="logo" src={logo} alt="Logo" onClick={() => history.push('/')} />
					<form style={style} onSubmit={sendPasswordResetLink} className="reset__form" >
						<h2>Forgot password</h2>
						<p>Enter your email below and reset password instruction will be sent </p>
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
