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
	const { queriesListIsOpen, currentTag,
		toggleQueriesList, toggleTagsList, setCurrentTag } = GalleryStore
	const { currentQuery, updateQuery, schema, queryJustSaved } = QueriesStore
	const { index } = TabsStore
	const [tagsList, setTagsList] = useState([])
	const [showBuilder, toggleBuilder] = useState(false)
	
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

	const Component = showBuilder 
		? 	<QueryBuilder
				width={'300px'}
				minWidth={'300px'}
				title={'Builder'}
				schema={schema}
				query={currentQuery.query}
				onEdit={query=>updateQuery({query}, index)}
				explorerIsOpen={showBuilder}
				getDefaultScalarArgValue={getDefaultScalarArgValue}
				makeDefaultArg={makeDefaultArg}
			/>
		: 	<ul className="newGallery__listWrapper">
				{
					tagsList.map(({tag, tag_id, tags_count}) => (
						<li 
							className={"newGallery__listItem"+((currentTag===tag&&queriesListIsOpen)?' newGallery__listItem_active':'')}
							key={`${tag_id}-${tags_count}`}
							onClick={() => handleClick(tag)}
						>
							{`${tag_id ? '#' : ''}${tag} (${tags_count})`}
						</li>
					))
				}
			</ul>		
	
	return (
		<div className="newGallery__root">
			<div className="newGallery__header flex">
				<i className="newGallery__close fas fa-angle-double-left" onClick={toggleTagsList} />
				<ul className="nav nav-tabs">
					<li className="nav-item" onClick={() => toggleBuilder(true)}>
						<a className={"nav-link " + (showBuilder && 'active')} href="# ">Builder</a>
					</li>
					<li className="nav-item" onClick={() => toggleBuilder(false)}>
						<a className={"nav-link " + (!showBuilder && 'active')} href="# ">Queries</a>
					</li>
				</ul>
				<i className="newGallery__close_helper fas fa-angle-double-left"/>
			</div>
			{ Component }
		</div>
	)
}) 

export default NewGallery
