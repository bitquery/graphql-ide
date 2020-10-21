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
	currentQuery = ''
	query = ''
	
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
			saveQuery: action,
			setQuery: action
		})
	}
	get queryParams() {
		return {
			account_id: UserStore.user && UserStore.user.id || null,
			query: this.currentQuery,
			arguments: this.currentVariables
		}
	}

	setQuery = query => {
		this.query = query
	}

	toggleGallery = () => {
		this.showGallery = !this.showGallery
	}
	setCurrentQuery = query => {
		this.currentQuery = query
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

}

export let UserStore = new User()
export default new Queries()
