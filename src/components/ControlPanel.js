import React from 'react'
import TabsComponent from './TabsComponent'
import ProfileComponent from './ProfileComponent'
import {QueriesStore} from '../store/queriesStore'
import { observer } from 'mobx-react-lite'
import logo from '../assets/images/bitquery_logo_w.png'

const ControlPanel = observer(function ControlPanel() {
	const { isMobile } = QueriesStore
	return (
		<div class="navbar navbar-expand-xl navbar-light bg-white mb-2">
			<a href="https://bitquery.io" className="navbar-brand topBar__logo">
				<img 
					className="topBar__logo__img" 
					src={logo}
					alt="logo"
				/>
			</a>
			<div class="collapse navbar-collapse" id="navbarSupportedContent">
				<form class="form-inline my-2 my-lg-0">
					<input class="form-control form-control-sm mr-sm-2" type="search" placeholder="Search" aria-label="Search" />
				</form>
				<ul class="navbar-nav mr-auto mt-2 mt-lg-0">
					<li class="nav-item active">
						<a class="nav-link text-secondary" href="layout_test.html"><i class="bi bi-play"></i>Develop</a>
					</li>
					<li class="nav-item">
						<a class="nav-link text-primary" href="layout_test2.html"><i class="bi bi-terminal"></i>Explore</a>
					</li>
					<li class="nav-item">
						<a class="nav-link text-primary" href="layout_test2.html"><i class="bi bi-star"></i>My Queries</a>
					</li>
				</ul>
				<ProfileComponent />
			</div>
		</div>
	)
})

export default ControlPanel
