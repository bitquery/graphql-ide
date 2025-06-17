import { makeObservable, observable, action } from "mobx"

class Modal {
	fade = false
	modalIsOpen = false
	editDialogIsOpen = false
	confirmationIsOpen = false
	statisticsModalIsOpen = false
	confirmationAction = null
	confirmationMessage = ''

	constructor() {
		makeObservable(this, {
			fade: observable,
			modalIsOpen: observable,
			confirmationAction: observable,
			confirmationIsOpen: observable,
			confirmationMessage: observable,
			statisticsModalIsOpen: observable,
			toggleModal: action,
			toggleConfirmation: action,
			toggleStatisticsModal: action,
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

}

export default new Modal()
