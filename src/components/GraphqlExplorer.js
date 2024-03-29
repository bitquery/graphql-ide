import React from 'react';
import '../App.scss';
import { TabsStore } from '../store/queriesStore';
import { observer } from 'mobx-react-lite'
import EditorInstance from './EditorInstance'
import './bitqueditor/App.scss'

export const GraphqlExplorer = observer(() => {
	const { tabs } = TabsStore
	return (
		tabs.map((tab, i) => (
			
			<EditorInstance number={i} key={tab.id} /> 
		)))
})
