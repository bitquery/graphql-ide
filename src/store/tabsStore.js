import { makeObservable, observable, action } from "mobx"

class Tabs {
	tabs = [1]
	currentTab = 1

	constructor() {
		makeObservable(this, {
			tabs: observable,
			currentTab: observable,
			switchTab: action,
			removeTab: action,
			addNewTab: action,
			setCurrentTab: action,
			renameCurrentTab: action
		})
	}
	
	switchTab = tab => {
		this.currentTab = tab
	}
	removeTab = (index, event) => {
		event.stopPropagation()
		this.tabs.splice(index, 1)
		this.tabs.length === 0 && this.addNewTab()
		this.currentTab = this.tabs[this.tabs.length-1] || this.tabs[0] || 1
	}
	addNewTab = () => {
		this.tabs.push(this.tabs[this.tabs.length-1]+1 || 1)
		this.switchTab(this.tabs[this.tabs.length-1])
	}
	setCurrentTab = newCurrTab => {
		this.currentTab = newCurrTab
	}
	renameCurrentTab = name => {
		this.tabs[this.tabs.indexOf(this.currentTab)] = name
		this.setCurrentTab(name)
	}
	
}

export default new Tabs()
