import React, { useEffect, useState } from 'react'
import { logout } from '../api/api'
import { observer } from 'mobx-react-lite'
import ModalStore from '../store/modalStore'
import { Link, useRouteMatch } from 'react-router-dom'
import { UserStore } from '../store/queriesStore'
import ClickOutside  from 'react-click-outside';

const Profile = observer(() => {
	const { url } = useRouteMatch()
	const { getUser, user, setUser } = UserStore
	const { toggleRegister } = ModalStore
	const [showProfileMenu, setShowProfileMenu] = useState(false)
	const toggleProfileMenu = () => user && setShowProfileMenu(prev => !prev)
	const clickOutside = e => {
		e.target.classList.value !== 'profile__image' && setShowProfileMenu(false)
	}

	const logOut = async () => {
		await logout().catch(e => console.log(e))
		setUser(null)
		setShowProfileMenu(prev => !prev)
	}
	useEffect(() => {
		getUser()
	}, [])

	if (!user) return (
		<i className="profile__image far fa-user-circle" onClick={toggleRegister} />
	)
	return (
		<div className="dropdown flex profile__menu">
			<p className="profile__email"> {user.email} </p>
			<i className="profile__image far fa-user-circle" 
				id="dropdownMenuButton" 
				data-toggle="dropdown" 
				aria-haspopup="true" 
				aria-expanded="false" 
				onClick={toggleProfileMenu} 
			/>
			<div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
				<Link className="dropdown-item" to="/changepwd" >Change password</Link>
				<a className="dropdown-item" href="#" onClick={logOut}>Logout</a>
			</div>
		</div>
	)
})

export default Profile
