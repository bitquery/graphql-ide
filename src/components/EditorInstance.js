import React, { useState, useEffect, useCallback, useRef, useMemo, useReducer } from 'react';
import { observer } from 'mobx-react-lite'
import { toJS } from 'mobx'
import ReactTooltip from 'react-tooltip'
import { generateLink } from '../utils/common'
import { vegaPlugins } from 'vega-widgets'
import { tablePlugin } from 'table-widget'
import { graphPlugins } from '@bitquery/ide-graph'
import { timeChartPlugins } from '@bitquery/ide-charts'
import { tradingView } from '@bitquery/ide-tradingview'
import './bitqueditor/App.scss'
import '@bitquery/ide-graph/dist/graphs.min.css'
import getQueryFacts from '../utils/getQueryFacts'
import GraphqlEditor from './bitqueditor/components/GraphqlEditor'
import {
	visitWithTypeInfo,
	TypeInfo
} from 'graphql'
import { visit } from 'graphql/language/visitor'
import { parse as parseGql } from 'graphql/language'
import JsonPlugin from './bitqueditor/components/JsonWidget'
import CodePlugin from './bitqueditor/components/CodeEditor'
import ToolbarComponent from './bitqueditor/components/ToolbarComponent'
import { TabsStore, QueriesStore, UserStore } from '../store/queriesStore'
import WidgetEditorControls from './bitqueditor/components/WidgetEditorControls'
import QueryErrorIndicator from './QueryErrorIndicator'
import { getLeft, getTop } from '../utils/common'
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"
import Loader from "react-loader-spinner"
import { DocExplorer } from './DocExplorer'
import { FullScreen, useFullScreenHandle } from "react-full-screen"
import FullscreenIcon from './icons/FullscreenIcon'
import { getIntrospectionQuery, buildClientSchema } from 'graphql'
import useDebounce from '../utils/useDebounce'
import WidgetView from './bitqueditor/components/WidgetView'
import { getCheckoutCode } from '../api/api'
import { GalleryStore } from '../store/galleryStore.js';
import CodeSnippetComponent from './CodeSnippetComponent.js';
import { useHistory } from 'react-router-dom';
import { useToasts } from 'react-toast-notifications'
import { createClient } from "graphql-ws"
import { InteractionButton } from './InteractionButton.js';

const queryStatusReducer = (state, action) => {
	let newState = { ...state }
	Object.keys(newState).forEach(status => { newState[status] = status === action })
	return newState
}

