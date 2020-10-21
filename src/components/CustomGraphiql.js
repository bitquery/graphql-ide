import React, { useState, useRef, useMemo, useEffect } from 'react';
import '../App.scss';
import GraphiQL from 'graphiql'
import modalStore from '../store/modalStore';
import tabsStore from '../store/tabsStore';
import { observer } from 'mobx-react-lite';
import QueriesStore from '../store/queriesStore'

export const CustomGraphiql = observer(({ user }) => {
	const { toggleSaveQuery, toggleShareQuery } = modalStore
	const { tabs, currentTab } = tabsStore
	const { toggleGallery, setCurrentQuery, setCurrentVariables } = QueriesStore
	const graphiql = useRef(null)
	const [fetchURL, setFetchURL] = useState('https://graphql.bitquery.io')

	const handleClickPrettifyButton = () => {
		const editor = graphiql.current.getQueryEditor();
		const currentText = editor.getValue();
		const { parse, print, graphql } = require('graphql');
		const prettyText = print(parse(currentText));
		editor.setValue(prettyText);
	}
	const shareQuery = () => {
		toggleSaveQuery()
		console.log('sharim query')
	}
	const copyQuery = () => {
		console.log('copim query')
	}
	const fetcher = useMemo(() => {
		return async graphQLParams => {
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
			return data.json().catch(() => data.text())
		}
	}, [])
	useEffect(() => {
		setCurrentQuery(localStorage.getItem('graphiql:query'))
		setCurrentVariables(localStorage.getItem('graphiql:variables'))
	}, [])

	return (
		tabs.map((tab, i) => (
			<div 
				className={'graphiql__wrapper ' + (currentTab === tab ? 'graphiql__wrapper_active' : '')}
				key={i}
			>
				<GraphiQL 
					ref={graphiql}
					style={{ height: '100vh' }}
					fetcher={fetcher}
					editorTheme="dracula"
					onEditQuery={query => setCurrentQuery(query)}
					onEditVariables={variables => setCurrentVariables(variables)}
				>
					<GraphiQL.Toolbar>
						<GraphiQL.Button 
							onClick={copyQuery}
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
