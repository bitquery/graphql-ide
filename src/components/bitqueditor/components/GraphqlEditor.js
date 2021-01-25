import { observer } from 'mobx-react-lite'
import React, { useRef, useEffect } from 'react'
import QueryEditor from './QueryEditor'
import VariableEditor from './VariableEditor'
import { TabsStore } from '../../../store/queriesStore';

const GraphqlEditor = observer(function GraphqlEditor({
	schema,
	query,
	variables,
	variableToType,
	onEditQuery,
	onEditVariables,
	number
}, { ref1, ref2 }) {
	const { currentTab } = TabsStore
	useEffect(() => {
		ref1.current.getEditor().refresh()
		ref2.current.getEditor().refresh()
	}, [currentTab])
	return (
		<div className="editor__wrapper" >
			<QueryEditor 
				number={number}
				ref={ref1}
				onEdit={onEditQuery}
				schema={schema} 
				value={query} 
			/>
			<VariableEditor
				ref={ref2}
				onEdit={onEditVariables}
				variableToType={variableToType}
				value={variables}
			/>
			
		</div>
	)
}, { forwardRef: true })

export default GraphqlEditor
