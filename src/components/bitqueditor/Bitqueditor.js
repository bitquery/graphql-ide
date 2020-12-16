import React, { useState, useEffect } from 'react'
import './App.css'
import getQueryFacts from '../../utils/getQueryFacts'
import GraphqlEditor from './components/GraphqlEditor'
import { getIntrospectionQuery, buildClientSchema, TypeInfo, visitWithTypeInfo } from 'graphql'
import { visit } from 'graphql/language/visitor'
import { parse as parseGql } from 'graphql/language'
import WidgetSelect from './components/WidgetSelect'
import JsonPlugin from './components/JsonWidget'
import ToolbarComponent from './components/ToolbarComponent'
// import { vegaPlugins } from './components/plugins/vegaPlugin'
import { vegaPlugins } from 'vega-widgets'

function Bitqueditor() {
	const [query, setQuery] = useState('')
	const [widgetType, setWidgetType] = useState('')
	const [config, setConfig] = useState({})
	const [variables, setVariables] = useState('{}')
	const [_variableToType, _setVariableToType] = useState(null)
	const [schema, setSchema] = useState(null)
	const [queryTypes, setQueryTypes] = useState(null)
	const [dataSource, setDataSource] = useState({})

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
	const getResult = async () => {
		const data = await fetcher({query, variables})
		data.json().then(json => {
			('data' in json) ? setDataSource({
				execute: getResult,
				data: json.data,
				query,
				variables
			}) : console.log(JSON.stringify(json.errors, null, 2))
		})
		let queryTypes = getQueryTypes(query)
		setQueryTypes(queryTypes)
	}
	const onEditQuery = (query) => {
		const facts = getQueryFacts(schema, query)
		if (facts) {
			const { variableToType } = facts
			_setVariableToType(variableToType)
		}
		let queryTypes = getQueryTypes(query)
		setQueryTypes(queryTypes)
		setQuery(query)
	}
	const onEditVariable = (variable) => {
		setVariables(JSON.parse(variable))
	}
	const fetcher = (graphQLParams) => {
		return fetch(
			'https://graphql.bitquery.io',
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
	let index = plugins.map(plugin => plugin.id).indexOf(widgetType)
	const WidgetComponent = index>=0 ? plugins[index] : plugins[0]
	if (schema===null) return (<p>Loading...</p>)
	return (
		<div className="bitqueditor">
			<ToolbarComponent />
			<div className="Appb">
				<div className="workspace__wrapper">
					<GraphqlEditor 
						schema={schema}
						query={query}
						variables={variables}
						variableToType={_variableToType}
						onEditQuery={onEditQuery}
						onEditVariable={onEditVariable}
					/>
					<WidgetSelect 
						plugins={plugins} 
						model={queryTypes} 
						value={widgetType} 
						setValue={setWidgetType} 
					/>
					<WidgetComponent.editor 
						model={queryTypes} 
						setConfig={setConfig} 
						widgetType={widgetType}
					/>
				</div>
				<button className="execute-button" onClick={getResult} >Get result</button>
				<WidgetComponent.renderer dataSource={dataSource} config={config} />
			</div> 
		</div>
	)
}

export default Bitqueditor;
