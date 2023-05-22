import React from 'react'
import { observer } from 'mobx-react-lite'
import {TabsStore, QueriesStore} from '../../../store/queriesStore'
import { flattenData } from '../../flattenData'
import { getValueFrom } from '../../../utils/common'

const ResponseDataType = observer(function ResponseDataType({ setDataSource, dataSource }) {
	const { currentQuery, updateQuery } = QueriesStore
	const { index } = TabsStore
	const DATA_TYPES = ['response', 'flatten']
	const handleChange = (data_type) => {
		updateQuery({data_type}, index)
		dataSource.data
			&& setDataSource(prev => {
				return {...prev, displayed_data: data_type==='flatten' ? 'data' : prev.displayed_data, data_type, values: currentQuery.displayed_data === 'data' ? 
				data_type === 'flatten' ? flattenData(prev.data) : prev.data : getValueFrom(prev.data, currentQuery.displayed_data)}
			})
	}
	return (
		<>
			<div className="collapse navbar-collapse" id="navbarSupportedContent">
				<ul className={'navbar-nav mr-auto ' + (currentQuery.widget_id === 'tradingview.widget' && 'dropup')}>
					<li className="nav-item dropdown">
						<a 	className="nav-link dropdown-toggle dropdown-toggle-color" 
							href="# "
							id="navbarDropdown" 
							role="button" 
							data-toggle="dropdown" 
							aria-label="data type"
							aria-haspopup="true" 
							aria-expanded="false"
							style={{color: '#4f4f4f'}}
						>
							{ currentQuery.data_type || DATA_TYPES[0] }
						</a>
						<div className="dropdown-menu" aria-labelledby="navbarDropdown">
							{ DATA_TYPES.map((data_type, i) => 
								<a  className="dropdown-item"
									href="# " 
									key={i}
									onClick={()=>handleChange(data_type)}
								>
									{ data_type }
								</a>) }
						</div>
					</li>
				</ul>
			</div>
		</>
	)
})

export default ResponseDataType
