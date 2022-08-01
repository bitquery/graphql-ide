import React, { useState, useEffect, useRef } from 'react'
import ProfileComponent from './ProfileComponent'
import { QueriesStore } from '../store/queriesStore'
import { observer } from 'mobx-react-lite'
import useDebounce from '../utils/useDebounce'
import { Link, useHistory, useLocation } from 'react-router-dom'
import logo from '../assets/images/bitquery_logo_w.png'
import { GalleryStore } from '../store/galleryStore'
import { getSearchResults } from '../api/api'

const ControlPanel = observer(function ControlPanel() {
	const ref = useRef(null)
	const { isMobile, setSearchValue } = QueriesStore
	const { setCurrentTag } = GalleryStore
	const [search, setSearch] = useState('')
	const [active, setActive] = useState(1)
	const searchValue = useDebounce(search, 500)
	const history = useHistory()
	const location = useLocation()

	useEffect(() => {
		setSearchValue(searchValue)
		if (searchValue) {
			history.push(`${process.env.REACT_APP_IDE_URL}/explore`)
			setActive(2)
		}
	}, [searchValue])
	
	useEffect(() => {
		if (history.location.pathname === `${process.env.REACT_APP_IDE_URL}/explore`) {
			setActive(2)
		} else if (history.location.pathname === `${process.env.REACT_APP_IDE_URL}/myqueries`) {
			setActive(3)
		} else {
			setActive(1)
		}
	}, [location.pathname])

	const searchHandler = () => {
		setSearch('')
	}

	return (
		<div className="navbar navbar-expand-md navbar-light bg-white mb-2">
			<a href="https://bitquery.io" className="navbar-brand topBar__logo">
				<img
					className="topBar__logo__img"
					src={logo}
					alt="logo"
				/>
			</a>
			<button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
				<span className="navbar-toggler-icon"></span>
			</button>
			<div className="collapse navbar-collapse" id="navbarSupportedContent">
				<form className="form-inline my-2 my-lg-0">
					<input value={search} onChange={e=>setSearch(e.target.value)} ref={element=>(element||{}).onsearch=searchHandler} className="form-control form-control-sm mr-sm-2" type="search" placeholder="Search" aria-label="Search" />
				</form>
				<ul className="navbar-nav mr-auto mt-2 mt-lg-0">
					<li className='nav-item'>
						<Link className={`nav-link ${active === 1 ? 'nav-active' : 'text-primary'}`} to={process.env.REACT_APP_IDE_URL}  ><i className="bi bi-play mr-2"></i>Develop</Link>
					</li>
					<li className='nav-item'>
						<Link className={`nav-link ${active === 2 ? 'nav-active' : 'text-primary'}`} to={`${process.env.REACT_APP_IDE_URL}/explore`}  ><i className="bi bi-terminal mr-2"></i>Explore</Link>
					</li>
					<li className='nav-item'>
						<Link className={`nav-link ${active === 3 ? 'nav-active' : 'text-primary'}`} to={`${process.env.REACT_APP_IDE_URL}/myqueries`} ><i className="bi bi-star mr-2"></i>My Queries</Link>
					</li>
				</ul>
				<ProfileComponent />
			</div>
		</div>
	)
})

export default ControlPanel
