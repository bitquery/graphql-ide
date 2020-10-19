import React, { useState, useEffect } from 'react'
import './App.scss'
import { CustomGraphiql } from './components/CustomGraphiql'
import RegisterWindow from './components/modal/RegisterWindow'
import SaveQueryWindow from './components/modal/SaveQueryWindow'
import axios from 'axios'
import { getUser } from './api/api'
import { generateLink } from './utils/common'
import ControlPanel from './components/ControlPanel'
import PasswordReset from './components/ChangePassword'
import { BrowserRouter, Route, Switch } from 'react-router-dom'

function App() {
	const [user, setUser] = useState(null)
	const [queries, setQueries] = useState(null)

	// const notify = message => toast(message)
	/* const params = () => {
		let params = {
			account_id: user.id,
			query: currentQuery,
			arguments: 'arguments',
			// name: query_name || null,
			// description: query_description || null
		}
		return {
			value: () => params,
			withUrl: () => {
				params.url = this.link = generateLink()
				return params
			}
		}
	} */
	const getMyUser = async () => {
		try {
			const { data } = await getUser()
			setUser(data.user[0])
		} catch (e) { console.log(e.response.data) } 
	}
	useEffect(() => {
		getMyUser()
		async function getQueries() {
			try {
				const { data } = await axios.get('/api/getqueries')
				setQueries(data)
			} catch (e) { console.log(e) }
		}
		getQueries()
	}, [])

	return (
		<div className="App">
			<BrowserRouter>
				<Switch>
					<Route path="/changepwd" >
						<PasswordReset />
					</Route>
					<Route path="/">
						<RegisterWindow getUser={getMyUser} />
						<SaveQueryWindow />
						<ControlPanel 
							user={user} setUser={setUser}
						/>
						<CustomGraphiql />
					</Route>
				</Switch>
			</BrowserRouter>
		</div>
	)
}

export default App;
