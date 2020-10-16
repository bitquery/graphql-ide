import { makeObservable, observable, action } from "mobx";

class Modal {
	registerIsOpen = false
	saveQueryIsOpen = false
	
	constructor() {
		makeObservable(this, {
			registerIsOpen: observable,
			saveQueryIsOpen: observable,
			toggleRegister: action,
			toggleSaveQuery: action
		})
	}

	toggleRegister = () => {
		this.registerIsOpen = !this.registerIsOpen
	}
	toggleSaveQuery = () => {
		this.saveQueryIsOpen = !this.saveQueryIsOpen
	}
}

export default new Modal()
