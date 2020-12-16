import React, { useState } from 'react'
import QueryEditor from './QueryEditor'
import VariableEditor from './VariableEditor'

function GraphqlEditor({
	schema,
	query,
	variables,
	variableToType,
	onEditQuery,
	onEditVariable
}) {
	return (
		<div className="editor__wrapper" >
			<QueryEditor 
				onEdit={onEditQuery}
				schema={schema} 
				value={query} 
			/>
			<VariableEditor
				onEdit={onEditVariable}
				variableToType={variableToType}
				value={variables}
			/>
			
		</div>
	)
}

export default GraphqlEditor
