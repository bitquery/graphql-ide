import React from 'react'
import './App.scss'
import { CustomGraphiql } from './components/CustomGraphiql'
import RegisterWindow from './components/modal/RegisterWindow'
import SaveQueryWindow from './components/modal/SaveQueryWindow'
import ControlPanel from './components/ControlPanel'
import PasswordReset from './pages/ChangePassword'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import ResetPassword from './pages/ResetPassword'
import GalleryComponent from './components/GalleryComponent'

function App() {
	return (
		<div className="App">
			<BrowserRouter>
				<RegisterWindow />
				<SaveQueryWindow />
				<Switch>
					<Route path="/reset" >
						<ResetPassword />
					</Route>
					<Route path="/changepwd" >
						<PasswordReset />
					</Route>
					<Route path={['/:queryurl', '/']} >
						<ControlPanel />
						<div className="content flex">
							<GalleryComponent />
							<CustomGraphiql />
						</div>
					</Route>
				</Switch>
			</BrowserRouter>
		</div>
	)
}

export default App;
