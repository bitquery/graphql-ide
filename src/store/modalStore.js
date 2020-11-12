import { makeObservable, observable, action } from "mobx"

class Modal {
	modalIsOpen = false
	loginIsOpen = false
	registerIsOpen = false
	saveQueryIsOpen = false
	shareQueryIsOpen = false
	editDialogIsOpen = false
	forgotPasswordIsOpen = false
	changePasswordIsOpen = false
	
	constructor() {
		makeObservable(this, {
			modalIsOpen: observable,
			loginIsOpen: observable,
			registerIsOpen: observable,
			saveQueryIsOpen: observable,
			shareQueryIsOpen: observable,
			changePasswordIsOpen: observable,
			forgotPasswordIsOpen: observable,
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
	toggleEditDialog = () => {
		this.editDialogIsOpen = !this.editDialogIsOpen
	}
	toggleForgotPassword = () => {
		this.forgotPasswordIsOpen = !this.forgotPasswordIsOpen
	}
	toggleChangePassword = () => {
		this.changePasswordIsOpen = !this.changePasswordIsOpen
	}
}

export default new Modal()
