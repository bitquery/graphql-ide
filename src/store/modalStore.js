import { makeObservable, observable, action } from "mobx"

class Modal {
	registerIsOpen = false
	loginIsOpen = false
	saveQueryIsOpen = false
	shareQueryIsOpen = false
	changePasswordIsOpen = false
	forgotPasswordIsOpen = false
	modalIsOpen = false
	
	constructor() {
		makeObservable(this, {
			modalIsOpen: observable,
			registerIsOpen: observable,
			saveQueryIsOpen: observable,
			shareQueryIsOpen: observable,
			changePasswordIsOpen: observable,
			forgotPasswordIsOpen: observable,
			loginIsOpen: observable,
			toggleModal: action,
			toggleLogin: action,
			toggleRegister: action,
			toggleSaveQuery: action,
			toggleShareQuery: action,
			toggleForgotPassword: action,
			toggleChangePassword: action
		})
	}

	toggleModal = () => {
		this.modalIsOpen = !this.modalIsOpen
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
	toggleForgotPassword = () => {
		this.forgotPasswordIsOpen = !this.forgotPasswordIsOpen
	}
	toggleChangePassword = () => {
		this.changePasswordIsOpen = !this.changePasswordIsOpen
	}
}

export default new Modal()
