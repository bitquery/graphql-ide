import {makeObservable, observable, action, computed} from "mobx"
import axios from 'axios'
import {getUser, regenerateKey, setDashboard} from "../api/api"
import {GalleryStore} from './galleryStore'

class User {
    user = null

    constructor() {
        makeObservable(this, {
            user: observable,
            getUser: action,
            setUser: action
        })
    }

    setUser = user => {
        this.user = user
    }

    getUser = async (updateToken = false) => {
        try {
            const {data} = await getUser()
            this.setUser(data.user[0])
            if (!updateToken) {
                const searchParams = new URL(document.location).searchParams
                let endpoint_url
                if (QueriesStore.currentQuery?.endpoint_url  === 'https://graphql.bitquery.io') {
                    endpoint_url = searchParams.get('endpoint') ? searchParams.get('endpoint') : data.user[0].graphql_legacy_url
                } else {
                    endpoint_url = searchParams.get('endpoint') ? searchParams.get('endpoint') : data.user[0].graphql_url
                }
                QueriesStore.updateQuery({endpoint_url}, 0)
            }
        } catch (error) {
            this.setUser(undefined)
            console.log(error.response?.data)
        }
    }

    regenKey = async (key) => {
        try {
            await regenerateKey(key)
            await this.getUser()
        } catch (error) {
            console.log(error.response.data)
        }
    }
}

class Queries {
    sharedQueries = []
    dashboardView = false
    defaultWidget = 'json.widget'
    queryIsTransfered = false	//flag to prettify query when it is transfered from explorer
    currentVariables = ''
    showGallery = true
    showSideBar = true
    queryJustSaved = false
    schema = {}
    isMobile = window.innerWidth <= 768
    gettingResult = false
    isLoaded = false
    currentQuery = {
        query: '',
        variables: '{}',
        data_type: 'response',
        config: {},
        id: null,
        widget_id: 'json.widget'
    }
    dashboardQuery = this.currentQuery
    query = [this.currentQuery]
    currentPage = 0
    queriesOnPage = 10
    searchValue = ''

    constructor() {
        makeObservable(this, {
            queryIsTransfered: observable,
            sharedQueries: observable,
            dashboardView: observable,
            currentVariables: observable,
            queryJustSaved: observable,
            dashboardQuery: observable,
            gettingResult: observable,
            currentQuery: observable,
            showSideBar: observable,
            searchValue: observable,
            isMobile: observable,
            isLoaded: observable,
            schema: observable,
            query: observable,
            queryParams: computed,
            queryNumber: computed,
            setQueryIsTransfered: action,
            toggleDashboardView: action,
            setCurrentVariables: action,
            setDashboardQuery: action,
            setSharedQueires: action,
            setGettingResult: action,
            setCurrentQuery: action,
            setCurrentPage: action,
            setSearchValue: action,
            toggleSideBar: action,
            setIsLoaded: action,
            updateQuery: action,
            removeQuery: action,
            saveToggle: action,
            saveQuery: action,
            setSchema: action,
            setMobile: action,
            setQuery: action
        })
    }

    get queryNumber() {
        return this.query.map(q => q.id).indexOf(this.currentQuery.id)
    }

    get queryParams() {
        return {
            id: this.currentQuery.id,
            isOwner: this.currentQuery.isOwner,
            query: this.currentQuery.query,
            variables: this.currentQuery.variables,
            config: this.currentQuery.config,
            widget_id: this.currentQuery.widget_id,
            displayed_data: this.currentQuery.displayed_data,
            data_type: this.currentQuery.data_type,
            name: this.currentQuery.name && this.currentQuery.name,
            description: this.currentQuery.description && this.currentQuery.description,
            url: this.currentQuery.url && this.currentQuery.url,
            endpoint_url: this.currentQuery.endpoint_url && this.currentQuery.endpoint_url.trim()
        }
    }

