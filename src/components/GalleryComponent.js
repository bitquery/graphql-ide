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
			<div className="gallery__header flex flex-col">
				<span className="close" onClick={toggleGallery} /> 
				<p>Queries</p>
				{ user && 
					<div className="gallery__switch">
						<input type="checkbox" id="switch" onChange={() => toggleQueries(!showAllQueries)} />
						<label htmlFor="switch" className="flex gallery__switch__label">
							<span className="myqueries">Private</span>
							<span className="allqueries">Shared</span>
						</label>
					</div>
				}
			</div>
			<ul className="gallery__queries">
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
