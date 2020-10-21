import { makeObservable, observable, action } from "mobx"

class Modal {
	registerIsOpen = false
	saveQueryIsOpen = false
	shareQueryIsOpen = false
	
	constructor() {
		makeObservable(this, {
			registerIsOpen: observable,
			saveQueryIsOpen: observable,
			shareQueryIsOpen: observable,
			toggleRegister: action,
			toggleSaveQuery: action,
			toggleShareQuery: action
		})
	}

	toggleRegister = () => {
		this.registerIsOpen = !this.registerIsOpen
	}
	toggleSaveQuery = () => {
		this.saveQueryIsOpen = !this.saveQueryIsOpen
	}
	toggleShareQuery = () => {
		this.shareQueryIsOpen = !this.shareQueryIsOpen
	}
}

export default new Modal()
