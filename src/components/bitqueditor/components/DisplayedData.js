import { observer } from 'mobx-react-lite'
import React from 'react'
import { QueriesStore, TabsStore } from '../../../store/queriesStore'

const DisplayedData = observer(function DisplayedData({model, value}) {
	const { updateQuery, currentQuery } = QueriesStore
	const { index } = TabsStore
	const dataFunc = node => (model[node][0]==='[' && node.slice(-2, -1)!=='0') 

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
				{Object.keys(model).length 
					? Object.keys(model).map((node, i)=>dataFunc(node)
						? 	<a className="dropdown-item"
							href="# " 
							key={i} 
							onClick={()=>updateQuery({displayed_data: node}, index)}
							>
								{node}
							</a>
						: 	null
					) : value 
						? 	<a 
							className="dropdown-item" 
							href="# " 
							onClick={()=>updateQuery({displayed_data: value}, index)}
							>
								{value.split('.').slice(-1)}
							</a>
						: 	null
					}
			</div>
		</li>
	)
})

export default DisplayedData
