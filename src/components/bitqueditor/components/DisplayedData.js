import { observer } from 'mobx-react-lite'
import React, { useEffect } from 'react'
import { QueriesStore, TabsStore } from '../../../store/queriesStore'
import { getValueFrom } from '../../../utils/common'

const DisplayedData = observer(function DisplayedData({model, dataWidgets, setDataIndexInModel, dataSource, setDataSource}) {
	const { updateQuery, currentQuery } = QueriesStore
	const { index } = TabsStore
	const onChangeHandle = (value, i) => {
		updateQuery({displayed_data: value}, index)
		dataSource.data
			&& setDataSource(prev => {
				return {...prev, values: getValueFrom(prev.data, value)}
			})
	}
	useEffect(() => {
		let dataIndex = Object.keys(model).indexOf(currentQuery.displayed_data)
		dataIndex !== -1 && setDataIndexInModel(dataIndex)
	}, [currentQuery.displayed_data, JSON.stringify(model)])
	return (
		<li className="nav-item dropdown">
			<a 	className="nav-link dropdown-toggle" 
				id="navbarDropdown" 
				role="button" 
				data-toggle="dropdown" 
				aria-haspopup="true" 
				aria-expanded="false"
			>
				{currentQuery.displayed_data ? currentQuery.displayed_data : 'Displayed Data'}
			</a>
			<div className="dropdown-menu" aria-labelledby="navbarDropdown">
				{dataWidgets && dataWidgets.length 
					? 	dataWidgets.map((node, i) => 
							node.some(widget => widget)
						? 	<a className="dropdown-item"
							href="# " 
							key={i} 
							onClick={()=>onChangeHandle(Object.keys(model)[i], i)}
							>
								{Object.keys(model)[i]}
							</a>
						: 	null
					) : currentQuery.displayed_data 
						? 	<a 
							className="dropdown-item" 
							href="# " 
							onClick={()=>onChangeHandle(currentQuery.displayed_data)}
							>
								{currentQuery.displayed_data.split('.').slice(-1)}
							</a>
						: 	null
					}
			</div>
		</li>
	)
})

export default DisplayedData
