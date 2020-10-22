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
		id: null
	}
	query = []
	
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
			arguments: this.currentVariables
		}
	}

	setQuery = query => {
		this.query.push(query)
	}
	updateQuery = (query, index) => {
		this.query.splice(index, 1, query)
	}
	removeQuery = index => {
		this.query.splice(index, 1)
	}
	toggleGallery = () => {
		this.showGallery = !this.showGallery
	}
	setCurrentQuery = (query, id) => {
		this.currentQuery.query = query
		id ? this.currentQuery.id = id : this.currentQuery.id = null
	}
	setCurrentVariables = variables => {
		this.currentVariables = variables
	}
	saveQuery = async params => {
		try {
			const { data } = await axios.post('/api/addquery', { 
				params
			})
			console.log(data)
		} catch (e) {
			console.log(e)
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

export let UserStore = new User()
export default new Queries()
