import { observer } from 'mobx-react-lite'
import React from 'react'
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"
import { QueriesStore, TabsStore } from '../../../store/queriesStore'


const WidgetSelect = observer(function WidgetSelect({dataWidgets, dataIndexInModel, plugins, name}) {
	const { updateQuery, currentQuery } = QueriesStore
	const { index } = TabsStore
	return (
		<>
			<a className="navbar-brand" href="# ">Using</a>
			<div className="collapse navbar-collapse" id="navbarSupportedContent">
				<ul className={'navbar-nav mr-auto ' + (currentQuery.widget_id === 'tradingview.widget' && 'dropup')}>
					<li className="nav-item dropdown">
						<a 	className="nav-link dropdown-toggle dropdown-toggle-color" 
							href="# "
							id="navbarDropdown" 
							role="button" 
							data-toggle="dropdown" 
							aria-haspopup="true" 
							aria-expanded="false"
						>
							{currentQuery.widget_id ? name : 'Widgets'}
						</a>
						<div className="dropdown-menu" aria-labelledby="navbarDropdown">
							{ dataWidgets && dataWidgets.length && 
							(dataIndexInModel || dataIndexInModel===0) && dataWidgets[dataIndexInModel]
								? dataWidgets[dataIndexInModel].map((widget, i) => widget
									?	<a className="dropdown-item" 
											onClick={()=>updateQuery({widget_id: plugins[i] && plugins[i].id}, index)}
											href="# " 
											key={i} 
										>
											{plugins[i].name}
										</a >
									: null
								) : null
							}
						</div>
					</li>
				</ul>
			</div>
		</>
	)
})

export default WidgetSelect
