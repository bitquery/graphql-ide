export const formatter = (cell, formatterParams,  onRendered) => {
	let linkWithParams = ''
	let cells = {}
	let output = cell.getValue()
	cell.getRow().getCells().forEach(cell => {
		if (formatterParams.url) linkWithParams = `${linkWithParams}&${cell.getField()}=${cell.getValue()}`
		if (formatterParams.expression) cells[cell.getField()] = cell.getValue()
	})
	if (formatterParams.expression) {
		try {
			const fn = new Function('cells', `return ${formatterParams.expression}`)
			output = fn(cells)
		} catch (error) {
			console.log(error)
		}
	}
	if (formatterParams.url) {
		const linkEl = document.createElement('a')
		const linkText = document.createTextNode(output)
		linkEl.href = `${formatterParams.url}?${linkWithParams}`
		linkEl.target = '_blank'
		linkEl.appendChild(linkText)
		return linkEl
	}
	return output
}