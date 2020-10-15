import React, { useContext, useState } from 'react'
import { ModalContext } from './modal/ModalContext'
import profileImg from '../assets/images/user.svg'
import { logout } from '../api/api'

function Profile({ user, setUser }) {
	const { toggleRegister } = useContext(ModalContext)
	const [showProfileMenu, setShowProfileMenu] = useState(false)
	const toggleProfileMenu = () => user && setShowProfileMenu(prev => !prev)
	const logOut = async () => {
		await logout().catch(e => console.log(e))
		setUser(null)
		setShowProfileMenu(prev => !prev)
	}

	if (!user) return (
		<button className="button button__signin"
			onClick={toggleRegister}
		> Login </button>
	)
	return (
		<div className="profile flex">
			<img src={profileImg} alt="Profile" onClick={toggleProfileMenu} />
			<p className="profile__email"> {user.email} </p>
			<div
				className={'profile__controls flex flex-col ' + (showProfileMenu && 'active')}
			>
				<button className="button button__reset">Change password</button>
				<button className="button button__logout" onClick={logOut} >Logout</button>
			</div>
		</div>
	)
}

export default Profile