    setSearchValue = value => {
        this.searchValue = value
    }
    setCurrentPage = page => {
        this.currentPage = page
        return this.currentPage
    }
    setGettingResult = state => this.gettingResult = state
    setQueryIsTransfered = isTransfered => this.queryIsTransfered = isTransfered
    setIsLoaded = () => this.isLoaded = true
    toggleDashboardView = () => this.dashboardView = !this.dashboardView
    setSchema = schema => this.schema = schema
    setMobile = (mobile) => this.isMobile = mobile
    setQuery = (params, id) => {
        this.query.push({id: id ? id : null})
        this.query[this.query.length - 1].data_type = 'response'
        this.query[this.query.length - 1].saved = true
        this.query[this.query.length - 1] = {...this.query[this.query.length - 1], ...params}
        if (this.query[this.query.length - 1].config && typeof this.query[this.query.length - 1].config === 'string') {
            this.query[this.query.length - 1].config = JSON.parse(this.query[this.query.length - 1].config)
        }
        if (!this.query[this.query.length - 1].endpoint_url)
            // this.query[this.query.length - 1].endpoint_url = UserStore.user?.graphql_legacy_url
            this.query[this.query.length - 1].endpoint_url = UserStore.user?.graphql_url
        TabsStore.addNewTab(params.name)

    }
    setSharedQueires = queries => {
        this.sharedQueries = [...queries]
    }
    updateQuery = (params, index, id) => {
        if (params.query || params.query === '') this.query[index].query = params.query
        if (params.variables || params.variables === '') this.query[index].variables = params.variables
        if (params.config) this.query[index].config = params.config
        if (typeof params.widget_id === 'string') {
            this.query[index].widget_id = params.widget_id
            // params.widget_id === this.defaultWidget
            // 	? TabsStore.toggleMode('json')
            // 	: TabsStore.toggleMode('view')
        }
        if (typeof params.displayed_data === 'string') this.query[index].displayed_data = params.displayed_data
        if (params.data_type) this.query[index].data_type = params.data_type
        if (params.isOwner) this.query[index].isOwner = params.isOwner
        if ('account_id' in params) this.query[index].account_id = params.account_id
        if (params.endpoint_url || params.endpoint_url === '') this.query[index].endpoint_url = params.endpoint_url
        if ('gettingPointsCount' in params) this.query[index].gettingPointsCount = params.gettingPointsCount
        if (params.url || params.url === null) this.query[index].url = params.url
        if (params.name) {
            this.query[index].name = params.name || this.query[index].name
            TabsStore.renameCurrentTab(params.name)
        }
        if ('tags' in params) this.query[index].tags = params.tags
        if (params.javascript) this.query[index].javascript = params.javascript
        if (params.description) this.query[index].description = params.description || this.query[index].description
        if (params.widget_ids) this.query[index].widget_ids = params.widget_ids
        if (params.dashboard_item_indexes) this.query[index].dashboard_item_indexes = params.dashboard_item_indexes
        if (params.layout || params.layout === null) this.query[index].layout = params.layout
        if (params.content) this.query[index].content = params.content
        if (params.graphqlQueryID) this.query[index].graphqlQueryID = params.graphqlQueryID
        if ('points' in params) this.query[index].points = params.points
        if ('responseTime' in params) this.query[index].responseTime = params.responseTime
        if ('graphqlRequested' in params) this.query[index].graphqlRequested = params.graphqlRequested
        if ('isDraggable' in params) this.query[index].isDraggable = params.isDraggable
        if ('isResizable' in params) this.query[index].isResizable = params.isResizable
        this.query[index].id = id || id === null ? id : this.query[index].id
        if ('saved' in params) {
            this.query[index].saved = params.saved
            if (this.query[index].url && !params.saved) {
                this.query[index].id = null
                this.query[index].url = null
            }
        }
        if (params.preQuery) this.query[index].preQuery = params.preQuery
        this.setCurrentQuery(index)
    }
    removeQuery = index => {
        this.query.length !== 1 ? this.query.splice(index, 1) : this.query.splice(index, 1, {
            query: '',
            id: null
        })
        TabsStore.removeTab(index)
    }
    toggleSideBar = state => {
        this.showSideBar = state
        setTimeout(() => window.dispatchEvent(new Event('resize')), 0)
    }
    setCurrentQuery = (id) => {
        this.currentQuery = {...this.query[id]}
        this.currentQuery.widget_id === this.defaultWidget
            ? TabsStore.toggleMode('json')
            : TabsStore.toggleMode('view')
        document.title = this.currentQuery.name || 'New Query'
    }
    setDashboardQuery = (params, id) => {
        this.dashboardQuery = {...params, id}
        if (this.dashboardQuery.config && typeof this.dashboardQuery.config === 'string') {
            this.dashboardQuery.config = JSON.parse(this.dashboardQuery.config)
        }
    }
    setCurrentVariables = variables => {
        this.currentVariables = variables
    }
    saveToggle = () => {
        this.queryJustSaved = !this.queryJustSaved
    }
    saveQuery = async params => {
        try {
            const {data} = !this.currentQuery.layout
                ? await axios.post('/api/addquery', {
                    params
                })
                : await setDashboard(params)
            let id = TabsStore.tabs.map(tab => tab.id).indexOf(TabsStore.currentTab)
            this.updateQuery({...params, account_id: UserStore.user.id, saved: true}, id, data.id)
            this.queryJustSaved = !this.queryJustSaved
            GalleryStore.setCurrentTag('')
            this.currentQuery.layout && window.dispatchEvent(new Event('updateInitialDashboard'))
            return data
        } catch (e) {
            console.log(e.response)
            return e.response
        }
    }
    logQuery = async errors => {
        if (!this.currentQuery.id) {
            return
        }
        const params = {
            id: this.currentQuery.id,
            account_id: UserStore.user.id,
            success: !errors,
            error: JSON.stringify(errors)
        }
        try {
            axios.post('/api/querylog', {params})
        } catch (e) {
            console.log(e)
        }
    }

}

