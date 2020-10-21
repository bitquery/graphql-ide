import { makeObservable, observable, action } from "mobx"

class Tabs {
	id = 0
	tabs = [
		{
			name: 'New Tab',
			id: this.id
		}
	]
	currentTab = 0

	constructor() {
		makeObservable(this, {
			tabs: observable,
			id: observable,
			currentTab: observable,
			switchTab: action,
			incID: action,
			removeTab: action,
			addNewTab: action,
			renameCurrentTab: action
		})
	}

	incID = () => {
		this.id = this.id + 1
	}
	switchTab = tabID => {
		this.currentTab = tabID
	}
	renameCurrentTab = name => {
		let id = this.tabs.map((tab, i) => tab.id).indexOf(this.currentTab)
		this.tabs[id].name = name
	}
	addNewTab = name => {
		this.incID()
		this.tabs.push({
			name: name,
			id: this.id
		})
		this.switchTab(this.id)
	}
	removeTab = (index, event) => {
		event.stopPropagation()
		this.tabs.splice(index, 1)
		this.tabs.length === 0 
			? this.addNewTab() 
			: this.switchTab(this.tabs[this.tabs.length-1].id)
	}

}

export default new Tabs()
