import React, { useEffect } from 'react'
import { logout } from '../api/api'
import { observer } from 'mobx-react-lite'
import ModalStore from '../store/modalStore'
import { UserStore } from '../store/queriesStore'

const Profile = observer(() => {
	const { getUser, user, setUser } = UserStore
	const { toggleModal, toggleLogin, toggleChangePassword } = ModalStore

	const clickHandler = () => {
		toggleModal()
		toggleLogin()
	}
	const changePasswordHadler = () => {
		toggleModal()
		toggleChangePassword()
	}
	const logOut = async () => {
		await logout().catch(e => console.log(e))
		setUser(null)
	}
	useEffect(() => {
		getUser()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	if (!user) return (
		<div className="flex profile__menu" onClick={clickHandler}>
			<a className="profile__email" href="# ">Login</a>
			<i className="profile__image far fa-user-circle" />
		</div>
	)
	return (
		<div className="dropdown flex profile__menu">
			<p className="profile__email"> {user.email} </p>
			<i className="profile__image far fa-user-circle" 
				id="dropdownMenuButton" 
				data-toggle="dropdown" 
				aria-haspopup="true" 
				aria-expanded="false" 
			/>
			<div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
				<a className="dropdown-item" href="# " onClick={changePasswordHadler} >Change password</a>
				<a className="dropdown-item" href="# " onClick={logOut}>Logout</a>
			</div>
		</div>
	)
})

export default Profile
