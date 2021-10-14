import axios from 'axios'
import { observer } from 'mobx-react-lite'
import React, { useEffect, useState } from 'react'
import { UserStore, QueriesStore, TabsStore } from '../store/queriesStore'
import QueriesComponent from './Gallery/QueriesComponent'
import { useToasts } from 'react-toast-notifications'
import QueryBuilder from './Gallery/QueryBuilder/index'
import { makeDefaultArg, getDefaultScalarArgValue } from "./Gallery/QueryBuilder/CustomArgs"

const GalleryComponent = observer(function GalleryComponent() {
	const [allQueries, setAllQueries] = useState([])
	const [myQueries, setMyQueries] = useState([])
	const [showAllQueries, toggleQueries] = useState(true)
	const [showBuilder, toggleBuilder] = useState(false)
	const { showGallery, currentQuery, 
		toggleSideBar, toggleGallery, 
		queryJustSaved, updateQuery, schema } = QueriesStore
	const { index } = TabsStore
	const { user } = UserStore
	const { addToast } = useToasts()

	useEffect(() => {
		const handler = () => addToast((
			<a href="https://bitquery.io/blog/blockchain-graphql-query" target="_blank" rel="noopener noreferrer">
				Create your first GraphQL Query
			</a>), 
			{
				appearance: 'info'
			})
		window.addEventListener('unauth', handler)
		return () => window.removeEventListener('unauth', handler)
	}, [addToast])
	useEffect(() => {
		const getQueries = async () => {
			try {
				const { data } = await axios.get('/api/getqueries')
				if (data.queries.length !== allQueries.length) {
					setAllQueries({queries: data.queries})
				}
				if ('transferedQuery' in data) {
					updateQuery({query: data.transferedQuery.query, variables: data.transferedQuery.variables}, index)
				}
				data.msg && addToast('Account activated!', {appearance: 'success'})
			} catch (e) {
				console.log(e)
			}
		}
		getQueries()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [queryJustSaved])
	useEffect(() => {
		if (user) {
			const getMyQueries = async () => {
				try {
					const { data } = await axios.get('/api/getmyqueries')
					if (data.length !== myQueries.length) {
						setMyQueries({queries: data})
					}
				} catch (e) {
					console.log(e)
				}
			}
			getMyQueries()
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user, queryJustSaved])
	let component = null
	if (showBuilder) {
		component = (
			<QueryBuilder
				width={'300px'}
				minWidth={'300px'}
				title={'Builder'}
				schema={schema}
				query={currentQuery.query}
				onEdit={query=>updateQuery({query}, index)}
				explorerIsOpen={showBuilder}
				onToggleExplorer={toggleGallery}
				onToggleSideBar={toggleSideBar}
				getDefaultScalarArgValue={getDefaultScalarArgValue}
				makeDefaultArg={makeDefaultArg}
			/>
	)} else if (showAllQueries) {
		component = (
			<ul className="list-group">
				<QueriesComponent queries={allQueries} />
			</ul>
	)} else {
		component = (
			<ul className="list-group">
				<QueriesComponent queries={myQueries} />
			</ul>
	)}

	return (
		<div className={'gallery flex flex-col active'}>
			{!showGallery &&<i className="open fas fa-angle-double-right" onClick={toggleGallery} />}
			<div className="gallery__header flex flex-col">
				<i className="gallery__close fas fa-angle-double-left" onClick={toggleSideBar} />
					<ul className="nav nav-tabs">
						{user && <li className="nav-item" onClick={() => {toggleQueries(false); toggleBuilder(false);}} >
							<a className={"nav-link " + ((!showAllQueries && !showBuilder) && 'active')} href="# ">Private</a>
						</li>}
						<li className="nav-item" onClick={() => {toggleQueries(true); toggleBuilder(false);}}>
							<a className={"nav-link " + ((showAllQueries && !showBuilder) && 'active')} href="# ">{user ? 'Shared' : 'Queries'}</a>
						</li>
						<li className="nav-item" onClick={() => toggleBuilder(true)}>
							<a className={"nav-link " + (showBuilder && 'active')} href="# ">Builder</a>
						</li>
					</ul>
				
			</div>
			{ component }
		</div>
	)
})

export default GalleryComponent
