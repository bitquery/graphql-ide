import React, {useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {UserStore} from '../store/queriesStore';
import UserIcon from './icons/UserIcon';
import {Dropdown, NavDropdown} from 'react-bootstrap';

const Profile = observer(() => {
    const {getUser, user} = UserStore;

    useEffect(() => {
        getUser();
        // eslint-disable-next-line
    }, [])

    return !user?.id ? (
        <div className="flex profile__menu d-none d-lg-block ml-auto">
            <a className="profile__email bitquery-links"
               href={`${user?.graphql_admin_url}/auth/login?redirect_to=${window.location.href}`}>
                Login
                <UserIcon/>
            </a>
        </div>
    ) : (
        <div className="d-none d-lg-flex align-items-center justify-content-end bitquery-profile-button">
            <a className='link__hire bitquery-links mr-1' target='_blank'
                  href='https://account.bitquery.io/user/payments/form/d014c9df-bf83-4d96-870b-f73dd0fb82c4'>Contact Sales</a>

            <NavDropdown id='profileButton' title={<i className="bi bi-person bitquery-nav_item"></i>}
                         className="cursor-pointer dropdown-toggler border-none navigation-link-color p-0" as={'a'}
                         role="button"
                         tabIndex="0" aria-label="account menu">

                <NavDropdown.Item className="profile-email">{user.email}</NavDropdown.Item>
                <Dropdown.Divider/>
                {user.role === 'admin' &&
                    <NavDropdown.Item className="bitquery-links"
                                      href={`${user?.graphql_admin_url}/admin/accounts`}>Admin</NavDropdown.Item>}
                {user.role === 'admin' && <Dropdown.Divider/>}
                <NavDropdown.Item className="bitquery-links"
                                  href={`${user?.graphql_admin_url}/team/members/new`}>Invite team
                    member</NavDropdown.Item>
                <Dropdown.Divider/>
                <NavDropdown.Item className="bitquery-links"
                                  href={`${user?.graphql_admin_url}/user/account`}>Account</NavDropdown.Item>
                <NavDropdown.Item className="bitquery-links" href={`${user?.graphql_admin_url}/user/api_key`}>API
                    key</NavDropdown.Item>
                <NavDropdown.Item className="bitquery-links"
                                  href={`${user?.graphql_admin_url}/auth/logout`}>Logout</NavDropdown.Item>
            </NavDropdown>
        </div>
    );
})

export default Profile;
