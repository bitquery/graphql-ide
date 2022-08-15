import codegen from 'postman-code-generators'
import sdk from 'postman-collection'

export const getCodeSnippet = (lang, query, variables, key, endpoint_url) => 
	new Promise((resolve, reject) => {
		const request = new sdk.Request({
			url: endpoint_url,
			method: 'POST',
			header: { 'Content-Type': 'application/json', 'X-API-KEY': key },
			body: JSON.stringify({ query, variables })
		})
		const language = lang.key
		const variant = lang.variant
		const options = {
			indentCount: 3,
			indentType: 'Space',
			trimRequestBody: true,
			followRedirect: true
		}
		codegen.convert(language, variant, request, options, function(error, snippet) {
			if (error) {
				reject(error)
			}
			resolve(snippet)
		})
	}
)
