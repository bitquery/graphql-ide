import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { UserStore } from '../store/queriesStore';
import UserIcon from './icons/UserIcon';
import { Dropdown } from 'react-bootstrap';
import { Link } from "react-router-dom";

const Profile = observer(() => {
    const { getUser, user } = UserStore;

    useEffect(() => {
        getUser();
        // eslint-disable-next-line
    }, [])

    return !user?.id ? (
        <div className="flex profile__menu d-none d-lg-block" >
            <a className="profile__email" href={`${user?.graphql_admin_url}/auth/login?redirect_to=${window.location.href}`}>
                Login
                <UserIcon />
            </a>
        </div>
    ) : (
        <div className="d-none d-lg-flex align-items-center justify-content-end">
            <a className='link__hire navigation-link-color' target='_blank'
               href='https://streaming.bitquery.io/tutorial/'>Docs</a>
            <a className='link__hire navigation-link-color' target='_blank'
               href='https://account.bitquery.io/user/billing'>Upgrade</a>

            <Dropdown>
                <Dropdown.Toggle variant="" className="link__hire navigation-link-color">
                    Contacts us
                </Dropdown.Toggle>
                <Dropdown.Menu>
                    <Dropdown.Item className="link__hire navigation-link-color" href='https://discord.gg/EEBVTQnb2E' target='_blank'>
                        Discord
                    </Dropdown.Item>
                    <Dropdown.Item className="link__hire navigation-link-color"  href='https://t.me/bloxy_info/' target='_blank'>
                        Telegram
                    </Dropdown.Item>
                    <Dropdown.Item className="link__hire navigation-link-color"  href='https://community.bitquery.io/' target='_blank'>
                        Forum
                    </Dropdown.Item>
                    <Dropdown.Item className="link__hire navigation-link-color" href='https://community.bitquery.io/t/how-to-get-started-with-bitquerys-blockchain-graphql-apis/13' target='_blank'>
                        Getting started
                    </Dropdown.Item>
                    <Dropdown.Item className="link__hire navigation-link-color"  href='https://angel.co/company/bitquery/jobs' target='_blank'>
                        We are hiring!
                    </Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>

            <Dropdown>
                <Dropdown.Toggle variant="" className="cursor-pointer dropdown-toggler" as={'a'} role="button" tabIndex="0" aria-label="account menu">
                    <i className="bi bi-person"></i>
                </Dropdown.Toggle>

                <Dropdown.Menu className="dropdown-menu dropdown-menu-right">
                    <Dropdown.Header className="nav-active">{user.email}</Dropdown.Header>
                    <Dropdown.Divider/>
                    {user.role === 'admin' &&
                        <Dropdown.Item className="link__hire navigation-link-color"  href={`${user?.graphql_admin_url}/admin/accounts`}>Admin</Dropdown.Item>}
                    {user.role === 'admin' && <Dropdown.Divider/>}
                    <Dropdown.Item className="link__hire navigation-link-color"  href={`${user?.graphql_admin_url}/team/members/new`}>Invite team member</Dropdown.Item>
                    <Dropdown.Divider/>
                    <Dropdown.Item className="link__hire navigation-link-color"  href={`${user?.graphql_admin_url}/user/account`}>Account</Dropdown.Item>
                    <Dropdown.Item className="link__hire navigation-link-color"  href={`${user?.graphql_admin_url}/user/api_key`}>API key</Dropdown.Item>
                    <Dropdown.Item className="link__hire navigation-link-color"  href={`${user?.graphql_admin_url}/auth/logout`}>Logout</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        </div>
    );
})

export default Profile;
