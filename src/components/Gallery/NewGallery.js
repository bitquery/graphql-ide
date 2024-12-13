import React, { useEffect, useState } from 'react'
import { observer } from 'mobx-react'
import { getTagsList } from "../../api/api"
import { GalleryStore } from '../../store/galleryStore'
import { QueriesStore, TabsStore } from '../../store/queriesStore'
import { UserStore } from '../../store/queriesStore'
import { makeDefaultArg, getDefaultScalarArgValue } from "../Gallery/QueryBuilder/CustomArgs"
import QueryBuilder from '../Gallery/QueryBuilder/index'

const NewGallery = observer(function NewGallery() {

	const { user } = UserStore
	const { queriesListIsOpen, currentTag, tagListIsOpen,
		toggleQueriesList, toggleTagsList, setCurrentTag } = GalleryStore
	const { currentQuery, updateQuery, schema, queryJustSaved, fetchError } = QueriesStore
	const { index } = TabsStore
	const [tagsList, setTagsList] = useState([])
	const [showBuilder, toggleBuilder] = useState(false)
	
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

	const handleClick = tag => {
		setCurrentTag(tag)
		if (queriesListIsOpen && tag === currentTag || !queriesListIsOpen) {
			toggleQueriesList()
		}
	}

	return (
		<div className="newGallery__root">
			<div className="newGallery__topbar justify-content-between" style={{padding:'0 10px'}}>
				Builder
				<i className="bi bi-chevron-double-left cursor-pointer mr-2 text-primary bitquery-ico" onClick={toggleTagsList} />
			</div>
			<QueryBuilder
				width={'300px'}
				minWidth={'300px'}
				title={'Builder'}
				fetchError={fetchError}
				schema={schema[currentQuery.endpoint_url]}
				query={currentQuery.query}
				user={user}
				onEdit={query=>updateQuery({query}, index)}
				explorerIsOpen={true}
				getDefaultScalarArgValue={getDefaultScalarArgValue}
				makeDefaultArg={makeDefaultArg}
			/>
		</div>
	)
}) 

export default NewGallery
