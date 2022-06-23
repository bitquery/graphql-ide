import { makeObservable, observable, action } from "mobx"

class Gallery {
	tagListIsOpen = false
	queriesListIsOpen = false
	tagList = []
	queryList = []
	currentTag = ''

	constructor() {
		makeObservable(this, {
			tagListIsOpen: observable,
			queriesListIsOpen: observable,
			tagList: observable,
			queryList: observable,
			currentTag: observable,
			toggleTagsList: action,
			toggleQueriesList: action,
			setCurrentTag: action
		})
	}

	toggleTagsList = () => this.tagListIsOpen = !this.tagListIsOpen
	toggleQueriesList = () => this.queriesListIsOpen = !this.queriesListIsOpen
	setCurrentTag = tag => this.currentTag = tag
}

export const GalleryStore = new Gallery()