const EditorInstance = observer(function EditorInstance({ number }) {
	const { addToast } = useToasts()
	const { tabs, currentTab, index, jsonMode, codeMode } = TabsStore
	const { tagListIsOpen } = GalleryStore
	const { user } = UserStore
	const { query, updateQuery, currentQuery, isMobile,
		setMobile, showSideBar, schema, setSchema, isLoaded, logQuery } = QueriesStore
	const [docExplorerOpen, setDocExplorerOpen] = useState(false)
	const [codeSnippetOpen, setCodeSnippetOpen] = useState(false)
	const [_variableToType, _setVariableToType] = useState(null)
	const [loading, setLoading] = useState(false)
	const [schemaLoading, setSchemaLoading] = useState(false)
	const [errorLoading, setErrorLoading] = useState(false)
	const [error, setError] = useState(null)
	const [queryTypes, setQueryTypes] = useState('')
	const [dataSource, setDataSource] = useState(null)
	const [accordance, setAccordance] = useState(true)
	const [checkoutCode, setCheckOutCode] = useState('')
	const [widgetInstance, setWidgetInstance] = useState(null)
	const [wsClean, setWsClean] = useState(null)
	const [wsClient, setWsClient] = useState(null)
	const [widget, setWidget] = useState(null)
	const debouncedURL = useDebounce(currentQuery.endpoint_url, 500)
	const workspace = useRef(null)
	const overwrap = useRef(null)
	const executeButton = useRef(null)
	const queryEditor = useRef(null)
	const variablesEditor = useRef(null)
	const widgetDisplay = useRef(null)
	const abortController = useRef(null)
	const resultWrapper = useRef(null)

	const [queryStatus, dispatchQueryStatus] = useReducer(queryStatusReducer, {
		readyToExecute: Object.keys(schema).length ? true : false,
		activeFetch: false,
		activeSubscription: false,
		schemaError: false,
		schemaLoading: Object.keys(schema).length ? false : true
	})
	const queryDispatcher = {
		onquerystarted: () => dispatchQueryStatus('activeFetch'),
		onqueryend: () => dispatchQueryStatus('readyToExecute'),
		onsubscribe: () => dispatchQueryStatus('activeSubscription'),
		onerror: (error) => {
			dispatchQueryStatus('readyToExecute')
			setError(error)
		}
	}

	const history = useHistory()

	function HistoryDataSource(payload, queryDispatcher) {

		let callbacks = []
		let cachedData
		let variables = payload.variables
	
		const getNewData = async () => {
			queryDispatcher.onquerystarted()
			try {
				cachedData = cachedData ? cachedData : await fetcher({ ...payload, variables })
				queryDispatcher.onqueryend()
				callbacks.forEach(cb => cb(cachedData, variables))
			} catch (error) {
				queryDispatcher.onerror(error)
			}
		}
	
		this.setCallback = cb => {
			callbacks.push(cb)
		}
	
		this.changeVariables = async deltaVariables => {
			if (deltaVariables) {
				variables = { ...payload.variables, ...deltaVariables }
				cachedData = null
			}
			await getNewData()
		}

		this.getInterval = () => variables.interval
	
		return this
	}

	function SubscriptionDataSource(payload, queryDispatcher) {

		let cleanSubscription, clean, empty
		let callbacks = []
		let variables = payload.variables
	
		const subscribe = () => {
			const currentUrl = currentQuery.endpoint_url.replace(/^http/, 'ws');
			const client = createClient({ url: currentUrl });

			queryDispatcher.onquerystarted()
			cleanSubscription = client.subscribe({ ...payload, variables }, {
				next: ({ data }) => {
					queryDispatcher.onsubscribe()
					callbacks.forEach(cb => cb(data, variables))
				},
				error: error => { 
					queryDispatcher.onerror(error)
				},
				complete: () => {},
			});
				
		} 
	
		this.setCallback = cb => {
			callbacks.push(cb)
		}

		this.setClean = cb => {
			clean = cb
		}

		this.setEmptyWidget = cb => {
			empty = cb
		}
	
		this.changeVariables = async deltaVariables => {
			if (deltaVariables) {
				variables = { ...payload.variables, ...deltaVariables }
				empty()
			}
			this.unsubscribe()
			subscribe()
		}

		this.unsubscribe = () => {
			cleanSubscription && cleanSubscription()
			cleanSubscription = null
			queryDispatcher.onqueryend()
			clean()
		}

		this.getInterval = () => variables.interval
	
		return this
	}

	useEffect(() => {
		if (currentTab === tabs[number].id) window.dispatchEvent(new Event('resize'))
	}, [currentTab, tabs, number])
	const setupExecButtonPosition = () => {
		let execButt = workspace.current.offsetWidth / overwrap.current.offsetWidth
		executeButton.current.setAttribute('style', `left: calc(${execButt * 100}% - 25px);`)
		window.dispatchEvent(new Event('resize'))
	}

	const handleResizer = e => {
		if (e.target && e.target.tagName) {
			if (e.target.tagName === 'IMG') return
		}
		e.preventDefault()
		const onMouseUp = () => {
			overwrap.current.removeEventListener('mousemove', onMouseMove)
			overwrap.current.removeEventListener('mouseup', onMouseUp)
		}
		const onMouseMove = e => {
			if (e.buttons === 0) {
				return onMouseUp()
			}
			const leftSize = e.clientX - getLeft(overwrap.current)
			const editorWidth = workspace.current.clientWidth + widgetDisplay.current.clientWidth
			const rightSize = editorWidth - leftSize
			let flex = leftSize / rightSize
			if (flex >= 0 && isFinite(flex)) workspace.current.setAttribute('style', `flex: ${flex} 1 0%;`)
			setupExecButtonPosition()
		}
		overwrap.current.addEventListener('mousemove', onMouseMove);
		overwrap.current.addEventListener('mouseup', onMouseUp);
	}
	useEffect(() => {
		setupExecButtonPosition()
	}, [docExplorerOpen, codeSnippetOpen])
	const workspaceResizer = e => {
		if (e.target && e.target.className && typeof e.target.className.indexOf === 'function') {
			if (e.target.className.indexOf('workspace__sizechanger') !== 0) return
		}
		e.preventDefault()
		const onMouseUp = () => {
			overwrap.current.removeEventListener('mousemove', onMouseMove)
			overwrap.current.removeEventListener('mouseup', onMouseUp)
		}
		const onMouseMove = e => {
			if (e.buttons === 0) {
				return onMouseUp()
			}
			const topSize = e.clientY - getTop(workspace.current)
			const bottomSize = workspace.current.clientHeight - 75 - topSize
			let flex = bottomSize / topSize
			const widget = document.getElementsByClassName('widget')[number]
			if (flex >= 0) {
				widget && widget.setAttribute('style', `flex: ${flex} 1 0%;`)
				let widgetResizeEvent = new Event('widgetresize')
				window.dispatchEvent(widgetResizeEvent)
			}
		}
		overwrap.current.addEventListener('mousemove', onMouseMove);
		overwrap.current.addEventListener('mouseup', onMouseUp);
	}
	const getQueryTypes = (query) => {
		const typeInfo = new TypeInfo(schema[currentQuery.endpoint_url])
		let typesMap = {}
		const queryNodes = []
		let depth = 0
		let stop = false
		let checkpoint = 0
		let queryLength = 0
		let visitor = {
			enter(node) {
				typeInfo.enter(node)
				if (node.kind === "Field") {
					if (!depth && queryNodes.length) {
						checkpoint = queryNodes.length
						if (currentQuery.data_type === 'flatten') {
							stop = true
							return visitor.BREAK
						}
					}
					if (node.alias) {
						queryNodes.push(node.alias.value)
					} else {
						queryNodes.push(typeInfo.getFieldDef().name)
					}
					if (depth) {
						let arr = queryNodes.filter(node => node.split('.').length === depth)
						let index = queryNodes.indexOf(arr[arr.length - 1])
						let depthLength = depth !== 1 ? index : 0
						if (checkpoint && depthLength <= checkpoint) {
							depthLength += checkpoint
						}
						queryNodes[queryNodes.length - 1] =
							queryNodes[depthLength] + '.' + queryNodes[queryNodes.length - 1]
					}
					if (typeInfo.getType().toString()[0] === '[') {
						if (node.selectionSet.selections.length === 1) {
							queryNodes[queryNodes.length - 1] = `${queryNodes[queryNodes.length - 1]}[0]`
						}
					}
					depth++
					return { ...node, typeInfo: typeInfo.getType() }
				}
			},
			leave(node) {
				if (node.kind === 'Field') {
					let arr = queryNodes.filter(node => node.split('.').length === depth)
					let index = queryNodes.indexOf(arr[arr.length - 1])
					depth--
					if (queryNodes[index] !== undefined) {
						typesMap[queryNodes[index]] = node
					}
					//-------
					if (queryLength <= 1) {
						if (queryNodes[index].includes('.')) queryLength += 1
						if (queryLength > 1) typesMap = { data: { typeInfo: 'FullResponse' }, ...typesMap }
					}
					if (!depth && queryNodes.length) {
						if (currentQuery.data_type === 'flatten') {
							return visitor.BREAK
						}
					}
				}
				typeInfo.leave(node)
			}
		}
		try {
			visit(parseGql(query), visitWithTypeInfo(typeInfo, visitor))
		} catch (e) { }
		if (stop) {
			let flattenModel = {}
			Object.keys(typesMap).forEach((key, i) => {
				if (key === 'data') {
					flattenModel[key] = typesMap[key]
				} else if (['Int', 'String'].some(value => typesMap[key].typeInfo.toString().includes(value))) {
					let flatKey = key.includes('data') ? key : `${key.replace(key.split('.')[0], '').replace('[0]', '')}`
					const splittedKey = flatKey.split('.')
					if (splittedKey.length > 3) {
						flatKey = `${splittedKey[splittedKey.length - 2]}${splittedKey[splittedKey.length - 1]}`
					}
					flatKey = `data.${flatKey.replaceAll('.', '')}`
					flattenModel[flatKey] = { typeInfo: typesMap[key].typeInfo.toString() }
				}
			})
			flattenModel['data.network'] = { typeInfo: 'String' }
			return flattenModel
		}
		return typesMap
	}

	useEffect(() => {
		if (number === index && schema[currentQuery.endpoint_url]) {
			const model = getQueryTypes(query[index].query)
			let keywords = []
			for (const [key, value] of Object.entries(model)) {
				if (value?.name?.value) {
					keywords.push(value.name.value)
				}
			}
			keywords.length && document.querySelector('meta[name="keywords"]').setAttribute('content', [...new Set(keywords)].join(', '))
			setQueryTypes(model)
		}
	}, [schema[currentQuery.endpoint_url]])

	const plugins = useMemo(() => [JsonPlugin, tradingView, ...vegaPlugins, ...graphPlugins, ...timeChartPlugins, tablePlugin], [])
	let indexx = plugins.map(plugin => plugin.id).indexOf(currentQuery.widget_id)
	const WidgetComponent = indexx >= 0 ? plugins[indexx] : plugins[0]

	const getResult = useCallback(async () => {
		if (!user?.id) {
			window.location = `${user?.graphql_admin_url}/auth/login?redirect_to=${window.location.href}`
			return
		}
		const payload = {query: currentQuery.query, variables: JSON.parse(currentQuery.variables)}
		if (currentQuery.query.match(/subscription[^a-zA-z0-9]/gm)) {
			const subscriptionDataSource = new SubscriptionDataSource(payload, queryDispatcher)
			setDataSource({ subscriptionDataSource })
		} else {
			const historyDataSource = new HistoryDataSource(payload, queryDispatcher)
			setDataSource({ historyDataSource })
		}
		// eslint-disable-next-line 
	}, [JSON.stringify(currentQuery), schema[debouncedURL], JSON.stringify(queryTypes), wsClean, widgetInstance, user?.id])

	const editQueryHandler = useCallback(handleSubject => {
		if ('query' in handleSubject) {
			const facts = getQueryFacts(schema[debouncedURL], handleSubject.query)
			if (facts) {
				const { variableToType } = facts
				if ((JSON.stringify(variableToType) !== JSON.stringify(_variableToType))
					&& _variableToType !== null) {
					_setVariableToType(variableToType)
				}
			}
			let queryType = getQueryTypes(handleSubject.query)
			if (JSON.stringify(queryType) !== JSON.stringify(queryTypes)) {
				(typeof queryType === 'object' && Object.keys(queryType).length)
					&& setQueryTypes(queryType)
			}
		}
		if (user && query[index].account_id === user.id) {
			updateQuery({ ...handleSubject, saved: false }, index)
		} else {
			updateQuery({ ...handleSubject, saved: false, url: null, account_id: user.id }, index, null)
		}
		setAccordance(false)
		// eslint-disable-next-line 
	}, [user, schema[debouncedURL], queryTypes, index])
	
	const fetcher = async (graphQLParams) => {
		abortController.current = new AbortController()
		let key = user ? user.key : null
		let keyHeader = { 'X-API-KEY': key }
		const response = await fetch(
			currentQuery.endpoint_url,
			{
				signal: abortController.current.signal,
				method: 'POST',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
					...keyHeader
				},
				body: JSON.stringify(graphQLParams),
				credentials: 'same-origin',
			},
		)
		if (!response.ok) {
			if (response.status === 401) throw new Error("Authorization Required")
			throw new Error(`HTTP Status ${response.status}`)
		}
		if (!('operationName' in graphQLParams)) {
			const graphqlRequested = response.headers.get('X-GraphQL-Requested') === 'true'
			updateQuery({
				graphqlQueryID: response.headers.get('X-GraphQL-Query-ID'),
				graphqlRequested: graphqlRequested,
				points: graphqlRequested ? undefined : 0,
				saved: currentQuery.saved,
				gettingPointsCount: 0
			}, index)
		}
		const { data, errors } = await response.json()
		if (errors) {
			setError(errors[0].message)
		}
		return data
	}
	useEffect(() => {
		if (number === index && user !== null && !(debouncedURL in schema) && debouncedURL) {
			const fetchSchema = async () => {
				dispatchQueryStatus('schemaLoading')
				let introspectionQuery = getIntrospectionQuery()
				let staticName = 'IntrospectionQuery'
				let introspectionQueryName = staticName
				let graphQLParams = {
					query: introspectionQuery,
					operationName: introspectionQueryName,
				}
				try {
					const data = await fetcher(graphQLParams)
					let newSchema = buildClientSchema(data)
					setSchema({ ...schema, [debouncedURL]: newSchema })
					dispatchQueryStatus('readyToExecute')
				} catch (error) {
					const message = /401 Authorization Required/.test(error.message) ? '401 Authorization Required' : error.message
					addToast(message, { appearance: 'error' })
					dispatchQueryStatus('schemaError')
					if (error.message === '401') {
						history.push('/auth/login')
					}
				}
			}
			fetchSchema()
		}
		if (debouncedURL in schema && queryStatus.schemaError) {
			dispatchQueryStatus('readyToExecute')
		}
		// eslint-disable-next-line 
	}, [debouncedURL, user])

	const fullscreenHandle = useFullScreenHandle()

	const getCode = useCallback(async () => {
		let { data } = WidgetComponent.source && await getCheckoutCode(WidgetComponent.source)
		if (WidgetComponent.id === 'tradingview.widget') {
			data = data.replace('createChart', 'LightweightCharts.createChart')
		}
		const id = generateLink(true)
		let renderFunc = WidgetComponent.source ? data.match(/function(.*?)\(/)[1].trim() : WidgetComponent.rendererName
		let dependencies = WidgetComponent.dependencies.map(dep => `<script src="${dep}"></script>`).join('\n')
		return `
${dependencies}
${WidgetComponent.id === 'table.widget' ? '<link href="https://unpkg.com/tabulator-tables@4.9.3/dist/css/tabulator.min.css" rel="stylesheet">' : ''} 
<script src="https://cdn.jsdelivr.net/gh/bitquery/widgets-runtime@v1.0/dataSource.js"></script>
<div style="width: 500px; height: 500px; overflow-y: hidden;" id="${id}"></div>
<script>
	let ds = new dataSourceWidget(\`${currentQuery.query}\`, ${currentQuery.variables}, \`${currentQuery.displayed_data}\`, '${user.key}')
	${data ? data : ''}
	const config = ${JSON.stringify(currentQuery.config)}
	${renderFunc}(ds, config, '${id}')
</script>
		`
		// eslint-disable-next-line 
	}, [WidgetComponent.id, JSON.stringify(currentQuery), user])

	const toggleDocs = () => {
		codeSnippetOpen && setCodeSnippetOpen(false)
		setDocExplorerOpen(prev => !prev)
	}
	const toggleCodeSnippet = () => {
		docExplorerOpen && setDocExplorerOpen(false)
		setCodeSnippetOpen(prev => !prev)
	}

	const abortRequest = () => {
		if (queryStatus.activeSubscription) {
			dataSource.subscriptionDataSource.unsubscribe()
			return
		}
		if (abortController.current) {
			abortController.current.abort()
			dispatchQueryStatus('readyToExecute')
		}
	}

	useEffect(() => {
		if (-resultWrapper.current.scrollTop < resultWrapper.current.scrollHeight*0.9) {
			resultWrapper.current.scrollTop = -resultWrapper.current.scrollHeight
		}
	}, [dataSource?.streamingValues?.length])

	return (
		<div
			className={'graphiql__wrapper ' +
				(currentTab === tabs[number].id ? 'graphiql__wrapper_active' : '')
				+ (!showSideBar ? ' graphiql__wrapper_wide' : '')
				+ (!tagListIsOpen ? ' fullwidth' : '')
			}
		>
			<ToolbarComponent
				number={number}
				queryEditor={queryEditor}
				variablesEditor={variablesEditor}
				docExplorerOpen={docExplorerOpen}
				toggleDocExplorer={toggleDocs}
				toggleCodeSnippet={toggleCodeSnippet}
				codeSnippetOpen={codeSnippetOpen}
			/>
			<div className={'over-wrapper ' + (!currentQuery.layout ? 'active' : '')} ref={overwrap}>
				<ReactTooltip
					place="top"
					border={false}
					borderColor="#fff"
					backgroundColor="#5f5f5f"
					arrowColor="transparent"
					delayShow={750}
				/>

				<button className="execute-button"
					data-tip={(loading || wsClean) ? 'Interrupt' : 'Execute query (Ctrl-Enter)'}
					ref={executeButton}
					disabled={schemaLoading}
					onClick={(queryStatus.activeFetch || queryStatus.activeSubscription) ? abortRequest : getResult}
				>
					<InteractionButton 
						queryStatus={queryStatus}
						accordance={accordance}
					/>
				</button>
				<div className="workspace__wrapper"
					ref={workspace}
					onMouseDown={workspaceResizer}
				>
					{!currentQuery.layout && <GraphqlEditor
						readOnly={!!currentQuery?.url && !!currentQuery.id}
						schema={schema[debouncedURL]}
						query={query[number].query}
						number={number}
						variables={query[number].variables}
						variableToType={_variableToType}
						onRunQuery={getResult}
						onEditQuery={editQueryHandler}
						onEditVariables={editQueryHandler}
						ref={{
							ref1: queryEditor,
							ref2: variablesEditor
						}}
					/>}
					<div className="workspace__sizechanger" />
					<WidgetEditorControls
						abortRequest={abortRequest}
						getResult={getResult}
						model={queryTypes}
						dataSource={dataSource}
						setDataSource={setDataSource}
						name={WidgetComponent.name}
						plugins={plugins}
						number={number}
					/>
					<div className="widget">
						<CodePlugin.renderer 
							values={currentQuery.config}
							pluginIndex={0}
							setWidget={setWidget}
						/>
					</div>
				</div>
				<div className={'widget-display widget-display-wrapper position-relative' +
					(isMobile ? ' widget-display-wrapper-fullscreen' : '')}
					ref={widgetDisplay}
					style={{backgroundColor: '#f6f7f8'}}
				>
					<div
						className="sizeChanger"
						onMouseDown={handleResizer}
					>
					</div>
					<div className="flex flex-column w-100 pl-4 result-wrapper pt-4" ref={resultWrapper}>
						{queryStatus.activeFetch && <Loader
							className="view-loader"
							type="Oval"
							color="#3d77b6"
							height={100}
							width={100}
						/>}
						{queryStatus.activeSubscription && <div className="blinker-wrapper d-flex align-items-center text-success text-right mr-5">
							<span className="d-none d-sm-inline">Live </span><div className="blink blnkr bg-success"></div>
						</div>}
						<QueryErrorIndicator
							error={error}
							removeError={setError}
						/>
						<FullScreen className="widget-display" handle={fullscreenHandle}>
							<WidgetView
								widget={widget}
								dataSource={dataSource}
							>
								<FullscreenIcon onClick={
									isMobile ? () => setMobile(false) :
										fullscreenHandle.active
											? fullscreenHandle.exit
											: fullscreenHandle.enter}
								/>
							</WidgetView>
						</FullScreen>
					</div>
				</div>
				{docExplorerOpen && <DocExplorer schema={schema[debouncedURL]} />}
				{codeSnippetOpen && <CodeSnippetComponent />}
			</div>
		</div>
	)
})

export default EditorInstance
