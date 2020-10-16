import React, { useState, useRef, useMemo } from 'react';
import '../App.scss';
import GraphiQL from 'graphiql'
import modalStore from '../store/modalStore';

export const CustomGraphiql = ({tabs, currentTab}) => {
	const { toggleSaveQuery } = modalStore
	const graphiql = useRef(null)
	const [fetchURL, setFetchURL] = useState('https://graphql.bitquery.io')
	const [currentQuery, setCurrentQuery] = useState('')

	const handleClickPrettifyButton = () => {
		const editor = graphiql.current.getQueryEditor();
		const currentText = editor.getValue();
		const { parse, print } = require('graphql');
		const prettyText = print(parse(currentText));
		editor.setValue(prettyText);
	}
	const saveQuery = () => {
		toggleSaveQuery()
		console.log('savim query')
	}
	const shareQuery = () => {
		toggleSaveQuery()
		console.log('sharim query')
	}
	const copyQuery = () => {
		console.log('copim query')
	}
	const toggleGallery = () => {
		console.log('togglimGallery')
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

	return (
		tabs.map((tab, i) => (
			<div 
				className={'graphiql__wrapper ' + (currentTab == tab ? 'graphiql__wrapper_active' : '')}
				key={i}
			>
				<GraphiQL 
					ref={graphiql}
					style={{ height: '100vh' }}
					fetcher={fetcher}
					editorTheme="dracula"
					onEditQuery={query => setCurrentQuery(query)}
				>
					<GraphiQL.Toolbar>
						<GraphiQL.Button 
							onClick={copyQuery}
							label="Copy"
							title="Copy Query"
						/>
						<GraphiQL.Button 
							onClick={toggleGallery}
							label="Gallery"
							title="Gallery Toggle"
						/>
						<GraphiQL.Button 
							onClick={handleClickPrettifyButton}
							label="Prettify"
							title="Prettify Query (Shift-Ctrl-P)"
						/>
						<GraphiQL.Button 
							onClick={saveQuery}
							label="Save"
							title="Save Query"
						/>
						<GraphiQL.Button 
							onClick={shareQuery}
							label="Share"
							title="Share Query"
						/>
						<input className="endpointURL" type="text" value={fetchURL} onChange={(e) => setFetchURL(e.target.value)} />
					</GraphiQL.Toolbar>
				</GraphiQL>
			</div>
		))
	)
}
