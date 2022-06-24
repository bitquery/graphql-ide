export const generateTags = query => {
	const regex = new RegExp('([a-z]+)(?=[(]|[{]|[ ])', 'gmi')
	let tags = query.match(regex)?.filter(tag => tag !== 'query').slice(0, 2)
	return tags
}