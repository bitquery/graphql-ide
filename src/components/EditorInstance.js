import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { observer } from 'mobx-react-lite'
import { toJS } from 'mobx'
import ReactTooltip from 'react-tooltip'
import PlayIcon from './icons/PlayIcon.js'
import { vegaPlugins } from 'vega-widgets'
import { graphPlugins } from '@bitquery/ide-graph'
import { timeChartPlugins } from '@bitquery/ide-charts'
import './bitqueditor/App.scss'
import '@bitquery/ide-graph/dist/graphs.min.css'
import getQueryFacts from '../utils/getQueryFacts'
import GraphqlEditor from './bitqueditor/components/GraphqlEditor'
import { 
	visitWithTypeInfo,
	TypeInfo} from 'graphql'
import { visit } from 'graphql/language/visitor'
import { parse as parseGql } from 'graphql/language'
import JsonPlugin from './bitqueditor/components/JsonWidget'
import ToolbarComponent from './bitqueditor/components/ToolbarComponent'
import { TabsStore, QueriesStore, UserStore } from '../store/queriesStore'
import WidgetEditorControls from './bitqueditor/components/WidgetEditorControls'
import QueryErrorIndicator from './QueryErrorIndicator'
import { getValueFrom, getLeft, getTop } from '../utils/common'
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"
import Loader from "react-loader-spinner"
import { DocExplorer } from './DocExplorer'
import { FullScreen, useFullScreenHandle } from "react-full-screen"
import FullscreenIcon from './icons/FullscreenIcon'
import { getIntrospectionQuery, buildClientSchema } from 'graphql'
import useDebounce from '../utils/useDebounce'