class Tabs {
    id = 0
    tabs = [
        {
            name: 'New Query',
            id: this.id
        }
    ]
    currentTab = 0
    jsonMode = true
    codeMode = false
    viewMode = true
    dbid = null


    constructor() {
        makeObservable(this, {
            dashid: computed,
            dbid: observable,
            tabs: observable,
            id: observable,
            currentTab: observable,
            jsonMode: observable,
            codeMode: observable,
            viewMode: observable,
            index: computed,
            setDbid: action,
            toggleMode: action,
            switchTab: action,
            incID: action,
            removeTab: action,
            addNewTab: action,
            renameCurrentTab: action
        })
    }

    get dashid() {
        let id = null
        QueriesStore.query.forEach((query, i) => {
            if (query.layout) id = this.tabs[i].id
        })
        return id
    }

    get index() {
        return this.tabs.map(tab => tab.id).indexOf(this.currentTab)
    }

    toggleMode = (mode) => {
        switch (mode) {
            case 'json':
                this.jsonMode = true
                this.codeMode = false
                this.viewMode = false
                break;
            case 'code':
                this.jsonMode = false
                this.codeMode = true
                this.viewMode = false
                break;
            case 'view':
                this.jsonMode = false
                this.codeMode = false
                this.viewMode = true
                break;
        }
    }
    setDbid = (close) => this.dbid = close ? null : this.currentTab
    incID = () => {
        this.id = this.id + 1
    }
    switchTab = tabID => {	//tabID - id, not index or serial number
        console.log('tabID - ', tabID)
        this.currentTab = tabID
        let id = this.index
        QueriesStore.setCurrentQuery(id)
    }
    renameCurrentTab = name => {
        this.tabs[this.index].name = name
    }
    addNewTab = name => {
        this.incID()
        this.tabs.push({
            name: name,
            id: this.id
        })
        this.switchTab(this.id)
        // QueriesStore.setCurrentQuery(this.index)
    }
    removeTab = (index) => {
        this.tabs.length !== 1 ? this.tabs.splice(index, 1) : console.log('xvatit')
        this.tabs.length === 0
            ? this.addNewTab('New Query')
            : this.tabs.length === index
                ? this.switchTab(this.tabs[index - 1].id)
                : this.switchTab(this.tabs[index].id)
    }
}

export let TabsStore = new Tabs()
export let UserStore = new User()
export let QueriesStore = new Queries()
