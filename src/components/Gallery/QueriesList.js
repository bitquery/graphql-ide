import React, { useEffect, useState } from 'react'
import { observer } from 'mobx-react'
import { getTaggedQueriesList, getSearchResults } from '../../api/api'
import { GalleryStore } from '../../store/galleryStore'
import { QueriesStore } from '../../store/queriesStore'
import { TabsStore } from '../../store/queriesStore'
import ToolbarButton  from '../../components/bitqueditor/components/ToolbarButton'
import useDebounce from '../../utils/useDebounce'

const QueriesList = observer(function QueriesList() {

	const { queriesListIsOpen, toggleQueriesList, currentTag, tagListIsOpen } = GalleryStore
	const { setQuery, query, currentPage, queriesOnPage, setCurrentPage } = QueriesStore
	const { switchTab, tabs } = TabsStore

	const [list, setList] = useState([])
	const [thereIsNext, setNext] = useState(false)
	const [search, setSearch] = useState('')
	const [resetTrigger, setResetTrigger] = useState(false)

	
	const searchValue = useDebounce(search, 500)
	useEffect(() => {
		const main = async () => {
			const { data } = await getSearchResults(searchValue)
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
		(currentTag || resetTrigger) && main(currentPage)
		resetTrigger && setResetTrigger(false)
		setSearch('')
	}, [currentTag, resetTrigger])

	const handleClick = queryFromGallery => {
		if (query.map(query => query.id).indexOf(queryFromGallery.id) === -1) {
			setQuery(queryFromGallery, queryFromGallery.id)
		} else {
			let tabID = query.map(query => query.id).indexOf(queryFromGallery.id)
			switchTab(tabs[tabID].id)
		}
		toggleQueriesList()
	}
	const nextPage = () => {
		main(currentPage + 1)
		setCurrentPage(currentPage + 1)
	}
	const prevPage = () => {
		main(currentPage - 1)
		setCurrentPage(currentPage - 1)
	}
	const clearSearch = () => {
		setSearch('')
		setResetTrigger(true)
	}

	return (
		<div className={'querylist__root' + (queriesListIsOpen ? ' active' : '') + (!tagListIsOpen && queriesListIsOpen  ? ' fullwidth' : '')}>
			<div className="querylist__search">
				<input type="text" className="query__save"
					placeholder='Search'
					value={search} onChange={e=>setSearch(e.target.value)}
				/>
				<i className="fas fa-times" onClick={clearSearch}/>
				{searchValue && <p>Show results for '{searchValue}':</p>}
			</div>
			{list && list.map((item, i, arr) => {
				if (arr.length <= queriesOnPage || i+1 !== arr.length) {
					return (
						<div className="querylist__item__wrapper" key={item.name+item.tags+i}>
							<div className="querylist__item">
								<div className="querylist__item__header">
									<p className="querylist__item__name" onClick={() => handleClick(item)}>{item.name}</p>
									<div className="tags">
										{item.tags && item.tags.split(',').map(tag => (
											<span className="querylist__item__tag" key={tag}>
												#{tag}
											</span>
										))}
									</div>
								</div>
								<div className="querylist__item__footer">
									Created by <span>{item.owner_name}</span>
								</div>
							</div>
							{currentTag === 'My queries' && <div className="querylist__item__name querylist__item__status">
								{item.published ? 'PUBLIC' : ''}
							</div>}
						</div>
					)
				}
			})}
			<div className="flex querylist__buttons">
				<ToolbarButton 
					title='Previous'
					onClick={prevPage}
					disabled={!currentPage}
				/>
				<ToolbarButton 
					title='Next'
					onClick={nextPage}
					disabled={!thereIsNext}
				/>
			</div>
		</div>
	)
})

export default QueriesList