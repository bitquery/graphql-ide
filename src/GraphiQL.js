import React from 'react'
import { render } from 'react-dom'
import GraphiQL from 'graphiql'

export default (fetcher) => {
	/* let allSections = document.getElementsByClassName('graphiql')
	for (let el of allSections) {
		el.classList.remove(('is-active'))
	}
	let main = document.getElementsByClassName('main')[0]
	let newChild = document.createElement('div')
	newChild.classList.add('graphiql','is-active')
	newChild.id = 'newTab'
	let target = main.appendChild(newChild) */
	let graphiQLInstance
	render(
		React.createElement(GraphiQL, {
		ref(el) { graphiQLInstance = el },
		fetcher,
		response: null,
		variables: '{}',
		operationName: null,
		websocketConnectionParams: null
		}),
		document.getElementById('graphiql')
	)
	graphiQLInstance.queryEditorComponent.editor.refresh()
	graphiQLInstance.variableEditorComponent.editor.refresh()
	graphiQLInstance.state.variableEditorOpen = true
	graphiQLInstance.state.docExplorerOpen = false
}

