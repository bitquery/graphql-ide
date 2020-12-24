import React, { useState, useEffect, useCallback, useMemo } from 'react';
import '../App.scss';
import { observer } from 'mobx-react-lite'
import { toJS } from 'mobx'
import useDebounce from '../utils/useDebounce'
import { vegaPlugins } from 'vega-widgets'
import './bitqueditor/App.scss'
import getQueryFacts from '../utils/getQueryFacts'
import GraphqlEditor from './bitqueditor/components/GraphqlEditor'
import { getIntrospectionQuery, buildClientSchema, TypeInfo, visitWithTypeInfo } from 'graphql'
import { visit } from 'graphql/language/visitor'
import { parse as parseGql } from 'graphql/language'
import WidgetSelect from './bitqueditor/components/WidgetSelect'
import JsonPlugin from './bitqueditor/components/JsonWidget'
import ToolbarComponent from './bitqueditor/components/ToolbarComponent'
import { TabsStore, QueriesStore, UserStore } from '../store/queriesStore';

const EditorInstance = observer(function EditorInstance({number})  {
	const { tabs, currentTab, index, id } = TabsStore
	const { user }  = UserStore
	const { query, updateQuery, showGallery, currentQuery } = QueriesStore
	const [schema, setSchema] = useState(null)
	const [widgetType, setWidgetType] = useState('')
	const [_variableToType, _setVariableToType] = useState(null)
	const [queryTypes, setQueryTypes] = useState('')
	const [dataSource, setDataSource] = useState({})
	const debouncedURL = useDebounce(query[index].endpoint_url, 500)
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
	const getResult = async () => {
		const data = await fetcher({query: query[index].query, variables: query[index].variables})
		data.json().then(json => {
			('data' in json) ? setDataSource({
				execute: getResult,
				data: json.data,
				query: toJS(query[index].query), 
				variables: toJS(query[index].variables)
			}) : console.log(JSON.stringify(json.errors, null, 2))
		})
		let queryType = getQueryTypes(query[index].query)
		if (JSON.stringify(queryType) !== JSON.stringify(queryTypes)) {
			setQueryTypes(queryType)
		}
	}
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
					setQueryTypes(queryType)
				}
			}
			if (user && query[index].account_id === user.id ) {
				updateQuery(handleSubject, index)
			} else {
				updateQuery({...handleSubject, url: null}, index, null)
			}
	}, [user, schema, queryTypes])
	useEffect(() => {
		if (number === index && schema) {
			let queryType = getQueryTypes(query[index].query)
			setQueryTypes(queryType)
		}
	}, [schema])
	const setConfig = (config) => {
		console.log(index)
		config && updateQuery({config, widget_id: widgetType}, index)
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
		if (number === index) {
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
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [debouncedURL])
	const plugins = useMemo(()=> [JsonPlugin, ...vegaPlugins], [])
	let indexx = plugins.map(plugin => plugin.id).indexOf(currentQuery.widget_id)
	console.log(indexx)
	const WidgetComponent = indexx>=0 ? plugins[indexx] : plugins[0]

	return (
		<div 
			className={'graphiql__wrapper ' + 
				(currentTab === tabs[number].id ? 'graphiql__wrapper_active' : '')
				+ (!showGallery ? ' graphiql__wrapper_wide' : '')
			}
			key={number}
		>
			<ToolbarComponent />
			<div className="over-wrapper">
				<div className="workspace__wrapper">
					<GraphqlEditor 
						schema={schema}
						query={query[number].query}
						number={number}
						variables={query[number].variables}
						variableToType={_variableToType}
						onEditQuery={editQueryHandler}
						onEditVariables={editQueryHandler}
					/>
					<WidgetSelect 
						plugins={plugins} 
						model={queryTypes} 
						value={currentQuery.widget_id} 
						setValue={setWidgetType} 
					/>
					<WidgetComponent.editor 
						model={queryTypes}
						config={toJS(currentQuery.config)}
						setConfig={setConfig} 
					/>
				</div>
				<button className="execute-button" onClick={getResult} >Get result</button>
				<WidgetComponent.renderer 
					dataSource={dataSource} 
					config={toJS(query[index].config)} 
					el={currentTab === tabs[number].id ? `asd${currentTab}` : ''} 
				/>
			</div>
		</div>
	)
})

export default EditorInstance
