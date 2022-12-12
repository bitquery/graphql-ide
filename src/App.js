import React from 'react'
import './App.scss'
import ModalWindow from './components/modal/ModalWindow'
import ControlPanel from './components/ControlPanel'
import { Route, Switch } from 'react-router-dom'
import ResetPassword from './pages/ResetPassword'
import GalleryComponent from './components/GalleryComponent'
import { useEffect } from 'react'
import { QueriesStore } from './store/queriesStore'
import { GraphqlExplorer } from './components/GraphqlExplorer'
import { observer } from 'mobx-react-lite'
import 'react-grid-layout/css/styles.css'
import NewGallery from "./components/Gallery/NewGallery"
import QueriesList from "./components/Gallery/QueriesList"
import { GalleryStore } from './store/galleryStore'
import TabsComponent from './components/TabsComponent'
import ExploreComponent from './components/ExploreComponent'

if (process.env.NODE_ENV === 'development') {
	/* require('@welldone-software/why-did-you-render')(React, {
	  trackAllPureComponents: true,
	  exclude: [/^Explorer/, /^RootView/, 
		/^FieldView/, /^ArgView/, 
		/^AbstractArgView/, /^InputArgView/, 
		/^AbstractArgView/, /^ScalarInput/]
	}); */
  }

const App = observer(function App() {
	const { query, showSideBar } = QueriesStore
	const { tagListIsOpen } = GalleryStore
	useEffect(() => {
		const handleUnload = e => {
			for (let i=0; i<query.length; i++) {
				if ('saved' in query[i] && !query[i].saved) {
					e.preventDefault()
					e.returnValue = ''
				}
			}
		}
		window.addEventListener('beforeunload', handleUnload)
		return () => {
			window.removeEventListener('beforeunload', handleUnload)
		}
		// eslint-disable-next-line 
	}, [])
	
	return (
		<div className="App">
			<ControlPanel />
			<ModalWindow />
			<Switch>
				<Route path={`${process.env.REACT_APP_IDE_URL}/reset`} >
					<ResetPassword />
				</Route>
				<Route exact path={`${process.env.REACT_APP_IDE_URL}/explore`} >
					<ExploreComponent />
				</Route>
				<Route exact path={`${process.env.REACT_APP_IDE_URL}/myqueries`} >
					<ExploreComponent />
				</Route>
				<Route exact path={`${process.env.REACT_APP_IDE_URL}/team`} >
					<ExploreComponent />
				</Route>
				<Route path={[`${process.env.REACT_APP_IDE_URL}/:queryurl`, `${process.env.REACT_APP_IDE_URL}`]} >
					<TabsComponent />
					<div className="content flex">
						{tagListIsOpen && <NewGallery />}
						<GraphqlExplorer />
					</div>
				</Route>
			</Switch>
		</div>
	)
})

export default App;
