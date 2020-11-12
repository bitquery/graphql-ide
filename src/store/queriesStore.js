import { makeObservable, observable, action, computed } from "mobx"
import axios from 'axios'
import { getUser } from "../api/api"

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

	getUser = async () => {
		try {
			const { data } = await getUser()
			this.setUser(data.user[0])
		} catch (error) {
			console.log(error.response.data)
		}
	}
}

class Queries {
	currentVariables = ''
	showGallery = true
	queryJustSaved = false
	currentQuery = {
		query: '',
		variables: '{}',
		id: null
	}
	query = [{
		query: '',
		variables: '{}',
		id: null
	}]
	
	constructor() {
		makeObservable(this, {
			currentVariables: observable,
			queryJustSaved: observable,
			currentQuery: observable,
			showGallery: observable,
			query: observable,
			queryParams: computed,
			setCurrentVariables: action,
			setCurrentQuery: action,
			toggleGallery: action,
			updateQuery: action,
			removeQuery: action,
			saveQuery: action,
			setQuery: action
		})
	}
	get queryParams() {
		return {
			id: this.currentQuery.id,
			account_id: UserStore.user && UserStore.user.id || null,
			query: this.currentQuery.query,
			arguments: this.currentQuery.variables,
			name: this.currentQuery.name && this.currentQuery.name,
			description: this.currentQuery.description && this.currentQuery.description
		}
	}

	setQuery = (params, id) => {
		this.query.push({ id: id ? id : null })
		if (typeof params.query === 'string') this.query[this.query.length-1].query = params.query
		if (params.url) this.query[this.query.length-1].url = params.url
		this.query[this.query.length-1].variables = params.variables ? params.variables : '{}'
		this.query[this.query.length-1].name = params.name
		if (params.description) this.query[this.query.length-1].description = params.description
		if (this.query[this.query.length-1].id) this.query[this.query.length-1].saved = true  
		TabsStore.addNewTab(params.name)
	}
	updateQuery = (params, index, id) => {
		if (params.query) this.query[index].query = params.query
		if (params.variables) this.query[index].variables = params.variables
		if (params.url) this.query[index].url = params.url
		if (params.name) {
			this.query[index].name = params.name || this.query[index].name
			TabsStore.renameCurrentTab(params.name)
		}
		if (params.description) this.query[index].description = params.description || this.query[index].description
		this.query[index].id = id ? id : this.query[index].id
		this.query[index].saved = false
		this.setCurrentQuery(index)
	}
	removeQuery = index => {
		this.query.length!==1 ? this.query.splice(index, 1) : this.query.splice(index, 1, {
			query: '',
			id: null
		})
	}
	toggleGallery = () => {
		this.showGallery = !this.showGallery
	}
	setCurrentQuery = (id) => {
		this.currentQuery = {...this.query[id]}
	}
	setCurrentVariables = variables => {
		this.currentVariables = variables
	}
	saveQuery = async params => {
		try {
			const { data } = await axios.post('/api/addquery', { 
				params
			})
			let id = TabsStore.tabs.map(tab => tab.id).indexOf(TabsStore.currentTab)
			this.updateQuery(params, id, data.id)
			console.log(data)
			this.queryJustSaved = !this.queryJustSaved
			this.query[id].saved = true
			this.setCurrentQuery(id)
			return data
		} catch (e) {
			console.log(e.response)
			return e.response
		}
	}
	logQuery = async params => {
		try {
			const { data } = await axios.post('/api/addquerylog', { 
				params
			})
			console.log(data)
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

	constructor() {
		makeObservable(this, {
			tabs: observable,
			id: observable,
			currentTab: observable,
			switchTab: action,
			incID: action,
			removeTab: action,
			addNewTab: action,
			renameCurrentTab: action
		})
	}

	incID = () => {
		this.id = this.id + 1
	}
	switchTab = tabID => {
		this.currentTab = tabID
		let id = this.tabs.map(tab => tab.id).indexOf(this.currentTab)
		QueriesStore.setCurrentQuery(id)
	}
	renameCurrentTab = name => {
		let id = this.tabs.map(tab => tab.id).indexOf(this.currentTab)
		this.tabs[id].name = name
	}
	addNewTab = name => {
		this.incID()
		this.tabs.push({
			name: name,
			id: this.id
		})
		this.switchTab(this.id)
	}
	removeTab = (index, event) => {
		event.stopPropagation()
		this.tabs.length !==1 && this.tabs.splice(index, 1)
		this.tabs.length === 0 
			? this.addNewTab('New Query') 
			: this.switchTab(this.tabs[this.tabs.length-1].id)
	}
}

export let TabsStore = new Tabs()
export let UserStore = new User()
export let QueriesStore = new Queries()
