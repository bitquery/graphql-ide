import {observer} from 'mobx-react-lite'
import React, {useEffect, useState} from 'react'
import {useCallback} from 'react'
import {useHistory, useRouteMatch} from 'react-router-dom'
import {getQuery, getTransferedQuery, getQueryByID, getWidgetConfig} from '../api/api'
import {TabsStore, QueriesStore, UserStore} from '../store/queriesStore'
import handleState from '../utils/handleState'
import useEventListener from '../utils/useEventListener'
import GraphqlIcon from './icons/GraphqlIcon'
import {GalleryStore} from '../store/galleryStore'
import {generateTags} from '../utils/generateTags'
import {useQuery} from '../utils/useQuery'
import {toast} from "react-toastify"
import modalStore from "../store/modalStore";



const TabsComponent = observer(() => {
    const history = useHistory()
    const queryParams = useQuery()
    const {queriesListIsOpen, toggleQueriesList} = GalleryStore
    const {user, getUser} = UserStore
    const {tabs, currentTab, switchTab, index} = TabsStore
    const { startersQueriesModalIsOpen, toggleStartersQueriesModal, toggleModal } = modalStore

    const match = useRouteMatch(`/:queryurl`)
    const {
        setQuery,
        removeQuery,
        query,
        updateQuery,
        currentQuery,
        setIsLoaded,
        setQueryIsTransfered
    } = QueriesStore
    const [editTabName, setEditTabName] = useState(false)
    const [queryName, setQueryName] = useState({[currentTab]: currentQuery.name})
    const [x, setx] = useState(0)

    // useEffect(() => {
    //     if (
    //         !sessionStorage.getItem('startersModalShown')
    //     ) {
    //         modalStore.toggleStartersQueriesModal();
    //         sessionStorage.setItem('startersModalShown', 'true');
    //     }
    // }, [location.pathname]);


    useEffect(() => {
        x <= 1 && setx(x => x + 1)
        if (x > 1) {
            currentQuery.url
                ? history.push(`/${currentQuery.url}`)
                : history.push('/')
        }
        // eslint-disable-next-line
    }, [currentQuery.url])
    useEffect(() => {
        if (user?.key) {
            if (/^\/query\/[0-9a-zA-Z]{16}$/.test(history.location.pathname)) {
                const gqbi = async () => {
                    const queryID = history.location.pathname.match(/[0-9a-zA-Z]{16}/)[0]
                    try {
                        const {data: {query, variables}} = await getQueryByID(queryID)
                        updateQuery({query, variables, saved: true}, index)
                    } catch (error) {
                        if (error.response.status === 400) {
                            try {
                                if (user?.accessToken && user?.accessToken?.streaming_expires_on <= Date.now()) {
                                    try {
                                        await getUser('update_token')
                                    } catch (error) {
                                        toast.error('Token refresh failed')
                                    }
                                }
                                const response = await fetch(user?.graphql_legacy_url, {
                                    "headers": {
                                        "accept": "application/json",
                                        "content-type": "application/json",
                                        "x-api-key": user.key,
                                        ...(user?.accessToken?.access_token && {'Authorization': `Bearer ${UserStore.user?.accessToken?.access_token}`}),
                                    },
                                    "body": `{\"query\":\"query MyQuery {\\n\\tsystem {\\n\\t  userRequests(graphqlQueryId: {is: \\\"${queryID}\\\"}) {\\n\\t\\trequest {\\n\\t\\t  json\\n\\t\\t}\\n\\t\\tvariables {\\n\\t\\t  json\\n\\t\\t}\\n\\t  }\\n\\t}\\n  }\",\"variables\":\"{}\"}`,
                                    "method": "POST",
                                    "mode": "cors"
                                })
                                if (user?.accessToken?.error) toast.error(`Error in accessToken: ${user?.accessToken?.error}`)

                                const {data} = await response.json()
                                const query = data.system.userRequests[0].request.json
                                const variables = data.system.userRequests[0].variables.json
                                updateQuery({query, variables, saved: true}, index)
                            } catch (error) {
                                updateQuery({query: 'QUERY DOES NOT EXIST!'}, index)
                            }
                        }
                    }
                }
                gqbi()
            } else if (/^\/transfer\/[0-9a-fA-F]{6}$/.test(history.location.pathname)) {
                const code = history.location.pathname.match(/[0-9a-fA-F]{6}/)[0]
                const gtf = async () => {
                    const {data} = await getTransferedQuery(code)
                    //query string goes from explorer JSON.stringify'ed twice
                    //double JSON.parse to rid off unexpected qoutes
                    const query = JSON.parse(data.transferedQuery.query)
                    const type = query.substr(0, query.indexOf(" ")).toLowerCase()
                    const isSubscription = (type === 'subscription')
                    updateQuery({
                        query: JSON.parse(data.transferedQuery.query),
                        variables: data.transferedQuery.variables,
                        // endpoint_url: isSubscription && 'https://streaming.bitquery.io/graphql'
                        // endpoint_url: 'https://graphql.bitquery.io'
                        endpoint_url:  JSON.parse(data.transferedQuery.endpointURL) || 'https://graphql.bitquery.io'
                    }, index)
                    setQueryIsTransfered(true)
                    setx(2)
                    setIsLoaded()
                }
                gtf()
            } else if (!match) {
                setx(2)
                setIsLoaded()
                     if (
                        !sessionStorage.getItem('startersModalShown')
                    ) {
                        modalStore.toggleStartersQueriesModal();
                        sessionStorage.setItem('startersModalShown', 'true');
                    }
            } else {
                async function updateTabs() {
                    const searchParams = new URL(document.location).searchParams
                    const configID = searchParams.get('config') ? searchParams.get('config') : null
                    const {data} = await getQuery(match.params.queryurl)
                    if (typeof data === 'object') {
                        if (query.map(query => query.id).indexOf(data.id) === -1) {
                            let patch = {
                                config: JSON.parse(data.config),
                                widget_id: currentQuery.widget_id,
                                saved: true
                            }
                            if (configID) {
                                let configString = await getWidgetConfig(configID)
                                const config = JSON.parse(configString.data.data)
                                const variables = configString.data.variables
                                const preQuery = configString.data.preQuery
                                patch.widget_id = 'config.widget'
                                patch.config = config
                                patch.variables = variables
                                patch.preQuery = preQuery
                            }
                            const token = queryParams.get('token')
                            if (token) {
                                const variables = JSON.parse(data.variables)
                                variables.token = token
                                patch.variables = JSON.stringify(variables)
                            }
                            patch.account_id = data.isOwner ? user.id : null
                            updateQuery({...data, ...patch}, index, data.id)
                            setQueryName({[currentTab]: data.name})
                            if (!user.id) {
                                const keywords = generateTags(data.query, data.variables)
                                keywords && document.querySelector('meta[name="keywords"]').setAttribute('content', keywords)
                            }
                            setIsLoaded()
                        }
                    }
                }

                updateTabs()
            }
        }
        // eslint-disable-next-line
    }, [user])
    const editTabNameHandler = useCallback(({key}) => {
        if (key === 'Enter') {
            setEditTabName(prev => prev ? !prev : prev)
            updateIfNeeded()
        } else if (key === 'Escape') {
            setEditTabName(prev => prev ? !prev : prev)
            setQueryName({[currentTab]: tabs[index].name})
        }
        // eslint-disable-next-line
    }, [setEditTabName, currentTab, queryName])
    useEventListener('keyup', editTabNameHandler)
    useEffect(() => {
        setEditTabName(false)
        setQueryName(handleState({...queryName}) || {[currentTab]: 'New Query'})
        // eslint-disable-next-line
    }, [tabs.length])
    const handleEdit = e => setQueryName({...queryName, [currentTab]: e.target.value})

    const switchTabHandler = (tabid) => {
        queriesListIsOpen && toggleQueriesList()
        switchTab(tabid)
        let id = tabs.map(tab => tab.id).indexOf(tabid)
        query[id].url ? history.push(`/${query[id].url}`) : history.push('/')
        setEditTabName(false)
    }

    const addNewTabHandler = () => {
        queriesListIsOpen && toggleQueriesList()
        toggleStartersQueriesModal()
        setQuery({
            query: '',
            variables: '{}',
            name: 'New Query',
            endpoint_url: currentQuery.endpoint_url,
            config: '{}',
            widget_id: 'json.widget'
        })
    }
    const removeTabHandler = (index, event) => {
        event.stopPropagation()
        tabs.length > 1 && removeQuery(index)
    }
    const updateIfNeeded = () => {
        if (editTabName && queryName[currentTab] && queryName[currentTab].length) {
            let newID = currentQuery.account_id === user?.id ? currentQuery.id : null
            queryName[currentTab] !== query[index].name && updateQuery({name: queryName[currentTab]}, index, newID)
        }
    }
    const renameQueryHandler = () => {
        if (!!currentQuery?.url && !!currentQuery.id) {		//if query READONLY
        } else {
            setEditTabName((prev) => !prev)
            updateIfNeeded()
        }
    }

    return <div className="tabs bitquery-tabs" id="tabs">
        <ul className="nav nav-tabs" style={{background:'#F8F8F8' }} role="tablist" aria-label="List of query tabs">
            {
                tabs.map((tab, i) => (
                    <li
                        role="tab"
                        aria-selected={currentTab === tab.id ? 'true' : 'false'}
                        className="nav-item" key={i}

                        onClick={() => currentTab !== tab.id && switchTabHandler(tab.id)}
                    >
                        <a href="# " className={'nav-link ' + (currentTab === tab.id && 'active')} key={i}>
                            {query[i].layout ? <i className="fas fa-th"></i>
                                : query[i].widget_id === 'json.widget' || !query[i].widget_id
                                    ? <GraphqlIcon fill={'#B71F54'} width={'16px'} height={'16px'}/>
                                    : <i className="fas fa-chart-bar bitquery-ico"></i>}
                            {
                                (editTabName && currentTab === tab.id)
                                    ? <>
                                        <input
                                            autoFocus
                                            type="text"
                                            value={queryName ? queryName[currentTab] : 'New Query'}
                                            className="tabs__edit"
                                            onChange={handleEdit}
                                        />
                                        <i className="fas fa-check" onClick={renameQueryHandler}/>
                                    </>
                                    : <span data-tip={tab.name} role='button' aria-label='name' tabIndex={0}
                                            className={'nav-link-title ' + ((currentTab === tab.id && !(!!currentQuery?.url && !!currentQuery.id)) ? 'cursor-edit' : undefined)}
                                            onClick={() => (currentTab === tab.id && (!currentQuery.id || currentQuery.account_id === user.id)) && renameQueryHandler(currentTab, i)}
                                    >
											{(('saved' in query[i]) && query[i].saved) || !('saved' in query[i])
                                                ? tab.name : `*${tab.name}`}
										</span>
                            }
                            <i role="button" aria-label='close tab' tabIndex={currentTab === tab.id ? "0" : "1"}
                               className="tab__close bi bi-x bitquery-ico-black" onClick={e => removeTabHandler(i, e)}/>
                        </a>
                    </li>
                ))
            }
            <li
                className="nav-item tab__add"
                onClick={addNewTabHandler}
            ><a href="#" role="button" aria-label="add new tab" className="nav-link bitquery-addNewTab"><i
                className="bi bi-plus bitquery-ico-black"/></a></li>
        </ul>
    </div>

})

export default TabsComponent
