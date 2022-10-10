import { makeObservable, observable, action } from "mobx"
import { QueriesStore } from './queriesStore'

class Gallery {
	tagListIsOpen = true
	queriesListIsOpen = false
	tagList = []
	queryList = []
	currentTag = 'All queries'

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
	setCurrentTag = tag => {
		if (this.currentTag !== tag) {
			QueriesStore.setCurrentPage(0)
			this.currentTag = tag
		}
	}
}

export const GalleryStore = new Gallery()