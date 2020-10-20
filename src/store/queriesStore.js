import { makeObservable, observable, action } from "mobx"
import axios from 'axios'

class Queries {
	showGallery = true
	currentQuery = ''
	currentVariables = ''
	
	constructor() {
		makeObservable(this, {
			showGallery: observable,
			currentQuery: observable,
			currentVariables: observable,
			setCurrentVariables: action,
			setCurrentQuery: action,
			toggleGallery: action,
			saveQuery: action
		})
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
			const { data } = await axios.post('/api/addquery', { params })
			console.log(data)
		} catch (e) {
			console.log(e)
		}
	}

}

export default new Queries()