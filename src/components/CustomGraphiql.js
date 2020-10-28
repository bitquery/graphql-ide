import React, { useState, useRef } from 'react';
import schema from '../utils/schema'
import '../App.scss';
import GraphiQL from 'graphiql'
import modalStore from '../store/modalStore';
import {TabsStore, QueriesStore, UserStore} from '../store/queriesStore';
import { observer } from 'mobx-react-lite';
import copy from 'copy-to-clipboard'
import { useToasts } from 'react-toast-notifications'

export const CustomGraphiql = observer(() => {
	const { toggleSaveQuery, toggleShareQuery } = modalStore
	const { tabs, currentTab } = TabsStore
	const { toggleGallery, setCurrentQuery, query, 
		 updateQuery, queryParams, logQuery } = QueriesStore
	const { user } = UserStore
	const { addToast } = useToasts()
	const graphiql = useRef(null)
	const [fetchURL, setFetchURL] = useState('https://graphql.bitquery.io')
	const [prettify, setPrettify] = useState(false)

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
	const handleSaveQuery = func => {
		if (user) {
			func()
		} else {
			addToast('Login required to save or share queries', {appearance: 'error'})
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
				}
			} else if ('errors' in json) {
				handleQuery('error', json.errors[0].message) 
			}
		})
		return data.json().catch(() => data.text())
	}
	const editQueryHandler = (handleSubject, index) => {
		if (!prettify) {
			setCurrentQuery(handleSubject)
			updateQuery(handleSubject, index)
		}
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
							onClick={toggleGallery}
							label="Gallery"
							title="Gallery Toggle"
						/>
						<GraphiQL.Button 
							onClick={()=>handleSaveQuery(toggleSaveQuery)}
							label="Save"
							title="Save Query"
						/>
						<GraphiQL.Button 
							onClick={()=>handleSaveQuery(toggleShareQuery)}
							label="Share"
							title="Share Query"
						/>
						<input className="endpointURL" type="text" value={fetchURL} onChange={(e) => setFetchURL(e.target.value)} />
					</GraphiQL.Toolbar>
				</GraphiQL>
			</div>
		))
	)
})
