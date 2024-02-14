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
			style={{color: currentQuery.widget_id === 'json.widget' ? 'blue' : '#555'}}
		/>
		<ToolbarButton
			title='Widget'
			onClick={() => onClick('config.widget')}
			style={{color: currentQuery.widget_id === 'config.widget' ? 'blue' : '#555'}}
		/>
	</div>
})

export default WidgetEditorControls
