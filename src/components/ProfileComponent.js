import React, { useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import ModalStore from '../store/modalStore'
import { UserStore } from '../store/queriesStore'
import UserIcon from './icons/UserIcon'
import { Dropdown } from 'react-bootstrap'

const Profile = observer(() => {

	const { getUser, user } = UserStore
	const { toggleModal, toggleLogin } = ModalStore

	const clickHandler = () => {
		toggleModal()
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
	) : <Dropdown className={'d-none d-lg-block'}>
			<a className='link__hire' target='_blank' href='https://discord.gg/EEBVTQnb2E'>
				<i className="bi bi-discord"></i>
			</a>
			<a className='link__hire' target='_blank' href='https://t.me/bloxy_info/'>
				<i className="bi bi-telegram"></i>
			</a>
			<a className='link__hire' target='_blank' href='https://community.bitquery.io/'>Forum</a>
			<a className='link__hire' target='_blank' href='https://community.bitquery.io/t/how-to-get-started-with-bitquerys-blockchain-graphql-apis/13'>Getting started</a>
			<a className='link__hire' target='_blank' href='https://angel.co/company/bitquery/jobs'>We are hiring!</a>
			<Dropdown.Toggle className="cursor-pointer dropdown-toggler" as={'a'} >
				<i className="bi bi-person"></i>
			</Dropdown.Toggle>
		
			<Dropdown.Menu className="dropdown-menu dropdown-menu-right">
				<Dropdown.Header>{user.email}</Dropdown.Header>
				<Dropdown.Divider/>
				{ user.role === 'admin' &&  <Dropdown.Item href={`${user?.graphql_admin_url}/admin/accounts`}>Admin</Dropdown.Item>}
				{ user.role === 'admin' && <Dropdown.Divider/> }
				<Dropdown.Item href={`${user?.graphql_admin_url}/team/members/new`}>Invite team member</Dropdown.Item>
				<Dropdown.Divider/>
				<Dropdown.Item href={`${user?.graphql_admin_url}/user/account`}>Account</Dropdown.Item>
				<Dropdown.Item href={`${user?.graphql_admin_url}/user/api_key`}>API key</Dropdown.Item>
				<Dropdown.Item href={`${user?.graphql_admin_url}/auth/logout`}>Logout</Dropdown.Item>
			</Dropdown.Menu>
		</Dropdown>
})

export default Profile
