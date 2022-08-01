import React, { useState, useEffect } from 'react'
import { QueriesStore, TabsStore, UserStore } from '../store/queriesStore'
import { GalleryStore } from '../store/galleryStore'
import { getTagsList } from '../api/api'
import QueriesList from './Gallery/QueriesList'
import { observer } from 'mobx-react'
import { useLocation } from 'react-router-dom'

const ExploreComponent = observer(function ExploreComponent() {
	const location = useLocation()
	const { user } = UserStore
	const { queriesListIsOpen, currentTag,
		toggleQueriesList, toggleTagsList, setCurrentTag } = GalleryStore
	const { currentQuery, updateQuery, schema, queryJustSaved } = QueriesStore
	const [tagsList, setTagsList] = useState([])
	useEffect(() => {
		const onload = async () => {
			const explore = location.pathname === `${process.env.REACT_APP_IDE_URL}/explore` ? true : false
			try {
				const { data } = await getTagsList(explore)
				setTagsList(data)
			} catch (error) {
				console.log(error)
			}
		}
		user && onload()
	}, [queryJustSaved, user, location.pathname])

	const handleClick = tag => {
		setCurrentTag(tag)
		if (queriesListIsOpen && tag === currentTag || !queriesListIsOpen) {
			toggleQueriesList()
		}
	}

	return (
		<div className="container-fluid overflow-auto">
			<div className="row">
				<div className="col-lg-3 mb-3">
					<div className="card">
						<div className="card-body">
							<ul className="list-group list-group-flush">
								{
									tagsList.map(({ tag, tag_id, tags_count }) => (
										<li
											className={`list-group-item d-flex justify-content-between align-items-center list-group-item-action cursor-pointer ${currentTag === tag ? 'tag-active' : ''}`}
											key={`${tag_id}-${tags_count}`}
											onClick={() => handleClick(tag)}
										>
											<span><i className="bi bi-tag"></i> { tag } </span>
											<span className="badge badge-primary badge-pill"> { tags_count } </span>
										</li>
									))
								}
							</ul>
						</div>
					</div>
				</div>
				<QueriesList />
			</div>
		</div>
	)
})

export default ExploreComponent