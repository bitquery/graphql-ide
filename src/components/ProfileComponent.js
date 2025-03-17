import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { UserStore } from '../store/queriesStore';
import UserIcon from './icons/UserIcon';
import { Nav, NavDropdown, OverlayTrigger, Tooltip } from 'react-bootstrap';
import uuid from 'uuid-random';
import { toast } from 'react-toastify';

const Profile = observer(() => {
    const { getUser, user } = UserStore;
    const [toastShown, setToastShown] = useState(false);
    const [toastLink, setToastLink] = useState(window.location.href);

    useEffect(() => {
        getUser();
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (!toastShown && !user?.id) {
                toast.error(
                    <div>
                        Hello! To continue using our services, please{' '}
                        <a
                            className="bitquery-ico-popup"
                            href={`https://account.bitquery.io/auth/login?redirect_to=${toastLink}`}
                            aria-label="Log in (opens in a new tab)"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            log in
                        </a>{' '}
                        or{' '}
                        <a
                            className="bitquery-ico-popup"
                            href={`https://account.bitquery.io/auth/signup?redirect_to=${toastLink}`}
                            aria-label="Register (opens in a new tab)"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            register
                        </a>
                        . Logging in will allow you to access all features and keep track of your activities.
                    </div>,
                    { autoClose: 4000 }
                );
                setToastShown(true);
            }
        }, 2000);

        return () => clearTimeout(timer);
    }, [toastShown, user?.id, toastLink]);

    if (!user?.id) {
        return (
            <div className="d-flex align-items-center justify-content-end">
                <a
                    className="bitquery-links p-2"
                    href={`https://account.bitquery.io/auth/login?redirect_to=${toastLink}`}
                    aria-label="Log in (opens in a new tab)"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Login <UserIcon />
                </a>
            </div>
        );
    }

    return (
        <div className="d-none d-lg-flex align-items-center justify-content-end bitquery-profile-button">
            <OverlayTrigger
                placement="bottom"
                overlay={
                    <Tooltip id="contact-sales-tooltip">
                        Contact our sales team for personalized support.
                    </Tooltip>
                }
            >
                <a
                    className="nav-link bitquery-links me-1"
                    href={`https://account.bitquery.io/user/payments/form/${uuid()}`}
                    aria-label="Contact Sales (opens in a new tab)"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Contact Sales
                </a>
            </OverlayTrigger>

            <Nav >
                <NavDropdown
                    id="profileDropdown"
                    title={<i className="bi bi-person me-1" aria-hidden="true" />}
                    align="end"
                    aria-label="Profile menu"
                    className="bitquery-dropdown"
                >
                    <NavDropdown.Item className="profile-email" aria-label={`User email: ${user.email}`}>
                        {user.email}
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    {user.role === 'admin' && (
                        <>
                            <NavDropdown.Item
                                className="bitquery-links bitquery-links-item"
                                href={`${user?.graphql_admin_url}/admin/accounts`}
                                aria-label="Admin panel (opens in a new tab)"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Admin
                            </NavDropdown.Item>
                            <NavDropdown.Divider />
                        </>
                    )}
                    <NavDropdown.Item
                        className="bitquery-links bitquery-links-item"
                        href={`${user?.graphql_admin_url}/team/members/new`}
                        aria-label="Invite team member (opens in a new tab)"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Invite team member
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item
                        className="bitquery-links bitquery-links-item"
                        href={`${user?.graphql_admin_url}/user/account`}
                        aria-label="View account (opens in a new tab)"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Account
                    </NavDropdown.Item>
                    <NavDropdown.Item
                        className="bitquery-links bitquery-links-item"
                        href={`${user?.graphql_admin_url}/user/api_key`}
                        aria-label="View API key (opens in a new tab)"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        API key
                    </NavDropdown.Item>
                    <NavDropdown.Item
                        className="bitquery-links bitquery-links-item"
                        href={`${user?.graphql_admin_url}/auth/logout?redirect_to=${window.location.href}`}
                        aria-label="Logout (opens in a new tab)"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Logout
                    </NavDropdown.Item>
                </NavDropdown>
            </Nav>
        </div>
    );
});

export default Profile;
