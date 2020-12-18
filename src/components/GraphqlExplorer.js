import React from 'react';
import '../App.scss';
import { TabsStore } from '../store/queriesStore';
import { observer } from 'mobx-react-lite'
import Gqlexpl from './Gqlexpl'
import './bitqueditor/App.scss'

export const GraphqlExplorer = observer(() => {
	const { tabs } = TabsStore
	return (
		tabs.map((tab, i) => (
			<Gqlexpl number={i} key={tab.id} />
		))
	)
})
