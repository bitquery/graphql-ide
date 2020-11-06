import React from 'react'
import './App.scss'
import { CustomGraphiql } from './components/CustomGraphiql'
import ModalWindow from './components/modal/ModalWindow'
import ControlPanel from './components/ControlPanel'
import { Route, Switch, useRouteMatch } from 'react-router-dom'
import ResetPassword from './pages/ResetPassword'
import GalleryComponent from './components/GalleryComponent'

function App() {
	const { path } = useRouteMatch()
	return (
		<div className="App">
				<Switch>
					<Route path={`${path}/reset`} >
						<ResetPassword />
					</Route>
					<Route path={['/:queryurl', '/']} >
						<ModalWindow />
						<ControlPanel />
						<div className="content flex">
							<GalleryComponent />
							<CustomGraphiql />
						</div>
					</Route>
				</Switch>
		</div>
	)
}

export default App;
