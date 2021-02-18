import { makeObservable, observable, action } from "mobx"

class Modal {
	modalIsOpen = false
	loginIsOpen = false
	apiKeyIsOpen = false
	registerIsOpen = false
	saveQueryIsOpen = false
	shareQueryIsOpen = false
	editDialogIsOpen = false
	confirmationIsOpen = false
	forgotPasswordIsOpen = false
	changePasswordIsOpen = false
	
	constructor() {
		makeObservable(this, {
			modalIsOpen: observable,
			loginIsOpen: observable,
			apiKeyIsOpen: observable,
			registerIsOpen: observable,
			saveQueryIsOpen: observable,
			shareQueryIsOpen: observable,
			confirmationIsOpen: observable,
			changePasswordIsOpen: observable,
			forgotPasswordIsOpen: observable,
			toggleModal: action,
			toggleLogin: action,
			toggleRegister: action,
			toggleSaveQuery: action,
			toggleShareQuery: action,
			toggleConfirmation: action,
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
	toggleApiKey = () => {
		this.apiKeyIsOpen = !this.apiKeyIsOpen
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
	toggleConfirmation = () => {
		this.confirmationIsOpen = !this.confirmationIsOpen
	}
	toggleForgotPassword = () => {
		this.forgotPasswordIsOpen = !this.forgotPasswordIsOpen
	}
	toggleChangePassword = () => {
		this.changePasswordIsOpen = !this.changePasswordIsOpen
	}
}

export default new Modal()
