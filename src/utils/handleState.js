import { TabsStore } from "../store/queriesStore"

export default (state) => {
	const { tabs, currentTab } = TabsStore

	if (tabs.length===1 && tabs[0].id === 0) return false
	if (currentTab in state) {
		for (let key in state) {
			if (tabs.map(tab => tab.id).indexOf(+key)===-1) {
				const {[key]: deletedKey, ...actual} = state
				return actual
			}
		}
	} else {
		let id = tabs.map(tab => tab.id).indexOf(currentTab)
		return {...state, [currentTab]: tabs[id].name}
	}
}