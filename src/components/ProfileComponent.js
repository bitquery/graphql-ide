import React, { useEffect, useState } from 'react'
import profileImg from '../assets/images/user.svg'
import { logout } from '../api/api'
import { observer } from 'mobx-react-lite'
import ModalStore from '../store/modalStore'
import { Link } from 'react-router-dom'
import { UserStore } from '../store/queriesStore'

const Profile = observer(() => {
	const { getUser, user, setUser } = UserStore
	const { toggleRegister } = ModalStore
	const [showProfileMenu, setShowProfileMenu] = useState(false)
	const toggleProfileMenu = () => user && setShowProfileMenu(prev => !prev)
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
			<img src={profileImg} alt="Profile" onClick={toggleProfileMenu} />
			<p className="profile__email"> {user.email} </p>
			<div
				className={'profile__controls flex flex-col ' + (showProfileMenu && 'active')}
			>
				<button className="button button__reset">
					<Link to="/changepwd" >Change password</Link>
				</button>
				<button className="button button__logout" onClick={logOut} >Logout</button>
			</div>
		</div>
	)
})

export default Profile
