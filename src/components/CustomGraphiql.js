import React, { useState, useRef, useMemo, useEffect } from 'react';
import '../App.scss';
import GraphiQL from 'graphiql'
import modalStore from '../store/modalStore';
import {TabsStore, QueriesStore, UserStore} from '../store/queriesStore';
import { observer } from 'mobx-react-lite';

export const CustomGraphiql = observer(() => {
	const { toggleSaveQuery, toggleShareQuery } = modalStore
	const { tabs, currentTab } = TabsStore
	const { toggleGallery, setCurrentQuery, 
		setCurrentVariables, query, 
		setQuery, updateQuery, 
		saveQuery, queryParams, logQuery } = QueriesStore
	const { user } = UserStore
	const graphiql = useRef(null)
	const [fetchURL, setFetchURL] = useState('https://graphql.bitquery.io')

	const handleClickPrettifyButton = () => {
		const editor = graphiql.current.getQueryEditor();
		const currentText = editor.getValue();
		const { parse, print, graphql } = require('graphql');
		const prettyText = print(parse(currentText));
		editor.setValue(prettyText);
	}
	const handleQuery = result => {
		//addQueryLog
		console.log('queryParams ID = ', queryParams.id)
		if (queryParams.id) {
			let params = {...queryParams}
			params[result] = true
			logQuery(params)
		}
	}
	const fetcher = async graphQLParams => {
			const data = await fetch(
				fetchURL,
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
			data.clone().json().then(json => {
				if ('data' in json) {
					if (!('__schema' in json.data)) {
						handleQuery('success')
						console.log('respone', json.data)
					}
				} else if ('errors' in json) {
					handleQuery('error')
					console.log('error', json.errors)
				}
			})
			return data.json().catch(() => data.text())
	}
	useEffect(() => {
		setCurrentQuery(localStorage.getItem('graphiql:query'))
		setCurrentVariables(localStorage.getItem('graphiql:variables'))
		// setQuery(localStorage.getItem('graphiql:query'))
	}, [])
	const editQueryHandler = (query, index) => {
		setCurrentQuery(query)
		updateQuery(query, index)
	}

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
					fetcher={fetcher}
					editorTheme="dracula"
					onEditQuery={query => editQueryHandler(query, i)}
					onEditVariables={variables => setCurrentVariables(variables)}
				>
					<GraphiQL.Toolbar>
						<GraphiQL.Button 
							onClick={() => {}}
							label="Copy"
							title="Copy Query"
						/>
						<GraphiQL.Button 
							onClick={handleClickPrettifyButton}
							label="Prettify"
							title="Prettify Query (Shift-Ctrl-P)"
						/>
						<GraphiQL.Button 
							onClick={toggleGallery}
							label="Gallery"
							title="Gallery Toggle"
						/>
						{ user && <GraphiQL.Button 
							onClick={toggleSaveQuery}
							label="Save"
							title="Save Query"
						/> }
						{ user && <GraphiQL.Button 
							onClick={toggleShareQuery}
							label="Share"
							title="Share Query"
						/> }
						<input className="endpointURL" type="text" value={fetchURL} onChange={(e) => setFetchURL(e.target.value)} />
					</GraphiQL.Toolbar>
				</GraphiQL>
			</div>
		))
	)
})
