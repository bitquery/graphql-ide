import { makeObservable, observable, action } from "mobx"
import { login } from "../api/api"

class Modal {
	registerIsOpen = false
	loginIsOpen = false
	saveQueryIsOpen = false
	shareQueryIsOpen = false
	
	constructor() {
		makeObservable(this, {
			registerIsOpen: observable,
			saveQueryIsOpen: observable,
			shareQueryIsOpen: observable,
			loginIsOpen: observable,
			closeHandler: action,
			resetLoginIsOpen: action,
			toggleLogin: action,
			toggleRegister: action,
			toggleSaveQuery: action,
			toggleShareQuery: action
		})
	}

	closeHandler = () => {
		this.toggleRegister()
		this.resetLoginIsOpen()
	}
	resetLoginIsOpen = () => {
		this.loginIsOpen = false
	}
	toggleLogin = (e) => {
		if (e) e.preventDefault()
		this.loginIsOpen = !this.loginIsOpen
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