const EditorInstance = observer(function EditorInstance({number})  {
	const { tabs, currentTab, index } = TabsStore
	const { user }  = UserStore
	const { query, updateQuery, currentQuery, isMobile,
		setMobile, showSideBar, schema, setSchema } = QueriesStore
	const [docExplorerOpen, toggleDocExplorer] = useState(false)
	const [_variableToType, _setVariableToType] = useState(null)
	const [loading, setLoading] = useState(false)
	const [queryTypes, setQueryTypes] = useState('')
	const [dataSource, setDataSource] = useState({})
	const [dataModel, setDataModel] = useState('')
	const [accordance, setAccordance] = useState(true)
	const debouncedURL = useDebounce(currentQuery.endpoint_url, 500)
	const workspace = useRef(null)
	const overwrap = useRef(null)
	const executeButton = useRef(null)
	const queryEditor = useRef(null)
	const variablesEditor = useRef(null)
	const widgetDisplay = useRef(null)

	const setupExecButtonPosition = () => {
		let execButt = workspace.current.offsetWidth / overwrap.current.offsetWidth
		executeButton.current.setAttribute('style', `left: calc(${execButt*100}% - 25px);`)
		window.dispatchEvent(new Event('resize'))
	}
	useEffect(() => {
		dataModel && setDataModel('')
		if (queryTypes && currentQuery.displayed_data) {
			for (let node in queryTypes) {
				node.includes(currentQuery.displayed_data) &&
					setDataModel(prev => {return {...prev, [node]: queryTypes[node]}})
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [queryTypes, currentQuery.displayed_data])
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
	}, [docExplorerOpen])
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
				widget.setAttribute('style', `flex: ${flex} 1 0%;`)
				let widgetResizeEvent = new Event('widgetresize')
				window.dispatchEvent(widgetResizeEvent)
			}
		}
		overwrap.current.addEventListener('mousemove', onMouseMove);
    	overwrap.current.addEventListener('mouseup', onMouseUp);
	}
	const getQueryTypes = (query) => {
		const typeInfo = new TypeInfo(schema)
		let typesMap = {}
		const queryNodes = []
		let depth = 0
		let visitor = {
			enter(node ) {
				typeInfo.enter(node)
				if(node.kind === "Field") {
					if (node.alias) {
						queryNodes.push(node.alias.value)
					} else {
						queryNodes.push(typeInfo.getFieldDef().name)
					}
					if (depth) {
						let arr = queryNodes.filter(node=> node.split('.').length === depth)
						let index = queryNodes.indexOf(arr[arr.length-1])
						let depthLength = depth!==1 ? index : 0
						queryNodes[queryNodes.length-1] = 
							queryNodes[depthLength]+'.'+queryNodes[queryNodes.length-1]
					}
					if (typeInfo.getType().toString()[0] === '[') {
						if (node.selectionSet.selections.length === 1) {
							queryNodes[queryNodes.length-1] = `${queryNodes[queryNodes.length-1]}[0]`
						}
					}
					depth++
					return {...node, typeInfo: typeInfo.getType()}
				}
			},
			leave(node) {
				if (node.kind === 'Field') {
					let arr = queryNodes.filter(node=> node.split('.').length === depth)
					let index = queryNodes.indexOf(arr[arr.length-1])
					depth--
					typesMap[queryNodes[index]] = node
				}
				typeInfo.leave(node)
			}
		}
		try {
			visit(parseGql(query), visitWithTypeInfo(typeInfo, visitor))
		} catch (e) {}
		return typesMap
	}

	const plugins = useMemo(()=> [JsonPlugin, ...vegaPlugins, ...graphPlugins, ...timeChartPlugins], [])
	let indexx = plugins.map(plugin => plugin.id).indexOf(currentQuery.widget_id)
	const WidgetComponent = indexx>=0 ? plugins[indexx] : plugins[0]

	const getResult = useCallback(() => {
		ReactTooltip.hide(executeButton.current)
		setLoading(true)
		let queryType = getQueryTypes(currentQuery.query)
		if (JSON.stringify(queryType) !== JSON.stringify(queryTypes)) {
			setQueryTypes(queryType)
		}
		let indexOfData = Object.keys(queryType).indexOf(currentQuery.displayed_data)
		let indexOfWidget = plugins.map(p => p.id).indexOf(currentQuery.widget_id)
		const unusablePair = indexOfData < 0 || indexOfWidget < 0
		let displayed_data = unusablePair ? Object.keys(queryType)[Object.keys(queryType).length-1] : currentQuery.displayed_data
		if (unusablePair) {
			updateQuery({
				displayed_data,
				widget_id: 'json.widget',
				saved: currentQuery.id && true
			}, index)
		}
		fetcher({query: currentQuery.query, variables: currentQuery.variables}).then(data => {
			data.json().then(json => {
				setDataSource({
					execute: getResult,
					data: ('data' in json) ? json.data : null,
					displayed_data: displayed_data || '',
					values: ('data' in json) ? (currentQuery.displayed_data) ? getValueFrom(json.data, displayed_data) : json.data : null,
					error: ('errors' in json) ? json.errors : null,
					query: toJS(currentQuery.query), 
					variables: toJS(currentQuery.variables)
				})
				if (!('data' in json)) updateQuery({widget_id: 'json.widget'}, index)
			})
			
			setLoading(false)
			setAccordance(true)
		})
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [JSON.stringify(currentQuery), schema])
	useEffect(() => {
		(!dataSource.values && 
		currentQuery.query &&
		currentQuery.saved &&
		number === index &&
		schema) && getResult()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [schema])
	const editQueryHandler = useCallback(handleSubject => {
		if ('query' in handleSubject) {
			const facts = getQueryFacts(schema, handleSubject.query)
			if (facts) {
				const { variableToType } = facts
				if ((JSON.stringify(variableToType) !== JSON.stringify(_variableToType)) 
					&& _variableToType!==null) {
					_setVariableToType(variableToType)
				}
			}
			let queryType = getQueryTypes(handleSubject.query)
			if (JSON.stringify(queryType) !== JSON.stringify(queryTypes)) {
				(typeof queryType === 'object' && Object.keys(queryType).length) 
					&& setQueryTypes(queryType)
			}
		}
		if (user && query[index].account_id === user.id ) {
			updateQuery(handleSubject, index)
		} else {
			updateQuery({...handleSubject, url: null}, index, null)
		}
		setAccordance(false)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user, schema, queryTypes, index])
	useEffect(() => {
		if (number === index && schema) {
			let queryType = getQueryTypes(query[index].query)
			setQueryTypes(queryType)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [schema])
	const setConfig = (config) => {
		if (number === index) {
			if (JSON.stringify(currentQuery.config) !== JSON.stringify(config)) {
				updateQuery({config}, index)
				console.log('setconfig')
			}
		}
	}
	const fetcher = (graphQLParams) => {
		let key = user ? user.key : process.env.REACT_APP_IDE_GUEST_API_KEY
		let keyHeader = {'X-API-KEY': key}
		return fetch(
			currentQuery.endpoint_url,
			{
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
	}
	useEffect(() => {
		if (number === index) {
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
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [debouncedURL])
	
	const fullscreenHandle = useFullScreenHandle()

	

	return (
		<div 
			className={'graphiql__wrapper ' + 
				(currentTab === tabs[number].id ? 'graphiql__wrapper_active' : '')
				+ (!showSideBar ? ' graphiql__wrapper_wide' : '')
			}
			key={number}
		>
			<ToolbarComponent 
				queryEditor={queryEditor}
				variablesEditor={variablesEditor}
				docExplorerOpen={docExplorerOpen}
				toggleDocExplorer={toggleDocExplorer}
			/>
			<div className="over-wrapper"  ref={overwrap}>
				<ReactTooltip 
					place="top"
					border={false}
					borderColor="#fff"
					backgroundColor="#5f5f5f"
					arrowColor="transparent"
					delayShow={750}
				/>
				
				<button className="execute-button"
					data-tip='Execute query (Ctrl-Enter)' 
					disabled={loading} 
					ref={executeButton} 
					onClick={getResult}
				>
					{loading 
						?	<Loader
								type="Oval"
								color="#3d77b6"
								height={25}
								width={25}
							/> 
						: 	<PlayIcon fill={accordance ? '#eee' : '#14ff41'} />}
				</button>
				<div className="workspace__wrapper" 
						ref={workspace} 
						onMouseDown={workspaceResizer}
				>
					<GraphqlEditor 
						schema={schema}
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
					/>
					<div className="workspace__sizechanger"/>
					<WidgetEditorControls 
						model={queryTypes}
						dataSource={dataSource}
						setDataSource={setDataSource}
						name={WidgetComponent.name}
						plugins={plugins}
						number={number}
					/>
					{currentQuery.displayed_data ? <WidgetComponent.editor 
						model={dataModel}
						displayedData={toJS(query[index].displayed_data)}
						config={toJS(query[index].config)}
						setConfig={setConfig} 
					/> : <div className="widget" /> }
				</div>
				<div className={'widget-display widget-display-wrapper'+
					(isMobile ? ' widget-display-wrapper-fullscreen' : '')} 
					ref={widgetDisplay}
				>
					<div 
						className="sizeChanger" 
						onMouseDown={handleResizer}
					>
					</div>
					<div className="flex-col w-100">
						<QueryErrorIndicator 
							error={dataSource.error}
							removeError={setDataSource}
						/>
						<FullScreen className="widget-display" handle={fullscreenHandle}>
							<WidgetComponent.renderer 
								dataSource={dataSource} 
								displayedData={toJS(currentQuery.displayed_data)}
								config={toJS(query[index].config)} 
								el={currentTab === tabs[number].id ? `asd${currentTab}` : ''} 
							>
								<FullscreenIcon onClick={
									isMobile ? ()=>setMobile(false) :
									fullscreenHandle.active 
									? fullscreenHandle.exit 
									: fullscreenHandle.enter} 
								/>
							</WidgetComponent.renderer>
						</FullScreen>
					</div>
				</div>
				{docExplorerOpen && <DocExplorer schema={schema} />}
			</div>
		</div> 
	)
})

export default EditorInstance
