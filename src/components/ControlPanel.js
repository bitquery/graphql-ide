import React, { useState, useEffect } from 'react'
import ProfileComponent from './ProfileComponent'
import { QueriesStore, UserStore } from '../store/queriesStore'
import { observer } from 'mobx-react-lite'
import useDebounce from '../utils/useDebounce'
import { Link, useHistory, useLocation } from 'react-router-dom'
import logo from '../assets/images/bitquery_logo_w.png'
import { GalleryStore } from '../store/galleryStore'
import { useQuery } from '../utils/useQuery'

const ControlPanel = observer(function ControlPanel() {
	const { user } = UserStore
	const { currentQuery} = QueriesStore
	const { currentTag } = GalleryStore
	const [search, setSearch] = useState('')
	const [active, setActive] = useState(1)
	const searchValue = useDebounce(search, 500)
	const history = useHistory()
	const location = useLocation()
	const query = useQuery()
	
	useEffect(() => {
		query.set('search', searchValue)
		searchValue && history.push({
			pathname: '/explore/All%20queries',
			search: `${searchValue ? '?search=' : ''}${searchValue}`
		})
	}, [searchValue])

	useEffect(() => {
		currentTag !== 'All queries' && setSearch('')
	}, [currentTag])
	
	useEffect(() => {
		const queryListType = location.pathname.match(/[a-zA-Z]+/gm)?.[0]
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

	const onClick = title => {
		setSearch('')
		document.title = title
	}

	return (
		<div className="navbar navbar-expand-lg navbar-light bg-white mb-2">
			<a href="#tabs" className="skip-to-main-content" >Skip to main content</a>
			<a href='/' className="navbar-brand topBar__logo">
				<img
					className="topBar__logo__img"
					src={logo}
					alt="Bitquery"
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
					<li className='nav-item' tabIndex='-1'>
						<Link className={`nav-link ${active === 1 ? 'nav-active' : 'navigation-link-color'}`} to='/' onClick={() => onClick(currentQuery.name || 'New Query')}  ><i className="bi bi-play mr-2"></i>Develop</Link>
					</li>
					<li className='nav-item' tabIndex='-1'>
						<Link className={`nav-link ${active === 2 ? 'nav-active' : 'navigation-link-color'}`} to={`/explore/All%20queries`} onClick={() => onClick('Explore')} ><i className="bi bi-terminal mr-2"></i>Explore</Link>
					</li>
					{user?.id && <li className='nav-item' tabIndex='-1'>
						<Link className={`nav-link ${active === 3 ? 'nav-active' : 'navigation-link-color'}`} to={`/myqueries/All%20queries`} onClick={() => onClick('My Queries')}><i className="bi bi-star mr-2"></i>My Queries</Link>
					</li>}
					{(user?.children_count || user?.ancestry) && <li className='nav-item' tabIndex='-1'>
						<Link className={`nav-link ${active === 4 ? 'nav-active' : 'navigation-link-color'}`} to={`/team/All%20queries`} onClick={() => onClick('Team')}><i className="bi bi-people mr-2"></i>Team</Link>
					</li>}
					<li className="nav-item d-lg-none" tabIndex='-1'>
						<a className="nav-link navigation-link-color" href="https://discord.gg/EEBVTQnb2E"><i className="bi bi-discord">Discord</i></a>
					</li>
					<li className="nav-item d-lg-none" tabIndex='-1'>
						<a className="nav-link navigation-link-color" href="https://t.me/bloxy_info/"><i className="bi bi-telegram mr-2"></i>Telegram</a>
					</li>
					<li className="nav-item d-lg-none" tabIndex='-1'>
						<a className="nav-link navigation-link-color" href="https://streaming.bitquery.io/tutorial/">Streaming API (V2  API Docs)</a>
					</li>
					<li className="nav-item d-lg-none" tabIndex='-1'>
						<a className="nav-link navigation-link-color" href="https://community.bitquery.io/">Forum</a>
					</li>
					<li className="nav-item d-lg-none" tabIndex='-1'>
						<a className="nav-link navigation-link-color" href="https://community.bitquery.io/t/how-to-get-started-with-bitquerys-blockchain-graphql-apis/13">Getting started</a>
					</li>
					<li className="nav-item d-lg-none" tabIndex='-1'>
						<a className="nav-link navigation-link-color" href="https://angel.co/company/bitquery/jobs">We are hiring!</a>
					</li>
					{!user?.id && <li className="nav-item d-lg-none">
						<a className="nav-link navigation-link-color" href={`${user?.graphql_admin_url}/auth/login?redirect_to=${window.location.href}`}>Login</a>
					</li>}
					{ user?.role === 'admin' && <li className="nav-item d-lg-none">
						<a className="nav-link navigation-link-color" href={`${user?.graphql_admin_url}/admin/accounts`}>Admin</a>
					</li>}
					{user?.id && <li className="nav-item d-lg-none">
						<a className="nav-link navigation-link-color" href={`${user?.graphql_admin_url}/team/members/new`}>Invite team member</a>
					</li>}
					{user?.id && <li className="nav-item d-lg-none">
						<a className="nav-link navigation-link-color" href={`${user?.graphql_admin_url}/user/account`}>Account</a>
					</li>}
					{user?.id && <li className="nav-item d-lg-none">
						<a className="nav-link navigation-link-color" href={`${user?.graphql_admin_url}/user/api_key`}>API key</a>
					</li>}
					{user?.id && <li className="nav-item d-lg-none">
						<a className="nav-link navigation-link-color" href={`${user?.graphql_admin_url}/auth/logout`}>Logout</a>
					</li>}
				</ul>
				<ProfileComponent />
			</div>
		</div>
	)
})

export default ControlPanel
