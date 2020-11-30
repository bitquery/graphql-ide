import React, { useState, useRef, useEffect } from 'react';
import '../App.scss';
import GraphiQL from 'graphiql'
import modalStore from '../store/modalStore';
import { TabsStore, QueriesStore, UserStore } from '../store/queriesStore';
import copy from 'copy-to-clipboard'
import { useToasts } from 'react-toast-notifications'
import { getIntrospectionQuery, buildClientSchema } from 'graphql';
import { observer } from 'mobx-react-lite'
import useDebounce from '../utils/useDebounce'

export const CustomGraphiql = observer(() => {
	const { toggleModal, toggleEditDialog } = modalStore
	const { tabs, currentTab, index } = TabsStore
	const { user }  = UserStore
	const { query, saveQuery, updateQuery, queryParams, logQuery } = QueriesStore
	const { addToast } = useToasts()
	const graphiql = useRef(null)
	const debouncedURL = useDebounce(query[index].endpoint_url, 500)
	const [prettify, setPrettify] = useState(false)
	const [schema, setSchema] = useState(null)

	const fetcherFunction = (graphQLParams) => {
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
	const handleInputURLChange = (i,e) => {
		updateQuery({endpoint_url: e.target.value}, i)
	}
	const handleCopy = () => {
		const editor = graphiql.current.getQueryEditor()
		const query = editor && editor.getValue()
		if (!query) return
		copy(query)
	}
	const handleClickPrettifyButton = () => {
		setPrettify(true)
		const editor = graphiql.current.getQueryEditor()
		const currentText = editor.getValue()
		const { parse, print } = require('graphql')
		const prettyText = print(parse(currentText))
		editor.setValue(prettyText)
		setPrettify(false)
	}
	const handleQuery = (result, error) => {
		//addQueryLog
		if (queryParams.id) {
			let params = {...queryParams}
			if (error) {
				params[result] = error
			} else {
				params[result] = true
			} 
			logQuery(params)
		}
	}
	const saveHandle = (query) => {
		if (user) {
			if (query.id === null) {
				toggleEditDialog()
				toggleModal()
			} else if (!query.saved) {
				saveQuery(queryParams)
			}
		} else {
			addToast('Login required to save or share queries', {appearance: 'error'})
		}
	}
	const fetcher = async graphQLParams => {
		const data = await fetcherFunction(graphQLParams)
		data.clone().json().then(json => {
			if ('data' in json) {
				if (!('__schema' in json.data)) {
					handleQuery('success')
				}
			} else if ('errors' in json) {
				handleQuery('error', json.errors[0].message) 
			}
		})
		return data.json().catch(() => data.text())
	}
	const editQueryHandler = (handleSubject, index) => {
		if (!prettify) {
			if (query[index].account_id === user.id ) {
				updateQuery(handleSubject, index)
			} else {
				updateQuery({...handleSubject, url: null}, index, null)
			}
		}
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
			query[index].endpoint_url.length > 9 && 
			fetcherFunction(graphQLParams)
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
	}, [debouncedURL])

	return (
		tabs.map((tab, i) => (
			<div 
				className={'graphiql__wrapper ' + (currentTab === tab.id ? 'graphiql__wrapper_active' : '')}
				key={i}
			>
				<GraphiQL 
					ref={graphiql}
					style={{ height: '100vh' }}
					query={query[i].query}
					defaultQuery={''}
					fetcher={fetcher}
					schema={schema}
					variables={query[i].variables}
					editorTheme="dracula"
					onEditQuery={query => editQueryHandler({query}, i)}
					onEditVariables={variables => editQueryHandler({variables}, i)}
				>
					<GraphiQL.Toolbar>
						<GraphiQL.Button 
							onClick={handleCopy}
							label="Copy"
							title="Copy Query"
						/>
						<GraphiQL.Button 
							onClick={handleClickPrettifyButton}
							label="Prettify"
							title="Prettify Query (Shift-Ctrl-P)"
						/>
						<GraphiQL.Button 
							onClick={()=>saveHandle(query[i])}
							label="Save"
							title="Save Query"
						/>
						<input className="endpointURL" type="text" value={query[i].endpoint_url} onChange={e=>handleInputURLChange(i, e)} />
					</GraphiQL.Toolbar>
				</GraphiQL>
			</div>
		))
	)
})
