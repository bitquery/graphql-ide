export const formatter = (cell, formatterParams,  onRendered) => {
	let linkWithParams = ''
	cell.getRow().getCells().forEach(cell => linkWithParams = `${linkWithParams}&${cell.getField()}=${cell.getValue()}`)
	const linkEl = document.createElement('a')
	const linkText = document.createTextNode(cell.getValue())
	linkEl.href = `${formatterParams.url}?${linkWithParams}`
	linkEl.target = '_blank'
	linkEl.appendChild(linkText)
	return linkEl
}