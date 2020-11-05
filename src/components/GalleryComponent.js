import axios from 'axios'
import { observer } from 'mobx-react-lite'
import React, { useEffect, useState } from 'react'
import { UserStore, QueriesStore } from '../store/queriesStore'
import QueriesComponent from './QueriesComponent'
import { useToasts } from 'react-toast-notifications'

const GalleryComponent = observer(() => {
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
				setAllQueries(data.queries)
				data.msg && addToast('Account activated!', {appearance: 'success'})
			} catch (e) {
				console.log(e)
			}
		}
		getQueries()
	}, [queryJustSaved])
	useEffect(() => {
		if (user) {
			const getMyQueries = async () => {
				try {
					const { data } = await axios.get('/api/getmyqueries')
					setMyQueries(data)
				} catch (e) {
					console.log(e)
				}
			}
			getMyQueries()
		}
	}, [user, queryJustSaved])

	return (
		<div className={'gallery flex flex-col ' + (showGallery && 'active')}>
			{!showGallery &&<i className="open fas fa-chevron-right" onClick={toggleGallery} />}
			<div className="gallery__header flex flex-col">
				<i className="gallery__close fas fa-times" onClick={toggleGallery} />
				{ user && 
					<ul className="nav nav-tabs">
						<li className="nav-item" onClick={() => toggleQueries(!showAllQueries)} >
							<a className={"nav-link " + (!showAllQueries && 'active')} href="#">Private</a>
						</li>
						<li className="nav-item" onClick={() => toggleQueries(!showAllQueries)}>
							<a className={"nav-link " + (showAllQueries && 'active')} href="#">Shared</a>
						</li>
					</ul>
				}
			</div>
			<ul className="list-group">
				{
					user ?
						showAllQueries 
							? <QueriesComponent queries={{queries:allQueries}} />
							: <QueriesComponent queries={{queries:myQueries}} />
					: <QueriesComponent queries={{queries:allQueries}} />
				}
			</ul>
		</div>
	)
})

export default GalleryComponent
