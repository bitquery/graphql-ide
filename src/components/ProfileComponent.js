import React, {useEffect, useState} from 'react';
import {observer} from 'mobx-react-lite';
import {UserStore} from '../store/queriesStore';
import UserIcon from './icons/UserIcon';
import {Dropdown, NavDropdown} from 'react-bootstrap';
import uuid from 'uuid-random'
import {toast} from "react-toastify";


const Profile = observer(() => {
    const {getUser, user} = UserStore;
    const [toastShown, setToastShown] = useState(false)
const [toastLink, setToastLink] = useState(window.location.href)
    useEffect(() => {
        getUser();
        // eslint-disable-next-line

    }, [])

    useEffect(() => {
        const timer = setTimeout(() => {
            if (!toastShown && !user?.id) {
                toast.error((
                    <div>
                        Hello! To continue using our services, please
                        <a className='bitquery-ico'
                           href={`https://account.bitquery.io/auth/login?redirect_to=${toastLink}`}> log
                            in </a> or
                        <a className='bitquery-ico' href={`https://account.bitquery.io/auth/signup?redirect_to=${toastLink}`}> register </a>
                        Logging in will allow you to access all the features and keep track of your activities.
                    </div>
                ), {autoClose: 4000});
                setToastShown(true)
            }
        }, 2000);

        return () => clearTimeout(timer);
    }, [toastShown, user?.id])

    return !user?.id ? (
        <div className="flex profile__menu d-none d-lg-block ml-auto">
            <a className="profile__email bitquery-links"
               href={`https://account.bitquery.io/auth/login?redirect_to=${toastLink}`}>
                Login
                <UserIcon/>
            </a>
        </div>
    ) : (
        <div className="d-none d-lg-flex align-items-center justify-content-end bitquery-profile-button">
            <a className='link__hire bitquery-links mr-1' target='_blank'
               href={`https://account.bitquery.io/user/payments/form/${uuid()}`}>Contact Sales</a>
                <a className="nav-link bitquery-links"
                   href={`${user?.graphql_admin_url}/user/account`}>Account</a>
            <NavDropdown id='profileButton' title={<i className="bi bi-person bitquery-nav_item"></i>}
                         className="cursor-pointer dropdown-toggler border-none navigation-link-color p-0" as={'div'}
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
                                  href={`${user?.graphql_admin_url}/auth/logout?redirect_to=${window.location.href}`}>Logout</NavDropdown.Item>
            </NavDropdown>
        </div>
    );
})

export default Profile;
