import React, { useEffect, useState } from 'react'
import { observer } from 'mobx-react'
import { getTagsList } from "../../api/api"
import { GalleryStore } from '../../store/galleryStore'

const NewGallery = observer(function NewGallery() {

	const { tagListIsOpen, queriesListIsOpen, toggleQueriesList, setCurrentTag, currentTag } = GalleryStore
	const [tagsList, setTagsList] = useState([])
	
	useEffect(() => {
		const onload = async () => {
			try {
				const { data } = await getTagsList()
				setTagsList(data)
			} catch (error) {
				console.log(error)				
			}
		}
		onload()
	}, [])

	const handleClick = tag => {
		setCurrentTag(tag)
		console.log(tagListIsOpen, tag, currentTag)
		if (queriesListIsOpen && tag === currentTag || !queriesListIsOpen) {
			toggleQueriesList()
		}
	}
	
	return (
		<div className="newGallery__root">
			<ul className="newGallery__listWrapper">
				{
					tagsList.map(({tag, id, tags_count}) => (
						<li 
							className="newGallery__listItem" 
							key={`${id}-${tags_count}`}
							onClick={() => handleClick(tag)}
						>
							{`#${tag} (${tags_count})`}
						</li>
					))
				}
			</ul>			
		</div>
	)
}) 

export default NewGallery