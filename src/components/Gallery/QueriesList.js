import React, { useEffect, useState } from 'react'
import { observer } from 'mobx-react'
import { getTaggedQueriesList } from '../../api/api'
import { GalleryStore } from '../../store/galleryStore'
import { QueriesStore } from '../../store/queriesStore'
import { TabsStore } from '../../store/queriesStore'
import { useHistory, useLocation, useParams } from 'react-router-dom'
import { getSearchResults } from '../../api/api'

const QueriesList = observer(function QueriesList() {

	const { currentTag } = GalleryStore
	const { setQuery, query, currentPage, queriesOnPage, setCurrentPage, searchValue } = QueriesStore
	const { switchTab, tabs } = TabsStore
	const history = useHistory()
	const location = useLocation()
	const { tag } = useParams()

	const [list, setList] = useState([])
	const [thereIsNext, setNext] = useState(false)

	const main = async (page) => {
		const explore = /\/explore\//gi.test(location.pathname)
		const { data } = await getTaggedQueriesList(currentTag, page * queriesOnPage, explore)
		data.length > queriesOnPage ? setNext(true) : setNext(false)
		setList(data)
	}
	useEffect(() => {
		if (currentTag && location?.state?.detail !== 'search') {
			main(currentPage)
		}
	}, [currentTag, location.pathname])

	useEffect(() => {
		const main = async () => {
			if (searchValue === '') {
				const explore = /\/explore\//gi.test(location.pathname)
				const { data } = await getTaggedQueriesList(currentTag, currentPage * queriesOnPage, explore)
				data.length > queriesOnPage ? setNext(true) : setNext(false)
				setList(data)
			} else if (searchValue) {
				setNext(false)
				setCurrentPage(0)
				const { data } = await getSearchResults(searchValue)
				history.push(`${process.env.REACT_APP_IDE_URL}/explore/All%20queries`)
				setList(data)
			}
		}
		main()
	}, [searchValue])

	const handleClick = queryFromGallery => {
		if (query.map(query => query.id).indexOf(queryFromGallery.id) === -1) {
			setQuery(queryFromGallery, queryFromGallery.id)
		} else {
			let tabID = query.map(query => query.id).indexOf(queryFromGallery.id)
			switchTab(tabs[tabID].id)
		}
		history.push(`${process.env.REACT_APP_IDE_URL}/${queryFromGallery.url || ''}`)
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
		<div className="col-lg-9 mb-3">
			<ul className="list-group">
				{list && list.map((item, i, arr) => {
					if (arr.length <= queriesOnPage || i + 1 !== arr.length) {
						return (
							<li className="list-group-item list-group-item-action">
								<div className="d-flex w-100 justify-content-between cursor-pointer" onClick={()=>handleClick(item)}>
									<div className='w-100'>
										<div>
											<span className="mr-2">{item.name}</span>
											{typeof item.tags === 'string' && item.tags.split(',').map(tag => <span className="badge badge-secondary mr-2">#{tag}</span>)}
											{item.cnt && <span className="badge badge-primary badge-pill float-right">
												<i class="bi bi-eye"/> { item.cnt }
											</span>}
										</div>
										<small>{item.description !== null && `${item.description}. `}Created by <strong>{item.owner_name}</strong> at {Math.floor((new Date().getTime() - new Date(item.created_at).getTime()) / (1000*60*60*24))} days ago</small>
									</div>
								</div>
							</li>
						)
					}
				})}
			</ul>
			<nav className="mt-3">
				<ul className="pagination justify-content-center">
					<li className={`page-item ${!currentPage ? 'disabled' : null}`} onClick={prevPage}>
						<a className="page-link">&larr;</a>
					</li>
					<li className={`page-item ${!thereIsNext ? 'disabled' : null}`} onClick={nextPage}>
						<a className="page-link" href="#">&rarr;</a>
					</li>
				</ul>
			</nav>
		</div>
	)
})

export default QueriesList