import React, { useEffect, useState } from 'react'
import { observer } from 'mobx-react'
import { Table } from 'react-bootstrap'
import { getTaggedQueriesList } from '../../api/api'
import { GalleryStore } from '../../store/galleryStore'
import { QueriesStore } from '../../store/queriesStore'
import { TabsStore } from '../../store/queriesStore'
import { useHistory } from 'react-router-dom'
import ToolbarButton  from '../../components/bitqueditor/components/ToolbarButton'

const QueriesList = observer(function QueriesList() {

	const history = useHistory()
	const { queriesListIsOpen, toggleQueriesList, currentTag, tagListIsOpen } = GalleryStore
	const { setQuery, query, currentQuery, currentPage, queriesOnPage, setCurrentPage } = QueriesStore
	const { switchTab, tabs } = TabsStore

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
	
	return (
		<div className={'querylist__root' + (queriesListIsOpen ? ' active' : '') + (!tagListIsOpen && queriesListIsOpen  ? ' fullwidth' : '')}>
			{list && list.map((item, i, arr) => {
				if (arr.length <= queriesOnPage || i+1 !== arr.length) {
					return (
						<div className="querylist__item" key={item.name+item.tags+i}>
							<div className="querylist__item__header">
								<p className="querylist__item__name" onClick={() => handleClick(item)}>{item.name}</p>
								<div className="tags">
									{item.tags && item.tags.split(',').map(tag => (
										<span className="querylist__item__tag">
											#{tag}
										</span>
									))}
								</div>
							</div>
							<div className="querylist__item__footer">
								Created by {item.account_id}
							</div>
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