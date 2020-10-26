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
	const { showGallery } = QueriesStore
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
	}, [])
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
	}, [user])

	return (
		<div className={'gallery flex flex-col ' + (showGallery && 'active')}>
			<div className="gallery__header flex">
				{ user && 
					<div className="gallery__switch">
					<input type="checkbox" id="switch" onChange={() => toggleQueries(!showAllQueries)} />
					<label htmlFor="switch" className="flex">
						<span className="myqueries"></span>
						<span className="allqueries"></span>
					</label>
					</div>
				}
			</div>
			<ul className="gallery__queries">
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
