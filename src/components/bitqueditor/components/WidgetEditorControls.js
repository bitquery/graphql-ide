import React, { useEffect, useState } from 'react'
import WidgetSelect from './WidgetSelect'
import DisplayedData from './DisplayedData'
import ResponseDataType from './ResponseDataType'
import { QueriesStore, TabsStore } from '../../../store/queriesStore'
import { observer } from 'mobx-react-lite'
import { getWidgetConfig } from '../../../api/api'
import ToolbarButton from './ToolbarButton'
import JsonWidget from "./JsonComponent";

const WidgetEditorControls = observer(
	function WidgetEditorControls({abortRequest}) {
	const { currentQuery,  updateQuery, schema } = QueriesStore
	const { index } = TabsStore

	const onClick = widget_id => {
		updateQuery({ widget_id }, index)
		schema.length && abortRequest()
	}

	return <div className='d-flex p-2' style={{backgroundColor: '#f6f7f8'}}>
		<ToolbarButton
			title='JSON'
			onClick={() => onClick('json.widget')}
			style={{color: currentQuery.widget_id === 'json.widget' ?  '#171717' :'#B71F54', boxShadow: currentQuery.widget_id === 'json.widger'? '#CE4372 1px 1px 4px -1px inset, 5px 5px 11px 5px rgba(0, 0, 0, 0)' : 'none', marginRight:'4px'}}
		/>
		<ToolbarButton
			title='Widget'
			onClick={() => onClick('config.widget')}
			style={{color: currentQuery.widget_id === 'config.widget' ?  '#171717' :'#B71F54', boxShadow: currentQuery.widget_id === 'config.widger'? '#CE4372 1px 1px 4px -1px inset, 5px 5px 11px 5px rgba(0, 0, 0, 0)' : 'none'}}

		/>
	</div>
})

export default WidgetEditorControls
