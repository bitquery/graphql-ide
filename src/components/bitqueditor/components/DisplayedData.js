import { observer } from 'mobx-react-lite'
import React, { useEffect } from 'react'
import { QueriesStore, TabsStore } from '../../../store/queriesStore'
import { getValueFrom } from '../../../utils/common'
import { useFirstUpdate } from '../../../utils/useFirstUpdate'

const DisplayedData = observer(function DisplayedData({model, dataWidgets, setDataIndexInModel, dataSource, setDataSource, plugins, number}) {
	const { updateQuery, currentQuery, defaultWidget } = QueriesStore
	const { index } = TabsStore
	const onChangeHandle = (value, i) => {
		updateQuery({displayed_data: value}, index)
		let currentNodeNumber = Object.keys(model).indexOf(value)
		let currentWidgetNubmer = plugins.map(plugin => plugin.id).indexOf(currentQuery.widget_id)
		let availableWidgetNumbers = dataWidgets[currentNodeNumber].map(
			(availableWidget, i) => availableWidget && i
		).filter(number => number || number===0)
		!availableWidgetNumbers.includes(currentWidgetNubmer) 
			&& updateQuery({widget_id: plugins[availableWidgetNumbers[0]].id}, index)
		dataSource.data
			&& setDataSource(prev => {
				let values = null
				if (value === 'data') {
					values = prev.data
					if (prev.extensions) {
						values.extensions = prev.extensions
					}
				} else {
					values = getValueFrom(prev.data, value)
				}
				return {...prev, displayed_data: value, values}
			})
	}
	useEffect(() => {
		if (number === index) {
			let dataIndex = Object.keys(model).indexOf(currentQuery.displayed_data)
			dataIndex !== -1 && setDataIndexInModel(dataIndex)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentQuery.displayed_data, JSON.stringify(model)])
	useEffect(() => {
		if (!currentQuery.displayed_data && Object.keys(model).length && number===index) {
			!Object.keys(model)[Object.keys(model).length-1].includes('.') &&
			updateQuery({
				displayed_data: Object.keys(model)[Object.keys(model).length-1],
				widget_id: defaultWidget,
				saved: currentQuery.id && true
			}, index)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [JSON.stringify(model)])
	useFirstUpdate(() => {
		if (!Object.keys(model).length && currentQuery.displayed_data && number===index) {
			updateQuery({widget_id: '', displayed_data: ''}, index)
		}
	}, [JSON.stringify(model)])

	return (
		<>
			<a className="navbar-brand" href="# ">Display</a>
			<div className="collapse navbar-collapse" id="navbarSupportedContent">
				<ul className={'navbar-nav mr-auto ' + (currentQuery.widget_id === 'tradingview.widget' && 'dropup')}>
					<li className="nav-item dropdown">
						<a 	className="nav-link dropdown-toggle" 
							href="# "
							id="navbarDropdown" 
							role="button" 
							data-toggle="dropdown" 
							aria-haspopup="true" 
							aria-expanded="false"
						>
							{currentQuery.displayed_data ? currentQuery.displayed_data 
								: 'Displayed Data'
							}
						</a>
						<div className="dropdown-menu" aria-labelledby="navbarDropdown">
							{dataWidgets && dataWidgets.length 
								? 	dataWidgets.map((node, i) => 
										node.some(widget => widget)
									? 	<a  className="dropdown-item"
											href="# " 
											key={i} 
											onClick={()=>onChangeHandle(Object.keys(model)[i], i)}
										>
											{Object.keys(model)[i]}
										</a>
									: 	null
								) : currentQuery.displayed_data 
									? 	<a  className="dropdown-item" 
											href="# " 
											onClick={()=>onChangeHandle(currentQuery.displayed_data)}
										>
											{currentQuery.displayed_data}
										</a>
									: 	null
								}
						</div>
					</li>
				</ul>
			</div>
		</>
	)
})

export default DisplayedData
