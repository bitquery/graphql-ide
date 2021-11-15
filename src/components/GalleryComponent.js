import { observer } from 'mobx-react-lite'
import React, { useEffect, useState } from 'react'
import { UserStore, QueriesStore, TabsStore } from '../store/queriesStore'
import QueriesComponent from './Gallery/QueriesComponent'
import { useToasts } from 'react-toast-notifications'
import QueryBuilder from './Gallery/QueryBuilder/index'
import { getAllQueries, getMyQueries } from '../api/api'
import { makeDefaultArg, getDefaultScalarArgValue } from "./Gallery/QueryBuilder/CustomArgs"

const GalleryComponent = observer(function GalleryComponent() {
	const [allQueries, setAllQueries] = useState([])
	const [myQueries, setMyQueries] = useState([])
	const [dashboardQueries, setDashboardQueries] = useState([])
	const [showAllQueries, toggleQueries] = useState(true)
	const [showBuilder, toggleBuilder] = useState(false)
	const { currentQuery, showSideBar,
		toggleSideBar, setSharedQueires, setQueryIsTransfered,
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
			let [data1, data2] = await Promise.all([getAllQueries(), getMyQueries()])
			if (data1.data.queries.length !== allQueries.length) {
				setAllQueries({queries: data1.data.queries})
				setSharedQueires(data1.data.queries)
				if ('transferedQuery' in data1.data) {
					updateQuery({query: data1.data.transferedQuery.query, variables: data1.data.transferedQuery.variables}, index)
					setQueryIsTransfered(true)
				}
			}
			data1.data.msg && addToast('Account activated!', {appearance: 'success'})
			if (data2.data.length !== myQueries.length) {
				setMyQueries({queries: data2.data})
			}
			let dashboardQueries = [...data1.data.queries, ...data2.data].filter(query => !query.layout && query.widget_id !== 'json.widget' && query.widget_id)
			setDashboardQueries({queries: dashboardQueries})
		}
		getQueries()
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
				onToggleExplorer={toggleSideBar}
				onToggleSideBar={toggleSideBar}
				getDefaultScalarArgValue={getDefaultScalarArgValue}
				makeDefaultArg={makeDefaultArg}
			/>
	)} else if (currentQuery.layout) {
		component = (
			<ul className="list-group">
				<QueriesComponent queries={dashboardQueries} />
			</ul>
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
			{!showSideBar &&<i className="open fas fa-angle-double-right" onClick={()=>toggleSideBar(true)} />}
			<div className="gallery__header flex flex-col">
				<i className="gallery__close fas fa-angle-double-left" onClick={()=>toggleSideBar(false)} />
					<ul className="nav nav-tabs">
						{user && !currentQuery.layout && <li className="nav-item" onClick={() => {toggleQueries(false); toggleBuilder(false);}} >
							<a className={"nav-link " + ((!showAllQueries && !showBuilder) && 'active')} href="# ">Private</a>
						</li>}
						{!currentQuery.layout && <li className="nav-item" onClick={() => {toggleQueries(true); toggleBuilder(false);}}>
							<a className={"nav-link " + ((showAllQueries && !showBuilder) && 'active')} href="# ">{user ? 'Shared' : 'Queries'}</a>
						</li>}
						{!currentQuery.layout && <li className="nav-item" onClick={() => toggleBuilder(true)}>
							<a className={"nav-link " + (showBuilder && 'active')} href="# ">Builder</a>
						</li>}
					</ul>
				
			</div>
			{ component }
		</div>
	)
})

export default GalleryComponent
