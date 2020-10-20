import React, { useState, useEffect } from 'react'
import './App.scss'
import { CustomGraphiql } from './components/CustomGraphiql'
import RegisterWindow from './components/modal/RegisterWindow'
import SaveQueryWindow from './components/modal/SaveQueryWindow'
import { getUser } from './api/api'
import ControlPanel from './components/ControlPanel'
import PasswordReset from './pages/ChangePassword'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import RegisterAccount from './pages/RegisterAccount'
import ResetPassword from './pages/ResetPassword'
import GalleryComponent from './components/GalleryComponent'

function App() {
	const [user, setUser] = useState(null)

	const getMyUser = async () => {
		try {
			const { data } = await getUser()
			setUser(data.user[0])
		} catch (e) { console.log(e.response.data) } 
	}
	useEffect(() => {
		getMyUser()
	}, [])

	return (
		<div className="App">
			<BrowserRouter>
				<RegisterWindow getUser={getMyUser} />
				<SaveQueryWindow user={user} />
				<Switch>
					<Route path="/reset" >
						<ResetPassword />
					</Route>
					<Route path="/register" >
						<RegisterAccount />
					</Route>
					<Route path="/changepwd" >
						<PasswordReset />
					</Route>
					<Route path={['/:query', '/']} >
						<ControlPanel 
							user={user} setUser={setUser}
						/>
						<div className="content flex">
							<GalleryComponent user={user} />
							<CustomGraphiql user={user} />
						</div>
					</Route>
				</Switch>
			</BrowserRouter>
		</div>
	)
}

export default App;
