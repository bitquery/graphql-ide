import React, { useEffect } from 'react'
import { logout } from '../api/api'
import { observer } from 'mobx-react-lite'
import ModalStore from '../store/modalStore'
import { UserStore } from '../store/queriesStore'
import UserIcon from './icons/UserIcon'
import { Dropdown } from 'react-bootstrap'

const Profile = observer(() => {
	const { getUser, user, setUser } = UserStore
	const { fade, toggleModal, toggleLogin, toggleChangePassword, toggleApiKey } = ModalStore

	const clickHandler = () => {
		toggleModal()
		toggleLogin()
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
	useEffect(() => {
		getUser()
		// eslint-disable-next-line 
	}, [])

	return !user ? (
		<div className="flex profile__menu d-none d-lg-block" onClick={clickHandler}>
			<a className="profile__email" href="# ">Login</a>
			<UserIcon />
		</div>
	) : <Dropdown className={'profile__menu d-none d-lg-block'}>
			<a className='link__hire' target='_blank' href='https://community.bitquery.io/t/how-to-get-started-with-bitquerys-blockchain-graphql-apis/13'>Getting started</a>
			<a className='link__hire' target='_blank' href='https://angel.co/company/bitquery/jobs'>We are hiring!</a>
			<Dropdown.Toggle id="dropdown-basic" as={'span'} >
				<UserIcon />
			</Dropdown.Toggle>
		
			<Dropdown.Menu>
				<Dropdown.Header>{user.email}</Dropdown.Header>
				<Dropdown.Divider/>
				{ user.role === 'admin' &&  <Dropdown.Item href="https://graphql.bitquery.io/admin/accounts">Admin</Dropdown.Item>}
				{ user.role === 'admin' && <Dropdown.Divider/> }
				<Dropdown.Item href="# " onClick={apiKeyHandler}>API Key</Dropdown.Item>
				<Dropdown.Item href="https://graphql.bitquery.io/user/account">Profile</Dropdown.Item>
				<Dropdown.Item href="# " onClick={changePasswordHadler}>Change password</Dropdown.Item>
				<Dropdown.Item href="# " onClick={logOut}>Logout</Dropdown.Item>
			</Dropdown.Menu>
		</Dropdown>
})

export default Profile
