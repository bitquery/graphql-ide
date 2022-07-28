import React, { useState, useEffect } from 'react'
import { QueriesStore, TabsStore, UserStore } from '../store/queriesStore'
import { GalleryStore } from '../store/galleryStore'
import { getTagsList } from '../api/api'
import QueriesList from './Gallery/QueriesList'

function ExploreComponent() {
	const { user } = UserStore
	const { queriesListIsOpen, currentTag,
		toggleQueriesList, toggleTagsList, setCurrentTag } = GalleryStore
	const { currentQuery, updateQuery, schema, queryJustSaved } = QueriesStore
	const [tagsList, setTagsList] = useState([])
	useEffect(() => {
		const onload = async () => {
			try {
				const { data } = await getTagsList()
				setTagsList(data)
			} catch (error) {
				console.log(error)
			}
		}
		user && onload()
	}, [queryJustSaved, user])
	const handleClick = tag => {
		setCurrentTag(tag)
		if (queriesListIsOpen && tag === currentTag || !queriesListIsOpen) {
			toggleQueriesList()
		}
	}
	return (
		<div class="container-fluid overflow-auto">
			<div class="row">
				<div class="col-lg-3 mb-3">
					<div class="card">
						<div class="card-body">
							<ul class="list-group list-group-flush">
								{
									tagsList.map(({ tag, tag_id, tags_count }) => (
										<li
											className="list-group-item d-flex justify-content-between align-items-center list-group-item-action"
											key={`${tag_id}-${tags_count}`}
											onClick={() => handleClick(tag)}
										>
											<span><i class="bi bi-tag"></i> { tag } </span>
											<span class="badge badge-primary badge-pill"> { tags_count } </span>
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
}

export default ExploreComponent