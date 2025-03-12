import React, { useState, useEffect } from 'react'
import { QueriesStore, TabsStore, UserStore } from '../store/queriesStore'
import { GalleryStore } from '../store/galleryStore'
import { getTagsList } from '../api/api'
import QueriesList from './Gallery/QueriesList'
import { observer } from 'mobx-react'
import { Route, Switch, useHistory, useLocation, useRouteMatch } from 'react-router-dom'

const ExploreComponent = observer(function ExploreComponent() {
	const location = useLocation()
	const history = useHistory()
	const { path } = useRouteMatch()
	const { user } = UserStore
	const { queriesListIsOpen, currentTag,
		toggleQueriesList, toggleTagsList, setCurrentTag } = GalleryStore
	const { currentQuery, updateQuery, schema, queryJustSaved, setSearchValue } = QueriesStore
	const [tagsList, setTagsList] = useState([])
	useEffect(() => {
		const onload = async () => {
			const queryListType = location.pathname.match(/[a-zA-Z]+/gm)[0]
			try {
				const { data } = await getTagsList(queryListType)
				setTagsList(data)
				if (location.pathname) {
					const tag = location.pathname.split('/').at(-1)
					setCurrentTag(tag)
					document.querySelector('meta[name="keywords"]').setAttribute('content', `${tag}, queries, query, explore ${tag}, explore ${tag} queries, ${tag} queries`)
					document.querySelector('meta[name="description"]').setAttribute('content', `Explore ${tag} queries`)
					document.title = `Explore ${tag} queries`
				}
			} catch (error) {
				console.log(error)
			}
		}
		user && onload()
	}, [queryJustSaved, user, location.pathname])

	const handleClick = tag => {
		setSearchValue('')
		setCurrentTag(tag)
		history.push(tag)
		if (queriesListIsOpen && tag === currentTag || !queriesListIsOpen) {
			toggleQueriesList()
		}
	}

	return (
		<div className="container-fluid overflow-auto mt-2">
			<div className="row bit-test" style={{height:'100vh'}}>
				<div className="col-lg-3 mb-3" style={{height:'100%'}}>
					<div className="card bitquery-tagList-container scrollable-container">
						<div className="card-body">
							<ul aria-label='of query tags' tabIndex={0} className="list-group list-group-flush">
								{
									tagsList.map(({ tag, tag_id, tags_count }) => (
										<li
											className={`list-group-item d-flex justify-content-between align-items-center list-group-item-action cursor-pointer ${currentTag === tag ? 'tag-active' : ''}`}
											key={`${tag_id}-${tags_count}`}
											onClick={() => handleClick(tag)}
											role='button'
											tabIndex={0}
										>
											<span style={{wordBreak: 'break-word'}}>{tag_id !==0 && <i  style={{color:'#3f1f8a'}} className="bi bi-tag"></i>} { tag } </span>
											<span className="badge  badge-pill"> { tags_count } </span>
										</li>
									))
								}
							</ul>
						</div>
					</div>
				</div>
				<Switch>
					<Route path={`${path}/:tag`}>
						<QueriesList />
					</Route>
					<Route path={path}>
						<QueriesList />
					</Route>
				</Switch>
			</div>
		</div>
	)
})

export default ExploreComponent