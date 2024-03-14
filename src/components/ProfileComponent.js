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
        <div className="flex profile__menu d-none d-lg-block">
            <a className="profile__email"
               href={`${user?.graphql_admin_url}/auth/login?redirect_to=${window.location.href}`}>
                Login
                <UserIcon/>
            </a>
        </div>
    ) : (
        <div className="d-none d-lg-flex align-items-center justify-content-end">
            <a className='link__hire navigation-link-color mr-2' target='_blank'
                  href='https://streaming.bitquery.io/tutorial/'>Docs</a>
            <a className='link__hire navigation-link-color mr-1' target='_blank'
                  href='https://account.bitquery.io/user/billing'>Upgrade</a>

            <NavDropdown title="Contact us" id="nav-dropdown" className="navigation-link-color nav-bg">
                <NavDropdown.Item className="navigation-link-color" href='https://discord.gg/EEBVTQnb2E'
                                  target='_blank'><i
                    className="bi bi-discord mr-2"></i>
                    Discord
                </NavDropdown.Item>
                <NavDropdown.Item className="navigation-link-color" href='https://t.me/bloxy_info/' target='_blank'><i
                    className="bi bi-telegram mr-2"></i>
                    Telegram
                </NavDropdown.Item>
                <NavDropdown.Item className="navigation-link-color" href='https://community.bitquery.io/'
                                  target='_blank'><i className="bi bi-chat-left-text-fill mr-2"></i>
                    Forum
                </NavDropdown.Item>
                <Dropdown.Divider/>

                <NavDropdown.Item className="navigation-link-color"
                                  href='https://community.bitquery.io/t/how-to-get-started-with-bitquerys-blockchain-graphql-apis/13'
                                  target='_blank'><i className="bi bi-rocket-takeoff-fill mr-2"></i>Getting started
                </NavDropdown.Item>
                <Dropdown.Divider/>

                <NavDropdown.Item className="navigation-link-color" href='https://angel.co/company/bitquery/jobs'
                                  target='_blank'><i className="bi bi-briefcase-fill mr-2"></i>
                    We are hiring!
                </NavDropdown.Item>
            </NavDropdown>
            <NavDropdown title={<i className="bi bi-person"></i>}
                         className="cursor-pointer dropdown-toggler border-none navigation-link-color" as={'a'}
                         role="button"
                         tabIndex="0" aria-label="account menu">

                <NavDropdown.Item className="nav-active">{user.email}</NavDropdown.Item>
                <Dropdown.Divider/>
                {user.role === 'admin' &&
                    <NavDropdown.Item className="navigation-link-color"
                                      href={`${user?.graphql_admin_url}/admin/accounts`}>Admin</NavDropdown.Item>}
                {user.role === 'admin' && <Dropdown.Divider/>}
                <NavDropdown.Item className="navigation-link-color"
                                  href={`${user?.graphql_admin_url}/team/members/new`}>Invite team
                    member</NavDropdown.Item>
                <Dropdown.Divider/>
                <NavDropdown.Item className="navigation-link-color"
                                  href={`${user?.graphql_admin_url}/user/account`}>Account</NavDropdown.Item>
                <NavDropdown.Item className="navigation-link-color" href={`${user?.graphql_admin_url}/user/api_key`}>API
                    key</NavDropdown.Item>
                <NavDropdown.Item className="navigation-link-color"
                                  href={`${user?.graphql_admin_url}/auth/logout`}>Logout</NavDropdown.Item>
            </NavDropdown>
        </div>
    );
})

export default Profile;
