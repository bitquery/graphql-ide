import React from 'react'
import { render } from 'react-dom'
import GraphiQL from 'graphiql'

export default (fetcher) => {
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

