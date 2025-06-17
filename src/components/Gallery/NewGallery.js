import React, { useEffect, useState } from 'react'
import { observer } from 'mobx-react'
import { getTagsList } from "../../api/api"
import { GalleryStore } from '../../store/galleryStore'
import { QueriesStore, TabsStore } from '../../store/queriesStore'
import { UserStore } from '../../store/queriesStore'
import { makeDefaultArg, getDefaultScalarArgValue } from "../Gallery/QueryBuilder/CustomArgs"
import QueryBuilder from '../Gallery/QueryBuilder/index'
import StarterQueriesPanel from '../StarterQueriesPanel'

const NewGallery = observer(function NewGallery() {

	const { user } = UserStore
	const { toggleTagsList } = GalleryStore
	const { currentQuery, updateQuery, schema, queryJustSaved, fetchError } = QueriesStore
	const { index } = TabsStore
	const [tagsList, setTagsList] = useState([])
	const [activeTab, setActiveTab] = useState('builder');

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

	return (
		<div className="newGallery__root">
			<div className="newGallery__topbar justify-content-between">
				<div className="sidebar-button-group">
					<button className={`sidebar-btn ${activeTab === 'queries' ? 'active' : ''}`} onClick={() => setActiveTab('queries')}>
						Queries
					</button>
					<button className={`sidebar-btn ${activeTab === 'streams' ? 'active' : ''}`} onClick={() => setActiveTab('streams')}>
						Streams
					</button>
					<button className={`sidebar-btn ${activeTab === 'builder' ? 'active' : ''}`} onClick={() => setActiveTab('builder')}>
						Builder
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
				{activeTab === 'queries' && <StarterQueriesPanel type="queries" />}
				{activeTab === 'streams' && <StarterQueriesPanel type="subscriptions" />}
			</div>
		</div>
	)
})

export default NewGallery
