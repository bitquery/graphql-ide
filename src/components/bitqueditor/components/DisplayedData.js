import React, { useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { QueriesStore, TabsStore, UserStore } from '../../../store/queriesStore'
import { getValueFrom } from '../../../utils/common'
import { useFirstUpdate } from '../../../utils/useFirstUpdate'
import Dropdown from 'react-bootstrap/Dropdown'

const DisplayedData = observer(function DisplayedData({ model, dataWidgets, setDataIndexInModel, dataSource, setDataSource, plugins, number }) {
	const { updateQuery, currentQuery, defaultWidget } = QueriesStore
	const { index } = TabsStore
	const { user } = UserStore

	const onChangeHandle = (value, i) => {
		updateQuery({ displayed_data: value, saved: false }, index)
		let currentNodeNumber = Object.keys(model).indexOf(value)
		let currentWidgetNumber = plugins.map(plugin => plugin.id).indexOf(currentQuery.widget_id)
		let availableWidgetNumbers = dataWidgets[currentNodeNumber]
			.map((availableWidget, i) => availableWidget && i)
			.filter(number => number === 0 || number)
		if (!availableWidgetNumbers.includes(currentWidgetNumber)) {
			updateQuery({ widget_id: plugins[availableWidgetNumbers[0]].id }, index)
		}
		if (dataSource.data) {
			setDataSource(prev => {
				let values = null
				if (value === 'data') {
					values = prev.data
					if (prev.extensions) {
						values.extensions = prev.extensions
					}
				} else {
					values = getValueFrom(prev.data, currentQuery.displayed_data)
				}
				return { ...prev, displayed_data: value, values }
			})
		}
	}

	useEffect(() => {
		if (number === index) {
			let dataIndex = Object.keys(model).indexOf(currentQuery.displayed_data)
			dataIndex !== -1 && setDataIndexInModel(dataIndex)
		}
		// eslint-disable-next-line
	}, [currentQuery.displayed_data, JSON.stringify(model)])

	useEffect(() => {
		if (!currentQuery.displayed_data && Object.keys(model).length && number === index) {
			if (!Object.keys(model)[Object.keys(model).length - 1].includes('.')) {
				updateQuery({
					displayed_data: Object.keys(model)[Object.keys(model).length - 1],
					widget_id: defaultWidget,
					saved: false
				}, index)
			}
		}
		// eslint-disable-next-line
	}, [JSON.stringify(model)])

	useFirstUpdate(() => {
		if (!Object.keys(model).length && currentQuery.displayed_data && number === index) {
			updateQuery({ widget_id: '', displayed_data: '' }, index)
		}
	}, [JSON.stringify(model)])

	return (
		<>
			<a className="navbar-brand" href="#">Display</a>
			<Dropdown drop={currentQuery.widget_id === 'tradingview.widget' ? "up" : "down"}>
				<Dropdown.Toggle variant="light" id="dropdown-displayed-data">
					{currentQuery.displayed_data ? currentQuery.displayed_data : 'Displayed Data'}
				</Dropdown.Toggle>
				<Dropdown.Menu>
					{dataWidgets && dataWidgets.length
						? dataWidgets.map((node, i) =>
							node.some(widget => widget) ? (
								<Dropdown.Item key={i} onClick={() => onChangeHandle(Object.keys(model)[i], i)}>
									{Object.keys(model)[i]}
								</Dropdown.Item>
							) : null
						)
						: currentQuery.displayed_data ? (
							<Dropdown.Item onClick={() => onChangeHandle(currentQuery.displayed_data)}>
								{currentQuery.displayed_data}
							</Dropdown.Item>
						) : null}
				</Dropdown.Menu>
			</Dropdown>
		</>
	)
})

export default DisplayedData
