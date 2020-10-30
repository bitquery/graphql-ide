import React, { useEffect, useState } from 'react'
import { logout } from '../api/api'
import { observer } from 'mobx-react-lite'
import ModalStore from '../store/modalStore'
import { Link } from 'react-router-dom'
import { UserStore } from '../store/queriesStore'
import ClickOutside  from 'react-click-outside';

const Profile = observer(() => {
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
		<button className="button button__signin"
			onClick={toggleRegister}
		> Login </button>
	)
	return (
		<div className="profile flex">
			<img src='https://cdn.jsdelivr.net/gh/Spendil/qqq@1.0/media/user.f49489c9.svg' className="profile__image" alt="Profile" onClick={toggleProfileMenu} />
			<p className="profile__email"> {user.email} </p>
			<ClickOutside
				onClickOutside={clickOutside}
			>
				<div
					className={'profile__controls flex flex-col ' + (showProfileMenu && 'active')}
					>
					<button className="profile__button">
						<Link to="/changepwd" >Change password</Link>
					</button>
					<button className="profile__button" onClick={logOut} >Logout</button>
				</div>
			</ClickOutside>
			
		</div>
	)
})

export default Profile
