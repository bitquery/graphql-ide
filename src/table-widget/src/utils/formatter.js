export const formatter = (cell, formatterParams,  onRendered) => {
	let linkWithParams = ''
	let cells = {}
	let output = cell.getValue()
	let row = cell.getRow().getData()
	const { links, variables, network, formatterType, expression } = formatterParams

	cell.getRow().getCells().forEach(cell => {
		if (expression) cells[cell.getField()] = cell.getValue()
	})
	if (expression) {
		try {
			const fn = new Function('cells', `return ${expression}`)
			output = fn(cells)
		} catch (error) {
			console.log(error)
		}
	}
	if (formatterType && links(undefined, variables, row)[network][formatterType].link()) {
		const linkEl = document.createElement('a')
		const linkText = document.createTextNode(output)
		linkEl.href = `https://explorer.bitquery.io/${network}/${links(undefined, variables, row)[network][formatterType].link()}`
		linkEl.target = '_blank'
		linkEl.appendChild(linkText)
		return linkEl
	}
	return output
}