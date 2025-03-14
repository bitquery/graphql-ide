import React, {useState, useEffect} from 'react'
import ProfileComponent from './ProfileComponent'
import {QueriesStore, UserStore} from '../store/queriesStore'
import {observer} from 'mobx-react-lite'
import useDebounce from '../utils/useDebounce'
import {Link, useHistory, useLocation} from 'react-router-dom'
import bitqueryLogo from '../assets/images/bitquery_logo.svg'
import {GalleryStore} from '../store/galleryStore'
import {useQuery} from '../utils/useQuery'
import {Dropdown, NavDropdown} from 'react-bootstrap'
import uuid from 'uuid-random'

const ControlPanel = observer(function ControlPanel() {
    const {user} = UserStore
    const {currentQuery} = QueriesStore
    const {currentTag} = GalleryStore
    const [search, setSearch] = useState('')
    const [active, setActive] = useState(1)

    const searchValue = useDebounce(search, 500)
    const history = useHistory()
    const location = useLocation()
    const query = useQuery()
    const menuItems = {
        queries: {name: 'Queries', icon: <i className="bi bi-terminal mr-2 bitquery-ico"></i>},
        explore: {name: 'Explore', icon: <i className="bi bi-terminal mr-2 bitquery-ico"></i>},
        myqueries: {name: 'My Queries', icon: <i className="bi bi-star mr-2 bitquery-ico"></i>},
        teamqueries: {name: 'Team Queries', icon: <i className="bi bi-people mr-2 bitquery-ico"></i>}
    }
    const [queriesMenuTitle, setQueriesMenuTitle] = useState(menuItems.queries)
    useEffect(() => {
        query.set('search', searchValue)
        searchValue && history.push({
            pathname: '/explore/All%20queries',
            search: `${searchValue ? '?search=' : ''}${searchValue}`
        })
    }, [searchValue])

    useEffect(() => {
        currentTag !== 'All queries' && setSearch('')
    }, [currentTag])

    useEffect(() => {
        const queryListType = location.pathname.match(/[a-zA-Z]+/gm)?.[0]
        if (queryListType === 'explore') {
            setActive(3)
        } else if (queryListType === 'myqueries') {
            setActive(4)
        } else if (queryListType === 'team') {
            setActive(5)
        } else {
            setActive(1)
        }
    }, [location.pathname])

    const handleNavClick = (path, title) => {
        history.push(path)
        onClickWithTitle(title)
    }
    const searchHandler = (e) => {
        e.preventDefault()
        if (e.which = 13) {
            return false
        } else {
            setSearch('')
        }
    }

    const onClick = title => {
        setSearch('')
        document.title = title
    }
    const onClickWithStartTitle = title => {
        setSearch('')
        document.title = title
        setQueriesMenuTitle(menuItems.queries)

    }
    const onClickWithTitle = (itemKey) => {
        setSearch('')
        document.title = menuItems[itemKey].name
        setQueriesMenuTitle(menuItems[itemKey])
    }

    return (
        <div className="navbar navbar-expand-lg navbar-light bitquery-header">
            <a href="#tabs" className="skip-to-main-content">Skip to main content</a>
            <div className='bitquery-logo'>
                <a className='bitquery-links bitquery-logo_link' href='/'>
                    <img src={bitqueryLogo} alt="logo"/>
                    <span className="bitquery-logo_text">Bitquery</span>
                </a>
                <div className="bitquery-divider"></div>
                <div className="bitquery-graph">Graph
                    <span className="bitquery-graphQL">QL</span>
                </div>
            </div>
            <button className="navbar-toggler m-2" type="button" data-toggle="collapse"
                    data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false"
                    aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>


            <div className="collapse navbar-collapse pl-3" id="navbarSupportedContent">
                <form className="form-inline my-2 my-lg-0" onSubmit={searchHandler}>
                    <input
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="bitquery-search"
                        type="search"
                        placeholder="Search for a query"
                        aria-label="Search"
                    />
                </form>

                <ul className="navbar-nav mt-2 mt-lg-0 bitquery-nav_container">

                    <li className='nav-item' tabIndex='-1'>
                        <Link
                            className={`nav-link ${active === 1 ? 'bitquery-link_active' : 'bitquery-nav_item'}`}
                            to='/'
                            onClick={() => onClickWithStartTitle(currentQuery.name || 'New Query')}><i
                            className="bi bi-play bitquery-ico"></i>Development</Link>
                    </li>
                    <span className="bitquery-divider_little"></span>

                    <NavDropdown
                        id="navbarDropdownMenuQueries"
                        tabIndex='-1'
                        className={`bitquery-links ${(active === 2 || active === 3 || active === 4 || active === 5) ? 'bitquery-link_active' : 'bitquery-nav_item'}`}
                        title={<>{queriesMenuTitle.icon} {queriesMenuTitle.name}</>}
                    >
                        <NavDropdown.Item
                            className={`bitquery-links ${active === 3 ? 'bitquery-link_active' : 'bitquery-nav_item'}`}
                            onClick={() => handleNavClick('/explore/All%20queries', 'explore')}
                        >
                            {menuItems.explore.icon}Explore
                        </NavDropdown.Item>

                        {user?.id && (
                            <NavDropdown.Item
                                className={`bitquery-links ${active === 4 ? 'bitquery-link_active' : 'bitquery-nav_item'}`}
                                onClick={() => handleNavClick('/myqueries/All%20queries', 'myqueries')}
                            >
                                {menuItems.myqueries.icon}My Queries
                            </NavDropdown.Item>
                        )}

                        {(user?.children_count || user?.ancestry) && (
                            <NavDropdown.Item
                                className={`bitquery-links ${active === 5 ? 'bitquery-link_active' : 'bitquery-nav_item'}`}
                                onClick={() => handleNavClick('/team/All%20queries', 'teamqueries')}
                            >
                                {menuItems.teamqueries.icon}Team Queries
                            </NavDropdown.Item>
                        )}
                    </NavDropdown>
                    <span className="bitquery-divider_little"></span>
                    <NavDropdown title="Docs" id="nav-dropdown" className="bitquery-nav_link">
                        <NavDropdown.Item className="bitquery-links" href='https://docs.bitquery.io/v1/docs/intro'
                                          target='_blank'>GraphQL
                            - V1</NavDropdown.Item>
                        <Dropdown.Divider/>
                        <NavDropdown.Item className="bitquery-links" href='https://docs.bitquery.io/docs/intro/'
                                          target='_blank'>Streaming
                            -V2</NavDropdown.Item>
                        <Dropdown.Divider/>
                        <NavDropdown.Item className="bitquery-links"
                                          href='https://community.bitquery.io/t/how-to-get-started-with-bitquerys-blockchain-graphql-apis/13'
                                          target='_blank'>Getting started</NavDropdown.Item>
                    </NavDropdown>
                    <span className="bitquery-divider_little"></span>

                    <NavDropdown title="Monitoring" id="nav-dropdown" className="bitquery-nav_link">
                        <NavDropdown.Item className="bitquery-links" href='https://status.bitquery.io/'
                                          target='_blank'>API v1
                            - V1</NavDropdown.Item>
                        <Dropdown.Divider/>
                        <NavDropdown.Item className="bitquery-links" href='https://bitquery-streaming.statuspage.io/'
                                          target='_blank'>API v2
                            -V2</NavDropdown.Item>
                        <Dropdown.Divider/>
                        <NavDropdown.Item className="bitquery-links"
                                          href='https://status-streaming-eap.bitquery.io/'
                                          target='_blank'>EAP Status</NavDropdown.Item>
                    </NavDropdown>
                    <span className="bitquery-divider_little"></span>

                    <NavDropdown title="Apps" id="nav-dropdown" className="bitquery-nav_link">
                        <NavDropdown.Item className="bitquery-links" href='https://dexrabbit.com/'
                                          target='_blank'>Dexrabbit
                        </NavDropdown.Item>
                        <Dropdown.Divider/>
                        <NavDropdown.Item className="bitquery-links" href='https://explorer.bitquery.io/'
                                          target='_blank'>Blockchain Explorer
                        </NavDropdown.Item>
                        <Dropdown.Divider/>
                        <NavDropdown.Item className="bitquery-links" href='https://lite.bitquery.io/'
                                          target='_blank'>MoneyFlow Lite
                        </NavDropdown.Item>
                        <Dropdown.Divider/>
                        <NavDropdown.Item className="bitquery-links" href='https://bitquery.io/products/moneyflow'
                                          target='_blank'>MoneyFlow Ultimate
                        </NavDropdown.Item>
                        <Dropdown.Divider/>
                        <NavDropdown.Item className="bitquery-links" href='https://bitquery.substack.com/'
                                          target='_blank'>Bitquery's Substack
                        </NavDropdown.Item>

                    </NavDropdown>
                    <span className="bitquery-divider_little"></span>


                    <NavDropdown title="Contact" id="nav-dropdown" className="bitquery-nav_link">
                        <NavDropdown.Item className="bitquery-links"
                                          href={`https://account.bitquery.io/user/payments/form/${uuid()}}`}
                                          target='_blank'>Contact Sales</NavDropdown.Item>
                        <Dropdown.Divider/>
                        <NavDropdown.Item className="bitquery-links" href='https://community.bitquery.io/'
                                          target='_blank'>Forum</NavDropdown.Item>
                        <Dropdown.Divider/>

                        <NavDropdown.Item className="bitquery-links" href='https://discord.gg/EEBVTQnb2E'
                                          target='_blank'>Discord</NavDropdown.Item>
                        <Dropdown.Divider/>

                        <NavDropdown.Item className="bitquery-links" href='https://t.me/bloxy_info/'
                                          target='_blank'>Telegram</NavDropdown.Item>
                        <Dropdown.Divider/>

                        <NavDropdown.Item className="bitquery-links" href='https://twitter.com/Bitquery_io'
                                          target='_blank'>Twitter</NavDropdown.Item>
                        <Dropdown.Divider/>

                        <NavDropdown.Item className="bitquery-links" href='https://angel.co/company/bitquery/jobs'
                                          target='_blank'>
                            We are hiring!
                        </NavDropdown.Item>
                    </NavDropdown>
                    <li className="nav-item d-lg-none" tabIndex='-1'>
                        <a className="nav-link bitquery-links" href="https://discord.gg/EEBVTQnb2E">Discord</a>
                    </li>
                    <li className="nav-item d-lg-none" tabIndex='-1'>
                        <a className="nav-link bitquery-links" href="https://t.me/bloxy_info/">Telegram</a>
                    </li>
                    <li className="nav-item d-lg-none" tabIndex='-1'>
                        <a className="nav-link bitquery-links"
                           href="https://streaming.bitquery.io/tutorial/">Doc</a>
                    </li>
                    <li className="nav-item d-lg-none" tabIndex='-1'>
                        <a className="nav-link bitquery-links" href="https://community.bitquery.io/">Forum</a>
                    </li>
                    <li className="nav-item d-lg-none" tabIndex='-1'>
                        <a className="nav-link bitquery-links"
                           href="https://community.bitquery.io/t/how-to-get-started-with-bitquerys-blockchain-graphql-apis/13">Getting
                            started</a>
                    </li>
                    <li className="nav-item d-lg-none" tabIndex='-1'>
                        <a className="nav-link bitquery-links" href="https://angel.co/company/bitquery/jobs">We
                            are hiring!</a>
                    </li>
                    <li className="nav-item d-lg-none bitquery-links" tabIndex='-1'>
                        <a className="nav-link bitquery-links"
                           href={`https://account.bitquery.io/user/payments/form/${uuid()}`}>Contact Sales</a>
                    </li>

                    {!user?.id && <li className="nav-item d-lg-none">
                        <a className="nav-link bitquery-links"
                           href={`${user?.graphql_admin_url}/auth/login?redirect_to=${window.location.href}`}>Login</a>
                    </li>}
                    {user?.role === 'admin' && <li className="nav-item d-lg-none">
                        <a className="nav-link bitquery-links"
                           href={`${user?.graphql_admin_url}/admin/accounts`}>Admin</a>
                    </li>}
                    {user?.id && <li className="nav-item d-lg-none">
                        <a className="nav-link bitquery-links"
                           href={`${user?.graphql_admin_url}/team/members/new`}>Invite team member</a>
                    </li>}
                    {user?.id && <li className="nav-item d-lg-none">
                        <a className="nav-link bitquery-links"
                           href={`${user?.graphql_admin_url}/user/account`}>Account</a>
                    </li>}
                    {user?.id && <li className="nav-item d-lg-none">
                        <a className="nav-link bitquery-links" href={`${user?.graphql_admin_url}/user/api_key`}>API
                            key</a>
                    </li>}
                    {user?.id && <li className="nav-item d-lg-none">
                        <a className="nav-link bitquery-links"
                           href={`${user?.graphql_admin_url}/auth/logout?redirect_to=${window.location.href}`}>Logout</a>
                    </li>}
                </ul>
                <ProfileComponent/>
            </div>

        </div>

    )
})

export default ControlPanel
