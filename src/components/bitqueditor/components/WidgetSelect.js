import { observer } from 'mobx-react-lite'
import React from 'react'
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"
import { QueriesStore, TabsStore } from '../../../store/queriesStore'
import Dropdown from 'react-bootstrap/Dropdown'

const WidgetSelect = observer(function WidgetSelect({ dataWidgets, dataIndexInModel, plugins, name }) {
	const { updateQuery, currentQuery } = QueriesStore
	const { index } = TabsStore

	return (
		<>
			<a className="navbar-brand" href="#">Using</a>
			<div className="collapse navbar-collapse" id="navbarSupportedContent">
				<Dropdown drop={currentQuery.widget_id === 'tradingview.widget' ? "up" : "down"}>
					<Dropdown.Toggle variant="light" id="dropdown-widget-select">
						{currentQuery.widget_id ? name : 'Widgets'}
					</Dropdown.Toggle>
					<Dropdown.Menu>
						{dataWidgets && dataWidgets.length &&
						(dataIndexInModel || dataIndexInModel === 0) &&
						dataWidgets[dataIndexInModel]
							? dataWidgets[dataIndexInModel].map((widget, i) =>
								widget ? (
									<Dropdown.Item
										key={i}
										onClick={() => updateQuery({ widget_id: plugins[i] && plugins[i].id }, index)}
									>
										{plugins[i].name}
									</Dropdown.Item>
								) : null
							)
							: null}
					</Dropdown.Menu>
				</Dropdown>
			</div>
		</>
	)
})

export default WidgetSelect
