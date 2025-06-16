import React, { useEffect, useState } from 'react'
import { observer } from 'mobx-react'
import { getTagsList } from "../../api/api"
import { GalleryStore } from '../../store/galleryStore'
import { QueriesStore, TabsStore } from '../../store/queriesStore'
import { UserStore } from '../../store/queriesStore'
import { makeDefaultArg, getDefaultScalarArgValue } from "../Gallery/QueryBuilder/CustomArgs"
import QueryBuilder from '../Gallery/QueryBuilder/index'
import modalStore from '../../store/modalStore'

const NewGallery = observer(function NewGallery() {

	const { user } = UserStore
	const { toggleTagsList,  setSubMenu} = GalleryStore
	const { currentQuery, updateQuery, schema, queryJustSaved, fetchError } = QueriesStore
	const { index } = TabsStore
	const [tagsList, setTagsList] = useState([])
	const [activeTab, setActiveTab] = useState('builder');
	const { toggleStartersQueriesModal, toggleModal } = modalStore

	useEffect(() => {
		const onload = async () => {
			try {
				const { data } = await getTagsList('explore')
				setTagsList(data)
			} catch (error) {
				console.log(error)
			}
		}
		user && onload()
	}, [queryJustSaved, user])

	const handlePopularSelect = (key) => {
		toggleModal()
		toggleStartersQueriesModal()
		setSubMenu(key === 'popular-streams' ? 1 : 0)
	}

	return (
		<div className="newGallery__root">
			<div className="newGallery__topbar justify-content-between">
				<div className="sidebar-button-group">
					<button className={`sidebar-btn ${activeTab === 'builder' ? 'active' : ''}`} onClick={() => setActiveTab('builder')}>
						Builder
					</button>
					<button className="sidebar-btn" onClick={() => handlePopularSelect('popular-queries')}>
						Queries
					</button>
					<button className="sidebar-btn" onClick={() => handlePopularSelect('popular-streams')}>
						Streams
					</button>
				</div>
				<i className="bi bi-chevron-double-left cursor-pointer mr-2 text-primary bitquery-ico" onClick={toggleTagsList} />
			</div>
			<div className="sidebar-content">
				{activeTab === 'builder' && (
					<QueryBuilder
						width={'100%'}
						minWidth={'100%'}
						title={'Builder'}
						fetchError={fetchError}
						schema={schema[currentQuery.endpoint_url]}
						query={currentQuery.query}
						user={user}
						onEdit={query => updateQuery({ query }, index)}
						explorerIsOpen={true}
						getDefaultScalarArgValue={getDefaultScalarArgValue}
						makeDefaultArg={makeDefaultArg}
					/>
				)}
			</div>
		</div>
	)
})

export default NewGallery
