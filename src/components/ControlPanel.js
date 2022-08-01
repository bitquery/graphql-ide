import React, { useState, useEffect, useRef } from 'react'
import ProfileComponent from './ProfileComponent'
import { QueriesStore, UserStore } from '../store/queriesStore'
import { observer } from 'mobx-react-lite'
import useDebounce from '../utils/useDebounce'
import { Link, useHistory, useLocation } from 'react-router-dom'
import logo from '../assets/images/bitquery_logo_w.png'
import { GalleryStore } from '../store/galleryStore'
import { getSearchResults } from '../api/api'
import ModalStore from '../store/modalStore'
import { logout } from '../api/api'

const ControlPanel = observer(function ControlPanel() {
	const ref = useRef(null)
	const { user, setUser } = UserStore
	const { isMobile, setSearchValue } = QueriesStore
	const { fade, toggleModal, toggleLogin, toggleChangePassword, toggleApiKey } = ModalStore
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

	const changePasswordHadler = () => {
		toggleModal()
		toggleChangePassword()
	}
	const apiKeyHandler = () => {
		toggleModal()
		toggleApiKey()
	}
	const logOut = async () => {
		await logout().catch(e => console.log(e))
		setUser(null)
		toggleModal({fade: true})
		toggleLogin()
	}

	return (
		<div className="navbar navbar-expand-lg navbar-light bg-white mb-2">
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
					<li className="nav-item d-lg-none">
						<a className="nav-link text-primary" href="https://community.bitquery.io/t/how-to-get-started-with-bitquerys-blockchain-graphql-apis/13">Getting started</a>
					</li>
					<li className="nav-item d-lg-none">
						<a className="nav-link text-primary" href="https://angel.co/company/bitquery/jobs">We are hiring!</a>
					</li>
					{ user?.role === 'admin' && <li className="nav-item d-lg-none">
						<a className="nav-link text-primary" href="https://graphql.bitquery.io/admin/accounts">Admin</a>
					</li>}
					<li className="nav-item d-lg-none">
						<a className="nav-link text-primary" href="# " onClick={apiKeyHandler}>API Key</a>
					</li>
					<li className="nav-item d-lg-none">
						<a className="nav-link text-primary" href="https://graphql.bitquery.io/user/account">Profile</a>
					</li>
					<li className="nav-item d-lg-none">
						<a className="nav-link text-primary" href="# " onClick={changePasswordHadler}>Change password</a>
					</li>
					<li className="nav-item d-lg-none">
						<a className="nav-link text-primary" href="# " onClick={logOut}>Logout</a>
					</li>
				</ul>
				<ProfileComponent />
			</div>
		</div>
	)
})

export default ControlPanel
