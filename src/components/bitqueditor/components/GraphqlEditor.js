import { observer } from 'mobx-react-lite'
import React, { useRef, useEffect } from 'react'
import QueryEditor from './QueryEditor'
import VariableEditor from './VariableEditor'
import { TabsStore } from '../../../store/queriesStore';

const GraphqlEditor = observer(({
	schema,
	query,
	variables,
	variableToType,
	onEditQuery,
	onEditVariables,
	number
}) => {
	const queryEditor = useRef(null)
	const variablesEditor = useRef(null)
	const { currentTab } = TabsStore
	useEffect(() => {
		queryEditor.current.getEditor().refresh()
		variablesEditor.current.getEditor().refresh()
	}, [currentTab])
	return (
		<div className="editor__wrapper" >
			<QueryEditor 
				number={number}
				ref={queryEditor}
				onEdit={onEditQuery}
				schema={schema} 
				value={query} 
			/>
			<VariableEditor
				ref={variablesEditor}
				onEdit={onEditVariables}
				variableToType={variableToType}
				value={variables}
			/>
			
		</div>
	)
})

export default GraphqlEditor
