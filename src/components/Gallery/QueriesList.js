import React, { useEffect, useState } from 'react'
import { observer } from 'mobx-react'
import { Table } from 'react-bootstrap'
import { getTaggedQueriesList } from '../../api/api'
import { GalleryStore } from '../../store/galleryStore'
import { QueriesStore } from '../../store/queriesStore'
import { TabsStore } from '../../store/queriesStore'
import { useHistory } from 'react-router-dom'

const QueriesList = observer(function QueriesList() {

	const history = useHistory()
	const { queriesListIsOpen, toggleQueriesList, currentTag } = GalleryStore
	const { setQuery, query, currentQuery } = QueriesStore
	const { switchTab, tabs } = TabsStore

	const [list, setList] = useState([])

	useEffect(() => {
		const main = async () => {
			const { data } = await getTaggedQueriesList(currentTag)
			setList(data)
		} 
		currentTag && main()
	}, [currentTag])

	const handleClick = queryFromGallery => {
		if (query.map(query => query.id).indexOf(queryFromGallery.id) === -1) {
			let data = {...queryFromGallery, variables: queryFromGallery.arguments}
			let newQuery = {...data}
			setQuery(newQuery, queryFromGallery.id)
		} else {
			let tabID = query.map(query => query.id).indexOf(queryFromGallery.id)
			switchTab(tabs[tabID].id)
		}
		toggleQueriesList()
	}
	
	return (
		<div className={'querylist__root' + (queriesListIsOpen ? ' querylist__root_active' : '')}>
			<Table striped bordered hover size="sm">
				<thead>
					<tr>
						<th>Name</th>
						<th>Tag</th>
						<th>Description</th>
						<th>Author</th>
					</tr>
				</thead>
				<tbody>
					{
						list && list.map((item, i, arr) => {
							if (i+1 !== arr.length) {
								return (<tr key={item.name+i}>
											<td onClick={() => handleClick(item)}>{item.name}</td>
											<td>{item.tags}</td>
											<td>{item.description}</td>
											<td>{item.account_id}</td>
										</tr>)
							} 
						})
					}
				</tbody>
			</Table>
		</div>
	)
})

export default QueriesList