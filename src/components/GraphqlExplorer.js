import React, { useMemo } from 'react';
import '../App.scss';
import { TabsStore, QueriesStore } from '../store/queriesStore';
import { observer } from 'mobx-react-lite'
import EditorInstance from './EditorInstance'
import DashBoard from './DashBoard'
import DashboardReact from './DashboardReact'
import './bitqueditor/App.scss'
/* import { vegaPlugins } from 'vega-widgets'
import { graphPlugins } from '@bitquery/ide-graph'
import { timeChartPlugins } from '@bitquery/ide-charts' */
import JsonPlugin from '../components/bitqueditor/components/JsonWidget'

export const GraphqlExplorer = observer(() => {
	const { tabs, currentTab } = TabsStore
	const { dashboardView, currentQuery } = QueriesStore
	// const plugins = useMemo(()=> [JsonPlugin, ...vegaPlugins, ...graphPlugins, ...timeChartPlugins], [])
	return (
		tabs.map((tab, i) => (
			
			<EditorInstance number={i} key={tab.id} /> 
		)))
})
