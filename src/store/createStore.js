import { getUser } from '../api/api'

export function createStore() {
	return {
		registerIsOpen: false,
		saveQueryIsOpen: false,
		toggleRegister() {
			this.registerIsOpen = !this.registerIsOpen
		},
		toggleSaveQuery() {
			this.saveQueryIsOpen = !this.saveQueryIsOpen
		},
		user: null,
		async getUser() {
			try {
				const { data } = await getUser()
				this.user = data.user[0]
			} catch (e) { console.log(e.response.data) } 
		}
	}
}