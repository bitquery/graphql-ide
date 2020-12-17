import React, { useState, useRef, useEffect } from 'react';
import '../App.scss';
import modalStore from '../store/modalStore';
import { TabsStore, QueriesStore, UserStore } from '../store/queriesStore';
import { useToasts } from 'react-toast-notifications'
import { observer } from 'mobx-react-lite'
import { toJS } from 'mobx'
import useDebounce from '../utils/useDebounce'
// import { vegaPlugins } from 'vega-widgets'
import { vegaPlugins } from './bitqueditor/components/plugins/vegaPlugin'
import './bitqueditor/App.scss'
import getQueryFacts from '../utils/getQueryFacts'
import GraphqlEditor from './bitqueditor/components/GraphqlEditor'
import { getIntrospectionQuery, buildClientSchema, TypeInfo, visitWithTypeInfo } from 'graphql'
import { visit } from 'graphql/language/visitor'
import { parse as parseGql } from 'graphql/language'
import WidgetSelect from './bitqueditor/components/WidgetSelect'
import JsonPlugin from './bitqueditor/components/JsonWidget'
import ToolbarComponent from './bitqueditor/components/ToolbarComponent'
import { useStateAdaptation } from '../utils/useStateAdaptation'

export const GraphqlExplorer = observer(() => {
	const { toggleModal, toggleEditDialog } = modalStore
	const { tabs, currentTab, index, id } = TabsStore
	const { user }  = UserStore
	const { query, updateQuery } = QueriesStore
	const { addToast } = useToasts()
	const [prettify, setPrettify] = useState(false)
	const [schema, setSchema] = useState(null)
	//----------------------------------------------------
	const [widgetType, setWidgetType] = useState('')
	const [_variableToType, _setVariableToType] = useState(null)
	const [queryTypes, setQueryTypes] = useState({[currentTab]: {}})
	const [dataSource, setDataSource] = useState({[currentTab]: {}})
	const getQueryTypes = (query) => {
		const typeInfo = new TypeInfo(schema)
		var typesMap = {}
		const queryNodes = []
		let depth = 0
		var indent = "";
		var visitor = {
			enter(node ) {
				typeInfo.enter(node)
				let name = ''
				if (node.name) {
					if (node.name.value) name = node.name.value
				}
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
					// typesMap[typeInfo.getType()] = queryNodes[queryNodes.length-1]
					typesMap[queryNodes[queryNodes.length-1]] = typeInfo.getType().toString()
					indent = indent + "  ";
					depth++
				}
			},
			leave(node) {
				let name = ''
				if (node.name) {
					if (node.name.value) name = node.name.value
				}
				if (node.kind === 'Field') {
					depth--
					indent = indent.substring(0, indent.length - 2);
				}
				typeInfo.leave(node)
			}
		}
		try {
			visit(parseGql(query), visitWithTypeInfo(typeInfo, visitor))
		} catch (e) {}
		return typesMap
	}
	useStateAdaptation(queryTypes, setQueryTypes, tabs, currentTab, [tabs.length, id])
	useStateAdaptation(dataSource, setDataSource, tabs, currentTab, [tabs.length, id])
	const getResult = async () => {
		const data = await fetcher({query: query[index].query, variables: query[index].variables})
		data.json().then(json => {
			('data' in json) ? setDataSource({...dataSource, [currentTab]: {
				execute: getResult,
				data: json.data,
				query: toJS(query[index].query), 
				variables: toJS(query[index].variables)
			}}) : console.log(JSON.stringify(json.errors, null, 2))
		})
		let queryType = getQueryTypes(query[index].query)
		setQueryTypes({...queryTypes, [currentTab]: queryType})
	}
	const editQueryHandler = (handleSubject, index) => {
			if ('query' in handleSubject) {
				const facts = getQueryFacts(schema, handleSubject.query)
				if (facts) {
					const { variableToType } = facts
					_setVariableToType(variableToType)
				}
				let queryType = getQueryTypes(handleSubject.query)
				setQueryTypes({...queryTypes, [currentTab]: queryType})
			}
			if (query[index].account_id === user.id ) {
				updateQuery(handleSubject, index)
			} else {
				updateQuery({...handleSubject, url: null}, index, null)
			}
	}
	const setConfig = (config) => {
		updateQuery({config}, index)
	}
	const fetcher = (graphQLParams) => {
		return fetch(
			query[index].endpoint_url,
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
			}).catch(e => {})
		}
		fetchSchema()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])
	const plugins = [JsonPlugin, ...vegaPlugins]
	let indexx = plugins.map(plugin => plugin.id).indexOf(widgetType)
	const WidgetComponent = indexx>=0 ? plugins[indexx] : plugins[0]
	if (schema===null) return (<p>Loading...</p>)
	return (
		tabs.map((tab, i) => (
			<div 
				className={'graphiql__wrapper ' + (currentTab === tab.id ? 'graphiql__wrapper_active' : '')}
				key={i}
			>
				<ToolbarComponent />
				<div className="over-wrapper">
					<div className="workspace__wrapper">
						<GraphqlEditor 
							schema={schema}
							query={toJS(query[i].query)}
							number={i}
							variables={toJS(query[i].variables)}
							variableToType={_variableToType}
							onEditQuery={query => editQueryHandler({query}, i)}
							onEditVariables={variables => editQueryHandler({variables}, i)}
						/>
						<WidgetSelect 
							plugins={plugins} 
							model={queryTypes[currentTab]} 
							value={widgetType} 
							setValue={setWidgetType} 
						/>
						<WidgetComponent.editor 
							model={queryTypes[currentTab]} 
							setConfig={setConfig} 
						/>
					</div>
					<button className="execute-button" onClick={getResult} >Get result</button>
					<WidgetComponent.renderer dataSource={dataSource[currentTab]} config={toJS(query[index].config)} el={currentTab === tab.id ? `asd${currentTab}` : ''} />
				</div>
			</div>
		))
	)
})
