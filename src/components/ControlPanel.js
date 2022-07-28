import React, { useState, useEffect, useRef } from 'react'
import ProfileComponent from './ProfileComponent'
import { QueriesStore } from '../store/queriesStore'
import { observer } from 'mobx-react-lite'
import useDebounce from '../utils/useDebounce'
import { Link, useHistory } from 'react-router-dom'
import logo from '../assets/images/bitquery_logo_w.png'
import { GalleryStore } from '../store/galleryStore'
import { getSearchResults } from '../api/api'

const ControlPanel = observer(function ControlPanel() {
	const ref = useRef(null)
	const { isMobile, setSearchValue } = QueriesStore
	const { setCurrentTag } = GalleryStore
	const [search, setSearch] = useState('')
	const searchValue = useDebounce(search, 500)
	const history = useHistory()

	useEffect(() => {
		setSearchValue(searchValue)
		searchValue && history.push('/graphql/explore')
	}, [searchValue])

	const searchHandler = () => {
		setSearch('')
	}
	return (
		<div class="navbar navbar-expand-md navbar-light bg-white mb-2">
			<a href="https://bitquery.io" className="navbar-brand topBar__logo">
				<img
					className="topBar__logo__img"
					src={logo}
					alt="logo"
				/>
			</a>
			<button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
				<span class="navbar-toggler-icon"></span>
			</button>
			<div class="collapse navbar-collapse" id="navbarSupportedContent">
				<form class="form-inline my-2 my-lg-0">
					<input value={search} onChange={e=>setSearch(e.target.value)} ref={element=>(element||{}).onsearch=searchHandler} class="form-control form-control-sm mr-sm-2" type="search" placeholder="Search" aria-label="Search" />
				</form>
				<ul class="navbar-nav mr-auto mt-2 mt-lg-0">
					<li class="nav-item active">
						<Link class="nav-link text-secondary" to={"/graphql"}><i class="bi bi-play"></i>Develop</Link>
					</li>
					<li class="nav-item">
						<Link class="nav-link text-primary" to={"/graphql/explore"} ><i class="bi bi-terminal"></i>Explore</Link>
					</li>
					<li class="nav-item">
						<a class="nav-link text-primary" href="# " onClick={() => setCurrentTag('My queries')}><i class="bi bi-star"></i>My Queries</a>
					</li>
				</ul>
				<ProfileComponent />
			</div>
		</div>
	)
})

export default ControlPanel
