import { makeObservable, observable, action } from "mobx"
import { QueriesStore } from './queriesStore'

class Gallery {
	tagListIsOpen = true
	queriesListIsOpen = false
	tagList = []
	queryList = []
	currentTag = 'All queries'
	subMenu = 0

	constructor() {
		makeObservable(this, {
			tagListIsOpen: observable,
			queriesListIsOpen: observable,
			tagList: observable,
			queryList: observable,
			currentTag: observable,
			subMenu: observable,
			toggleTagsList: action,
			toggleQueriesList: action,
			setCurrentTag: action,
			setSubMenu: action,
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
	setSubMenu = num => this.subMenu = num
}

export const GalleryStore = new Gallery()