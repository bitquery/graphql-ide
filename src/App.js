import React from 'react'
import './App.scss'
import ModalWindow from './components/modal/ModalWindow'
import ControlPanel from './components/ControlPanel'
import { Route, Switch, useRouteMatch } from 'react-router-dom'
import ResetPassword from './pages/ResetPassword'
import GalleryComponent from './components/GalleryComponent'
import { useEffect, useState } from 'react'
import { QueriesStore, TabsStore } from './store/queriesStore'
import { GraphqlExplorer } from './components/GraphqlExplorer'
import useDebounce from './utils/useDebounce'
import { observer } from 'mobx-react-lite'
import { 
	getIntrospectionQuery, 
	buildClientSchema, 
	} from 'graphql'
import QueryBuilder from './components/QueryBuilder/index'
import { makeDefaultArg, getDefaultScalarArgValue } from "./components/Explorer/CustomArgs"

if (process.env.NODE_ENV === 'development') {
	require('@welldone-software/why-did-you-render')(React, {
	  trackAllPureComponents: true,
	  exclude: [/^Explorer/, /^RootView/, 
		/^FieldView/, /^ArgView/, 
		/^AbstractArgView/, /^InputArgView/, 
		/^AbstractArgView/, /^ScalarInput/]
	});
  }

const App = observer(function App() {
	const { path } = useRouteMatch()
	const { query, currentQuery, updateQuery, showGallery, showSideBar, toggleSideBar, toggleGallery } = QueriesStore
	const { index } = TabsStore
	const [schema, setSchema] = useState(null)
	const [loading, setLoading] = useState(false)
	const debouncedURL = useDebounce(currentQuery.endpoint_url, 500)
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
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])
	const fetcher = (graphQLParams) => {
		return fetch(
			currentQuery.endpoint_url,
			{
				method: 'POST',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(graphQLParams),
				credentials: 'same-origin',
			},
		)
	}
	useEffect(() => {
			const fetchSchema = () => {
				setLoading(true)
				let introspectionQuery = getIntrospectionQuery()
				let staticName = 'IntrospectionQuery'
				let introspectionQueryName = staticName
				let graphQLParams = {
					query: introspectionQuery,
					operationName: introspectionQueryName,
				}
				fetcher(graphQLParams)
				.then(data => data.json())	
				.then(result => {
					if (typeof result !== 'string' && 'data' in result) {
						let schema = buildClientSchema(result.data)
						setSchema(schema)
					}
					setLoading(false)
				}).catch(e => {})
			}
			fetchSchema() 
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [debouncedURL])
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
							{showSideBar && <GalleryComponent schema={schema} />}
							<GraphqlExplorer schema={schema} loading={loading} setLoading={setLoading} />
						</div>
					</Route>
				</Switch>
		</div>
	)
})

export default App;
