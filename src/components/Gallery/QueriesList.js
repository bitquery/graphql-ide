import React, { useEffect, useState } from 'react'
import { observer } from 'mobx-react'
import { getTaggedQueriesList } from '../../api/api'
import { GalleryStore } from '../../store/galleryStore'
import { QueriesStore } from '../../store/queriesStore'
import { TabsStore } from '../../store/queriesStore'
import ToolbarButton from '../../components/bitqueditor/components/ToolbarButton'
import { useHistory } from 'react-router-dom'

const QueriesList = observer(function QueriesList() {

	const { queriesListIsOpen, toggleQueriesList, currentTag, tagListIsOpen } = GalleryStore
	const { setQuery, query, currentPage, queriesOnPage, setCurrentPage } = QueriesStore
	const { switchTab, tabs } = TabsStore
	const history = useHistory()

	const [list, setList] = useState([])
	const [thereIsNext, setNext] = useState(false)

	const main = async (page) => {
		const { data } = await getTaggedQueriesList(currentTag, page * queriesOnPage)
		data.length > queriesOnPage ? setNext(true) : setNext(false)
		setList(data)
	}

	useEffect(() => {
		currentTag && main(currentPage)
	}, [currentTag])

	const handleClick = queryFromGallery => {
		if (query.map(query => query.id).indexOf(queryFromGallery.id) === -1) {
			setQuery(queryFromGallery, queryFromGallery.id)
		} else {
			let tabID = query.map(query => query.id).indexOf(queryFromGallery.id)
			switchTab(tabs[tabID].id)
		}
		history.push(`/graphql/${queryFromGallery.url || ''}`)
		// toggleQueriesList()
	}
	const nextPage = () => {
		main(currentPage + 1)
		setCurrentPage(currentPage + 1)
	}
	const prevPage = () => {
		main(currentPage - 1)
		setCurrentPage(currentPage - 1)
	}

	return (
		<div class="col-lg-9 mb-3">
			<ul class="list-group">
				{list && list.map((item, i, arr) => {
					if (arr.length <= queriesOnPage || i + 1 !== arr.length) {
						return (
							<li class="list-group-item list-group-item-action">
								<div class="d-flex w-100 justify-content-between cursor-pointer" onClick={()=>handleClick(item)}>
									<div>
										<div>
											{item.name}
											{typeof item.tags === 'string' && item.tags.split(',').map(tag => <span class="badge badge-secondary">#{tag}</span>)}
										</div>
										<small>Created by <strong>{item.owner_name}</strong> at 434 days ago</small>
									</div>
								</div>
							</li>
						)
					}
				})}
			</ul>
			<nav class="mt-3">
				<ul class="pagination justify-content-center">
					<li class="page-item disabled">
						<a class="page-link">&larr;</a>
					</li>
					<li class="page-item active"><a class="page-link" href="#">1</a></li>
					<li class="page-item"><a class="page-link" href="#">2</a></li>
					<li class="page-item"><a class="page-link" href="#">3</a></li>
					<li class="page-item">
						<a class="page-link" href="#">&rarr;</a>
					</li>
				</ul>
			</nav>
		</div>
	)
})

export default QueriesList