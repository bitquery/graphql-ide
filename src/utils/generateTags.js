export const generateTags = (query, variables) => {
	const regex = new RegExp('([a-z]+)(?=[(]|[{]|[ ])', 'gmi')
	let tags = query.match(regex)?.filter(tag => tag !== 'query').slice(0, 2)
	let network = query.concat(variables).match(/(?<!$)network["]*:[ ]*["]*([a-z]+)["]*/gm)
	if (network) {
		network = network[0].replaceAll(' ', '').replaceAll('network', '').replaceAll('"', '').replaceAll(':', '')
		tags.push(network)
	}
	return tags
}
