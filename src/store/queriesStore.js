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
			arguments: this.currentQuery.variables
		}
	}

	setQuery = (params, id) => {
		this.query.push({ id: id ? id : null })
		if (params.query) this.query[this.query.length-1].query = params.query
		if (params.url) this.query[this.query.length-1].url = params.url
		this.query[this.query.length-1].variables = params.variables ? params.variables : '{}'
	}
	updateQuery = (params, index, id) => {
		if (params.query) this.query[index].query = params.query
		if (params.variables) this.query[index].variables = params.variables
		this.query[index].id = id ? id : null
	}
	removeQuery = index => {
		this.query.length!==1 ? this.query.splice(index, 1) : this.query.splice(index, 1, {
			query: '{}',
			id: null
		})
	}
	toggleGallery = () => {
		this.showGallery = !this.showGallery
	}
	setCurrentQuery = (params, id) => {
		if (params.query) this.currentQuery.query = params.query
		if (params.variables) this.currentQuery.variables = params.variables
		this.currentQuery.id = id ? id : null
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
			this.updateQuery(params.query, id, data.id)
			this.setCurrentQuery(params.query, data.id)
			console.log(data)
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
			name: 'New Tab',
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
		let cQuery = QueriesStore.query[id] && QueriesStore.query[id].query
		let cQueryID = QueriesStore.query[id] && QueriesStore.query[id].id
		QueriesStore.setCurrentQuery( cQuery || '{}', cQueryID || null)
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
		this.tabs.splice(index, 1)
		this.tabs.length === 0 
			? this.addNewTab('New Tab') 
			: this.switchTab(this.tabs[this.tabs.length-1].id)
	}

}

export let TabsStore = new Tabs()
export let UserStore = new User()
export let QueriesStore = new Queries()
