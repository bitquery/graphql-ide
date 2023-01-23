import React, { useState, useEffect } from 'react'
import ProfileComponent from './ProfileComponent'
import { QueriesStore, UserStore } from '../store/queriesStore'
import { observer } from 'mobx-react-lite'
import useDebounce from '../utils/useDebounce'
import { Link, useHistory, useLocation } from 'react-router-dom'
import logo from '../assets/images/bitquery_logo_w.png'
import { GalleryStore } from '../store/galleryStore'
import ModalStore from '../store/modalStore'
import { logout } from '../api/api'

const ControlPanel = observer(function ControlPanel() {
	const { user, setUser } = UserStore
	const { setSearchValue } = QueriesStore
	const { toggleModal, toggleLogin, toggleChangePassword, toggleApiKey } = ModalStore
	const { setCurrentTag, currentTag } = GalleryStore
	const [search, setSearch] = useState('')
	const [active, setActive] = useState(1)
	const searchValue = useDebounce(search, 500)
	const history = useHistory()
	const location = useLocation()

	useEffect(() => {
		setSearchValue(searchValue)
		if (searchValue) {
			setCurrentTag('All queries')
			history.push(`${process.env.REACT_APP_IDE_URL}/explore/All%20queries`, {detail: 'search'}	)
			setActive(2)
		}
	}, [searchValue])

	useEffect(() => {
		currentTag !== 'All queries' && setSearch('')
	}, [currentTag])
	
	useEffect(() => {
		const queryListType = location.pathname.replace(`${process.env.REACT_APP_IDE_URL}/`, '').match(/[a-zA-Z]+/gm)?.[0]
		if (queryListType === 'explore') {
			setActive(2)
		} else if (queryListType === 'myqueries') {
			setActive(3)
		} else if (queryListType === 'team') {
			setActive(4)
		} else {
			setActive(1)
		}
	}, [location.pathname])

	const searchHandler = (e) => {
		e.preventDefault()
		if (e.which = 13) {
			return false
		} else {
			setSearch('')
		}
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
		window.location.replace(`${window.location.origin}/auth/login`)
	}

	return (
		<div className="navbar navbar-expand-lg navbar-light bg-white mb-2">
			<a href={process.env.REACT_APP_IDE_URL} className="navbar-brand topBar__logo">
				<img
					className="topBar__logo__img"
					src={logo}
					alt="logo"
				/>
			</a>
			<button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
				<span className="navbar-toggler-icon"></span>
			</button>
			<div className="collapse navbar-collapse" id="navbarSupportedContent" >
				<form className="form-inline my-2 my-lg-0" onSubmit={searchHandler} action="search">
					<input value={search} onChange={e=>setSearch(e.target.value)} className="form-control form-control-sm mr-sm-2" type="search" placeholder="Search Queries" aria-label="Search" />
				</form>
				<ul className="navbar-nav mr-auto mt-2 mt-lg-0">
					<li className='nav-item'>
						<Link className={`nav-link ${active === 1 ? 'nav-active' : 'text-primary'}`} to={process.env.REACT_APP_IDE_URL}  ><i className="bi bi-play mr-2"></i>Develop</Link>
					</li>
					<li className='nav-item'>
						<Link className={`nav-link ${active === 2 ? 'nav-active' : 'text-primary'}`} to={`${process.env.REACT_APP_IDE_URL}/explore/All%20queries`} onClick={()=>setSearch('')} ><i className="bi bi-terminal mr-2"></i>Explore</Link>
					</li>
					<li className='nav-item'>
						<Link className={`nav-link ${active === 3 ? 'nav-active' : 'text-primary'}`} to={`${process.env.REACT_APP_IDE_URL}/myqueries/All%20queries`} onClick={()=>setSearch('')}><i className="bi bi-star mr-2"></i>My Queries</Link>
					</li>
					{(user?.children_count || user?.ancestry) && <li className='nav-item'>
						<Link className={`nav-link ${active === 4 ? 'nav-active' : 'text-primary'}`} to={`${process.env.REACT_APP_IDE_URL}/team/All%20queries`} onClick={()=>setSearch('')}><i className="bi bi-people mr-2"></i>Team</Link>
					</li>}
					<li className="nav-item d-lg-none">
						<a className="nav-link text-primary" href="https://discord.gg/EEBVTQnb2E"><i className="bi bi-discord">Discord</i></a>
					</li>
					<li className="nav-item d-lg-none">
						<a className="nav-link text-primary" href="https://t.me/bloxy_info/"><i className="bi bi-telegram mr-2"></i>Telegram</a>
					</li>
					<li className="nav-item d-lg-none">
						<a className="nav-link text-primary" href="https://community.bitquery.io/">Forum</a>
					</li>
					<li className="nav-item d-lg-none">
						<a className="nav-link text-primary" href="https://community.bitquery.io/t/how-to-get-started-with-bitquerys-blockchain-graphql-apis/13">Getting started</a>
					</li>
					<li className="nav-item d-lg-none">
						<a className="nav-link text-primary" href="https://angel.co/company/bitquery/jobs">We are hiring!</a>
					</li>
					{ user?.role === 'admin' && <li className="nav-item d-lg-none">
						<a className="nav-link text-primary" href={`${window.location.origin}/admin/accounts`}>Admin</a>
					</li>}
					<li className="nav-item d-lg-none">
						<a className="nav-link text-primary" href={`${window.location.origin}/team/members/new`}>Invite team member</a>
					</li>
					<li className="nav-item d-lg-none">
						<a className="nav-link text-primary" href={`${window.location.origin}/user/account`}>Account</a>
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
