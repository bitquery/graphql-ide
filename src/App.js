import React from 'react'
import './App.scss'
import { CustomGraphiql } from './components/CustomGraphiql'
import ModalWindow from './components/modal/ModalWindow'
import ControlPanel from './components/ControlPanel'
import { Route, Switch, useRouteMatch } from 'react-router-dom'
import ResetPassword from './pages/ResetPassword'
import GalleryComponent from './components/GalleryComponent'
import { useEffect } from 'react'
import { QueriesStore } from './store/queriesStore'
import { GraphqlExplorer } from './components/GraphqlExplorer'

function App() {
	const { path } = useRouteMatch()
	const { query } = QueriesStore
	useEffect(() => {
		const handleUnload = e => {
			for (let i=0; i<query.length; i++) {
				if ('saved' in query[i] && !query[i].saved) {
					e.preventDefault()
					e.returnValue = ''
				}
			}
		}
		/* window.addEventListener('beforeunload', handleUnload)
		return () => {
			window.removeEventListener('beforeunload', handleUnload)
		} */
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])
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
							<GraphqlExplorer />
							{/* <CustomGraphiql /> */}
						</div>
					</Route>
				</Switch>
		</div>
	)
}

export default App;
