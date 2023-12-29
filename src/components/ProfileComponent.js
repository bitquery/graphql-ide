import React, { useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { UserStore } from '../store/queriesStore'
import UserIcon from './icons/UserIcon'
import { Dropdown } from 'react-bootstrap'

const Profile = observer(() => {

	const { getUser, user } = UserStore

	useEffect(() => {
		getUser()
		// eslint-disable-next-line 
	}, [])

	return !user?.id ? (
		<div className="flex profile__menu d-none d-lg-block" >
			<a className="profile__email" href={`${user?.graphql_admin_url}/auth/login?redirect_to=${window.location.href}`}>
				Login
				<UserIcon />
			</a>
		</div>
	) : <Dropdown className={'d-none d-lg-block'}>
			<a aria-label='discord' className='link__hire navigation-link-color' target='_blank' href='https://discord.gg/EEBVTQnb2E'>
				<i className="bi bi-discord"></i>
			</a>
			<a aria-label='telegram' className='link__hire navigation-link-color' target='_blank' href='https://t.me/bloxy_info/'>
				<i className="bi bi-telegram"></i>
			</a>
			<a className='link__hire navigation-link-color' target='_blank' href='https://streaming.bitquery.io/tutorial/'>Streaming API (V2  API Docs)</a>
			<a className='link__hire navigation-link-color' target='_blank' href='https://community.bitquery.io/'>Forum</a>
			<a className='link__hire navigation-link-color' target='_blank' href='https://community.bitquery.io/t/how-to-get-started-with-bitquerys-blockchain-graphql-apis/13'>Getting started</a>
			<a className='link__hire navigation-link-color' target='_blank' href='https://angel.co/company/bitquery/jobs'>We are hiring!</a>
			<Dropdown.Toggle className="cursor-pointer dropdown-toggler" as={'a'} role="button" tabIndex="0" aria-label="account menu">
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
