import axios from 'axios'
import { observer } from 'mobx-react-lite'
import React, { useEffect, useState } from 'react'
import { UserStore, QueriesStore } from '../store/queriesStore'
import QueriesComponent from './QueriesComponent'
import { useToasts } from 'react-toast-notifications'
import { autorun } from 'mobx'

const GalleryComponent = observer(function GalleryComponent() {
	const [allQueries, setAllQueries] = useState([])
	const [myQueries, setMyQueries] = useState([])
	const [showAllQueries, toggleQueries] = useState(true)
	const { showGallery, toggleGallery, queryJustSaved } = QueriesStore
	const { user } = UserStore
	const { addToast } = useToasts()

	useEffect(() => {
		const getQueries = async () => {
			try {
				const { data } = await axios.get('/api/getqueries')
				if (data.queries.length !== allQueries.length) {
					setAllQueries({queries: data.queries})
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

	return (
		<div className={'gallery flex flex-col ' + (showGallery && 'active')}>
			{!showGallery &&<i className="open fas fa-angle-double-right" onClick={toggleGallery} />}
			<div className="gallery__header flex flex-col">
				{!user && <p className="gallery__header__title">Queries</p>}
				<i className="gallery__close fas fa-angle-double-left" onClick={toggleGallery} />
				{ user && 
					<ul className="nav nav-tabs">
						<li className="nav-item" onClick={() => toggleQueries(!showAllQueries)} >
							<a className={"nav-link " + (!showAllQueries && 'active')} href="# ">Private</a>
						</li>
						<li className="nav-item" onClick={() => toggleQueries(!showAllQueries)}>
							<a className={"nav-link " + (showAllQueries && 'active')} href="# ">Shared</a>
						</li>
					</ul>
				}
			</div>
			<ul className="list-group">
				{
					user ?
						showAllQueries 
							? <QueriesComponent queries={allQueries} />
							: <QueriesComponent queries={myQueries} />
					: <QueriesComponent queries={allQueries} />
				}
			</ul>
		</div>
	)
})

export default GalleryComponent
