import { observer } from 'mobx-react-lite'
import React, { useEffect } from 'react'
import QueryEditor from './QueryEditor'
import VariableEditor from './VariableEditor'
import { TabsStore } from '../../../store/queriesStore';

const GraphqlEditor = observer(function GraphqlEditor({
	schema,
	query,
	variables,
	variableToType,
	onRunQuery,
	onEditQuery,
	onEditVariables,
	number,
	readOnly
}, { ref1, ref2 }) {
	const { currentTab } = TabsStore
	useEffect(() => {
		ref1.current.getEditor().refresh()
		ref2.current.getEditor().refresh()
		// eslint-disable-next-line 
	}, [currentTab])
	return (
		<div className="editor__wrapper" >
			<QueryEditor
				readOnly={readOnly}
				onRunQuery={onRunQuery}
				number={number}
				ref={ref1}
				onEdit={onEditQuery}
				schema={schema} 
				value={query} 
			/>
			<VariableEditor
				readOnly={readOnly}
				number={number}
				ref={ref2}
				onEdit={onEditVariables}
				variableToType={variableToType}
				value={variables}
			/>
		</div>
	)
}, { forwardRef: true })

export default GraphqlEditor
