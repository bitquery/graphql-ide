import React, { useEffect, useState } from 'react'
import { getTagsList } from "../../api/api"

function NewGallery() {

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

	return (
		<div className="newGallery__root">
			<ul className="newGallery__listWrapper">
				<li className="newGallery__listItem">
					My queries {'(74)'}
				</li>
				{
					tagsList.map(({tag, id, tags_count}) => (
						<li className="newGallery__listItem">
							{`#${tag} (${tags_count})`}
						</li>
					))
				}
			</ul>			
		</div>
	)
}

export default NewGallery