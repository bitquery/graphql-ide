import { makeObservable, observable, action } from "mobx"

class Modal {
	fade = false
	modalIsOpen = false
	loginIsOpen = false
	apiKeyIsOpen = false
	registerIsOpen = false
	shareQueryIsOpen = false
	editDialogIsOpen = false
	confirmationIsOpen = false
	statisticsModalIsOpen = false
	confirmationAction = null
	confirmationMessage = ''
	forgotPasswordIsOpen = false
	changePasswordIsOpen = false
	dashboardSettingsIsOpen = false
	
	constructor() {
		makeObservable(this, {
			fade: observable,
			modalIsOpen: observable,
			loginIsOpen: observable,
			apiKeyIsOpen: observable,
			registerIsOpen: observable,
			shareQueryIsOpen: observable,
			confirmationAction: observable,
			confirmationIsOpen: observable,
			confirmationMessage: observable,
			changePasswordIsOpen: observable,
			forgotPasswordIsOpen: observable,
			statisticsModalIsOpen: observable,
			dashboardSettingsIsOpen: observable,
			toggleModal: action,
			toggleLogin: action,
			toggleRegister: action,
			toggleShareQuery: action,
			toggleConfirmation: action,
			toggleForgotPassword: action,
			toggleChangePassword: action,
			toggleStatisticsModal: action,
			toggleDashboardSettings: action
		})
	}

	toggleModal = settings => {
		this.modalIsOpen = !this.modalIsOpen
		if (settings) {
			this.fade = settings.fade
		} else {
			this.fade = this.fade && false
		}
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
	toggleShareQuery = () => {
		this.shareQueryIsOpen = !this.shareQueryIsOpen
	}
	toggleStatisticsModal = () => {
		this.statisticsModalIsOpen = !this.statisticsModalIsOpen
	}
	toggleEditDialog = () => {
		this.editDialogIsOpen = !this.editDialogIsOpen
	}
	toggleConfirmation = (message, action) => {
		this.confirmationIsOpen = !this.confirmationIsOpen
		if (message) this.confirmationMessage = message
		if (action) this.confirmationAction = action
	}
	toggleForgotPassword = () => {
		this.forgotPasswordIsOpen = !this.forgotPasswordIsOpen
	}
	toggleChangePassword = () => {
		this.changePasswordIsOpen = !this.changePasswordIsOpen
	}
	toggleDashboardSettings = () => {
		this.dashboardSettingsIsOpen = !this.dashboardSettingsIsOpen
	}
}

export default new Modal()
