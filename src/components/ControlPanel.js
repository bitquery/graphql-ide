import React, {useState, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {QueriesStore, UserStore} from '../store/queriesStore';
import {GalleryStore} from '../store/galleryStore';
import {useQuery} from '../utils/useQuery';
import {Link, useHistory, useLocation} from 'react-router-dom';
import bitqueryLogo from '../assets/images/bitquery_logo.svg';
import useDebounce from '../utils/useDebounce';
import VideoModal from '../components/modal/VideoModal'
import {
    Navbar,
    Nav,
    NavDropdown,
    Form,
    FormControl,
    Tooltip,
    OverlayTrigger
} from 'react-bootstrap';
import uuid from 'uuid-random';
import ProfileComponent from './ProfileComponent';
import modalStore from '../store/modalStore'


const ControlPanel = observer(function ControlPanel() {
    const {user} = UserStore;
    const {currentQuery} = QueriesStore;
    const {currentTag} = GalleryStore;
    const {
        toggleStartersQueriesModal,
        toggleModal
    } = modalStore
    const [search, setSearch] = useState('');
    const [active, setActive] = useState(1);
    const searchValue = useDebounce(search, 500);
    const history = useHistory();
    const location = useLocation();
    const query = useQuery();
    const [showVideo, setShowVideo] = useState(false)


    const menuItems = {
        queries: {name: 'Queries', icon: <i className="bi bi-terminal me-2 bitquery-ico"></i>},
        explore: {name: 'All Queries', icon: <i className="bi bi-terminal me-2 bitquery-ico"></i>},
        myqueries: {name: 'My Queries', icon: <i className="bi bi-star me-2 bitquery-ico"></i>},
        teamqueries: {name: 'Team Queries', icon: <i className="bi bi-people me-2 bitquery-ico"></i>}
    };
    const [queriesMenuTitle, setQueriesMenuTitle] = useState(menuItems.queries);

    useEffect(() => {
        query.set('search', searchValue);
        if (searchValue) {
            history.push({
                pathname: '/explore/All%20queries',
                search: `?search=${searchValue}`
            });
        }
    }, [searchValue, history, query]);

    useEffect(() => {
        if (currentTag !== 'All queries') setSearch('');
    }, [currentTag]);

    useEffect(() => {
        const queryListType = location.pathname.match(/[a-zA-Z]+/gm)?.[0];
        if (queryListType === 'explore') {
            setActive(3);
        } else if (queryListType === 'myqueries') {
            setActive(4);
        } else if (queryListType === 'team') {
            setActive(5);
        } else {
            setActive(1);
        }
    }, [location.pathname]);

    const handleNavClick = (path, title) => {
        history.push(path);
        onClickWithTitle(title);
    };

    const searchHandler = (e) => {
        e.preventDefault();
        setSearch('');
    };

    const onClickWithStartTitle = (title) => {
        setSearch('');
        document.title = title;
        setQueriesMenuTitle(menuItems.queries);
    };

    const onClickWithTitle = (itemKey) => {
        setSearch('');
        document.title = menuItems[itemKey].name;
        setQueriesMenuTitle(menuItems[itemKey]);
    };

    return (
        <Navbar bg="light" expand="lg" className="bitquery-header">
            <div className="d-flex align-items-center justify-content-between responsive-w-100">
                <div className="d-flex align-items-center">
                    <Navbar.Brand className="me-0" href="/">
                        <img src={bitqueryLogo} alt="logo"/>
                        <span className="bitquery-logo_text ms-2">Bitquery</span>
                    </Navbar.Brand>
                    <div className="bitquery-divider mx-2"/>
                    <span className="bitquery-graph">GraphQL</span>
                </div>

                <Navbar.Toggle className="bitquery-btn" aria-controls="navbarSupportedContent"/>
            </div>

            <Navbar.Collapse id="navbarSupportedContent" className="w-100">
                <Form className="d-flex flex-grow-1  ms-2 my-2" onSubmit={searchHandler}>
                    <FormControl
                        type="search"
                        placeholder="Search for a query"
                        className="bitquery-search"
                        aria-label="Search"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </Form>

                <Nav className="ms-auto mt-2 mt-lg-0 bitquery-nav_container">
                    <Nav.Link
                        as={Link}
                        to="/"
                        onClick={() => onClickWithStartTitle(currentQuery.name || 'New Query')}
                        className={active === 1 ? 'bitquery-link_active' : 'bitquery-nav_item'}
                    >
                        <i className="bi bi-play bitquery-ico"></i>Development
                    </Nav.Link>

                    <NavDropdown
                        id="navbarDropdownMenuQueries"
                        title={<>{queriesMenuTitle.icon} {queriesMenuTitle.name}</>}
                        className={(active === 2 || active === 3 || active === 4 || active === 5)
                            ? 'bitquery-link_active'
                            : 'bitquery-nav_item'
                        }
                    >
                        <NavDropdown.Item
                            onClick={() => {
                                toggleStartersQueriesModal()
                                toggleModal()
                            }}
                            className="bitquery-links bitquery-nav_item"
                        >
                            <i className="bi bi-lightning-charge me-2 bitquery-ico"></i>
                            Starter Queries
                        </NavDropdown.Item>
                        <NavDropdown.Divider/>
                        <NavDropdown.Item
                            onClick={() => handleNavClick('/explore/All%20queries', 'explore')}
                            className={active === 3 ? 'bitquery-link_active' : 'bitquery-links bitquery-nav_item'}
                        >
                                 <span className='ms-2'>
                            {menuItems.explore.icon}All Queries
                                </span>
                        </NavDropdown.Item>
                        {user?.id && (
                            <NavDropdown.Item
                                onClick={() => handleNavClick('/myqueries/All%20queries', 'myqueries')}
                                className={active === 4 ? 'bitquery-link_active' : 'bitquery-links bitquery-nav_item'}
                            >
                               <span className='ms-2'>
                                   {menuItems.myqueries.icon}My Queries
                               </span>
                            </NavDropdown.Item>
                        )}
                        {(user?.children_count || user?.ancestry) && (
                            <NavDropdown.Item
                                onClick={() => handleNavClick('/team/All%20queries', 'teamqueries')}
                                className={active === 5 ? 'bitquery-link_active' : 'bitquery-links bitquery-nav_item'}
                            >
                                <span className='ms-2'>
                                {menuItems.teamqueries.icon}Team Queries
                                </span>
                            </NavDropdown.Item>
                        )}
                    </NavDropdown>


                    <NavDropdown title={<OverlayTrigger placement="bottom"
                                                        overlay={<Tooltip id="docs-tooltip-main">Links to
                                                            documentation</Tooltip>}>
                        <span>Docs</span>
                    </OverlayTrigger>}
                                 id="nav-dropdown" className="bitquery-nav_link">
                        <OverlayTrigger
                            placement="bottom"
                            overlay={<Tooltip id="docs-tooltip-getting-started">Getting started with Bitquery
                                GraphQL</Tooltip>}
                        >
                            <NavDropdown.Item
                                className="bitquery-links bitquery-links-item pe-3"
                                href="https://community.bitquery.io/t/how-to-get-started-with-bitquerys-blockchain-graphql-apis/13"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Open Getting Started guide in a new tab"
                            >
                                Getting started
                            </NavDropdown.Item>
                        </OverlayTrigger>
                        <NavDropdown.Divider/>
                        <OverlayTrigger
                            placement="bottom"
                            overlay={
                                <Tooltip id="docs-tooltip-points-video">
                                    Watch a quick video on the point system
                                </Tooltip>
                            }
                        >
                            <NavDropdown.Item
                                className="bitquery-links bitquery-links-item pe-3"
                                onClick={() => setShowVideo(true)}
                                aria-label="Watch point system video"
                            >
                                Point System Video
                            </NavDropdown.Item>

                        </OverlayTrigger>

                        <NavDropdown.Divider/>
                        <OverlayTrigger
                            placement="bottom"
                            overlay={<Tooltip id="docs-tooltip-v1">Open GraphQL V1 docs</Tooltip>}
                        >
                            <NavDropdown.Item
                                className="bitquery-links bitquery-links-item pe-3"
                                href="https://docs.bitquery.io/v1/docs/intro"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Open GraphQL V1 docs in a new tab"
                            >
                                GraphQL - V1
                            </NavDropdown.Item>
                        </OverlayTrigger>
                        <NavDropdown.Divider/>
                        <OverlayTrigger
                            placement="bottom"
                            overlay={<Tooltip id="docs-tooltip-v2">Open Streaming V2 docs</Tooltip>}
                        >
                            <NavDropdown.Item
                                className="bitquery-links bitquery-links-item pe-3"
                                href="https://docs.bitquery.io/docs/intro/"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Open Streaming V2 docs in a new tab"
                            >
                                Streaming - V2
                            </NavDropdown.Item>
                        </OverlayTrigger>
                    </NavDropdown>

                    <NavDropdown
                        title={
                            <OverlayTrigger
                                placement="bottom"
                                overlay={<Tooltip id="monitoring-tooltip-main">Links to monitoring statuses</Tooltip>}
                            >
                                <span>Monitoring</span>
                            </OverlayTrigger>
                        }
                        id="nav-dropdown"
                        className="bitquery-nav_link"
                    >
                        <OverlayTrigger
                            placement="bottom"
                            overlay={<Tooltip id="tooltip-api-v2">View the monitoring page for All Services Status</Tooltip>}
                        >
                            <NavDropdown.Item
                                className="bitquery-links bitquery-links-item pe-3"
                                href="https://status.bitquery.io/"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="View Streaming status page (opens in a new tab)"
                            >
                                All Services Status
                            </NavDropdown.Item>
                        </OverlayTrigger>

                        <NavDropdown.Divider/>

                        <OverlayTrigger
                            placement="bottom"
                            overlay={<Tooltip id="tooltip-eap-status">View the monitoring page for Kafka Streaming</Tooltip>}
                        >
                            <NavDropdown.Item
                                className="bitquery-links bitquery-links-item pe-3"
                                href="https://kafka-status.bitquery.io/"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="View EAP status (opens in a new tab)"
                            >
                                Kafka Streaming
                            </NavDropdown.Item>
                        </OverlayTrigger>


                        <OverlayTrigger
                            placement="bottom"
                            overlay={<Tooltip id="tooltip-eap-status">View the monitoring page for GraphQL Subscriptions</Tooltip>}
                        >
                            <NavDropdown.Item
                                className="bitquery-links bitquery-links-item pe-3"
                                href="https://streaming-status.bitquery.io/"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="View EAP status (opens in a new tab)"
                            >
                                GraphQL Subscriptions
                            </NavDropdown.Item>
                        </OverlayTrigger>


                        <OverlayTrigger
                            placement="bottom"
                            overlay={<Tooltip id="tooltip-eap-status">View the monitoring page for GraphQL Query API</Tooltip>}
                        >
                            <NavDropdown.Item
                                className="bitquery-links bitquery-links-item pe-3"
                                href="https://graphql-status.bitquery.io/"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="View EAP status (opens in a new tab)"
                            >
                                GraphQL Query API
                            </NavDropdown.Item>
                        </OverlayTrigger>


                        <OverlayTrigger
                            placement="bottom"
                            overlay={<Tooltip id="tooltip-eap-status">View the monitoring page for Bitquery Applications</Tooltip>}
                        >
                            <NavDropdown.Item
                                className="bitquery-links bitquery-links-item pe-3"
                                href="https://app-status.bitquery.io/"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="View EAP status (opens in a new tab)"
                            >
                                Applications
                            </NavDropdown.Item>
                        </OverlayTrigger>
                    </NavDropdown>


                    <NavDropdown
                        title={
                            <OverlayTrigger
                                placement="bottom"
                                overlay={<Tooltip id="apps-tooltip-main">Explore Bitquery applications</Tooltip>}
                                delay={{show: 300, hide: 0}}
                            >
                                <span>Apps</span>
                            </OverlayTrigger>
                        }
                        id="nav-dropdown"
                        className="bitquery-nav_link"
                    >
                        <OverlayTrigger
                            placement="bottom"
                            overlay={<Tooltip id="apps-tooltip-dexrabbit">Dexrabbit: Decentralized exchange
                                aggregator</Tooltip>}
                        >
                            <NavDropdown.Item
                                className="bitquery-links bitquery-links-item pe-3"
                                href="https://dexrabbit.com/"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Open Dexrabbit in a new tab"
                            >
                                Dexrabbit
                            </NavDropdown.Item>
                        </OverlayTrigger>

                        <NavDropdown.Divider/>

                        <OverlayTrigger
                            placement="bottom"
                            overlay={<Tooltip id="apps-tooltip-explorer">Blockchain Explorer: View blockchain data and
                                transactions</Tooltip>}
                        >
                            <NavDropdown.Item
                                className="bitquery-links bitquery-links-item pe-3"
                                href="https://explorer.bitquery.io/"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Open Blockchain Explorer in a new tab"
                            >
                                Blockchain Explorer
                            </NavDropdown.Item>
                        </OverlayTrigger>

                        <NavDropdown.Divider/>

                        <OverlayTrigger
                            placement="bottom"
                            overlay={<Tooltip id="apps-tooltip-moneyflow-lite">MoneyFlow Lite: Quick insights into
                                blockchain money flows</Tooltip>}
                        >
                            <NavDropdown.Item
                                className="bitquery-links bitquery-links-item pe-3"
                                href="https://lite.bitquery.io/"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Open MoneyFlow Lite in a new tab"
                            >
                                MoneyFlow Lite
                            </NavDropdown.Item>
                        </OverlayTrigger>

                        <NavDropdown.Divider/>

                        <OverlayTrigger
                            placement="bottom"
                            overlay={<Tooltip id="apps-tooltip-moneyflow-ultimate">MoneyFlow Ultimate: Advanced
                                blockchain money flow analytics</Tooltip>}
                        >
                            <NavDropdown.Item
                                className="bitquery-links bitquery-links-item pe-3"
                                href="https://bitquery.io/products/moneyflow"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Open MoneyFlow Ultimate in a new tab"
                            >
                                MoneyFlow Ultimate
                            </NavDropdown.Item>
                        </OverlayTrigger>

                        <NavDropdown.Divider/>

                        <OverlayTrigger
                            placement="bottom"
                            overlay={<Tooltip id="apps-tooltip-substack">Bitquery's Substack: Read curated blockchain
                                insights and updates</Tooltip>}
                        >
                            <NavDropdown.Item
                                className="bitquery-links bitquery-links-item pe-3"
                                href="https://bitquery.substack.com/"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Open Bitquery's Substack in a new tab"
                            >
                                Bitquery's Substack
                            </NavDropdown.Item>
                        </OverlayTrigger>
                    </NavDropdown>


                    <NavDropdown title="Contact" id="nav-dropdown" className="bitquery-nav_link">
                        <NavDropdown.Item
                            className="bitquery-links bitquery-links-item"
                            href={`https://account.bitquery.io/user/payments/form/${uuid()}`}
                            // target="_blank"
                            rel="noopener noreferrer"
                        >
                            <i className="bi bi-envelope-fill me-2"></i> Contact Sales
                        </NavDropdown.Item>
                        <NavDropdown.Divider/>
                        <NavDropdown.Item
                            className="bitquery-links bitquery-links-item"
                            href="https://community.bitquery.io/"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <i className="bi bi-chat-left-text-fill me-2"></i> Forum
                        </NavDropdown.Item>
                        <NavDropdown.Divider/>
                        <NavDropdown.Item
                            className="bitquery-links bitquery-links-item"
                            href="https://t.me/bloxy_info/"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <i className="bi bi-telegram me-2"></i> Telegram
                        </NavDropdown.Item>
                        <NavDropdown.Divider/>
                        <NavDropdown.Item
                            className="bitquery-links bitquery-links-item"
                            href="https://twitter.com/Bitquery_io"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <i className="bi bi-twitter-x me-2"></i> Twitter
                        </NavDropdown.Item>
                    </NavDropdown>

                    {!user?.id && (
                        <Nav.Link as={Link}
                                  to={`${user?.graphql_admin_url}/auth/login?redirect_to=${window.location.href}`}
                                  className="d-lg-none">
                            Login
                        </Nav.Link>
                    )}
                    {user?.role === 'admin' && (
                        <Nav.Link as={Link} to={`${user?.graphql_admin_url}/admin/accounts`} className="d-lg-none">
                            Admin
                        </Nav.Link>
                    )}
                    {user?.id && (
                        <Nav.Link as={Link} to={`${user?.graphql_admin_url}/team/members/new`} className="d-lg-none">
                            Invite team member
                        </Nav.Link>
                    )}
                    {user?.id && (
                        <Nav.Link as={Link} to={`${user?.graphql_admin_url}/user/account`} className="d-lg-none">
                            Account
                        </Nav.Link>
                    )}
                    {user?.id && (
                        <Nav.Link as={Link} to={`${user?.graphql_admin_url}/user/api_key`} className="d-lg-none">
                            API key
                        </Nav.Link>
                    )}
                    {user?.id && (
                        // <Nav.Link as={Link} to={`${user?.graphql_admin_url}/auth/logout?redirect_to=${window.location.href}`} className="d-lg-none">
                        <Nav.Link as={Link}
                                  to={`https://account.bitquery.io/auth/login?redirect_to=${window.location.href}`}
                                  className="d-lg-none">
                            Logout
                        </Nav.Link>
                    )}
                </Nav>
                <ProfileComponent/>
            </Navbar.Collapse>
            <VideoModal
                show={showVideo}
                onHide={() => setShowVideo(false)}
                src={'https://www.veed.io/embed/27a10659-dbc9-489c-bc99-fabd4e3f1be8'}
            />
        </Navbar>
    );
});

export default ControlPanel;
