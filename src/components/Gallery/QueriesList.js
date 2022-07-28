import React, { useEffect, useState } from 'react'
import { observer } from 'mobx-react'
import { getTaggedQueriesList } from '../../api/api'
import { GalleryStore } from '../../store/galleryStore'
import { QueriesStore } from '../../store/queriesStore'
import { TabsStore } from '../../store/queriesStore'
import ToolbarButton from '../../components/bitqueditor/components/ToolbarButton'
import { useHistory } from 'react-router-dom'
import { getSearchResults } from '../../api/api'

const QueriesList = observer(function QueriesList() {

	const { queriesListIsOpen, toggleQueriesList, currentTag, tagListIsOpen } = GalleryStore
	const { setQuery, query, currentPage, queriesOnPage, setCurrentPage, searchValue } = QueriesStore
	const { switchTab, tabs } = TabsStore
	const history = useHistory()

	const [list, setList] = useState([])
	const [thereIsNext, setNext] = useState(false)
	
	useEffect(() => {
		const main = async () => {
			const { data } = await getSearchResults(searchValue)
			history.push('/graphql/explore')
			setList(data)
		}
		searchValue && main()
	}, [searchValue])

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
		if (thereIsNext) {
			main(currentPage + 1)
			setCurrentPage(currentPage + 1)
		}
	}
	const prevPage = () => {
		if (currentPage) {
			main(currentPage - 1)
			setCurrentPage(currentPage - 1)
		}
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
										<small>Created by <strong>{item.owner_name}</strong> at {Math.floor((new Date().getTime() - new Date(item.created_at).getTime()) / (1000*60*60*24))} days ago</small>
									</div>
								</div>
							</li>
						)
					}
				})}
			</ul>
			<nav class="mt-3">
				<ul class="pagination justify-content-center">
					<li className={`page-item ${!currentPage ? 'disabled' : null}`} onClick={prevPage}>
						<a class="page-link">&larr;</a>
					</li>
					<li className={`page-item ${!thereIsNext ? 'disabled' : null}`} onClick={nextPage}>
						<a class="page-link" href="#">&rarr;</a>
					</li>
				</ul>
			</nav>
		</div>
	)
})

export default QueriesList