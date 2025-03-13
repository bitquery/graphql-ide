import React from 'react'
import { observer } from 'mobx-react-lite'
import { TabsStore, QueriesStore } from '../../../store/queriesStore'
import { flattenData } from '../../flattenData'
import { getValueFrom } from '../../../utils/common'
import Dropdown from 'react-bootstrap/Dropdown'

const ResponseDataType = observer(function ResponseDataType({ setDataSource, dataSource }) {
	const { currentQuery, updateQuery } = QueriesStore
	const { index } = TabsStore
	const DATA_TYPES = ['response', 'flatten']

	const handleChange = (data_type) => {
		updateQuery({ data_type }, index)
		if (dataSource.data) {
			setDataSource(prev => ({
				...prev,
				displayed_data: data_type === 'flatten' ? 'data' : prev.displayed_data,
				data_type,
				values: currentQuery.displayed_data === 'data'
					? data_type === 'flatten'
						? flattenData(prev.data)
						: prev.data
					: getValueFrom(prev.data, currentQuery.displayed_data)
			}))
		}
	}

	return (
		<Dropdown>
			<Dropdown.Toggle variant="light" id="dropdown-data-type">
				{currentQuery.data_type || DATA_TYPES[0]}
			</Dropdown.Toggle>
			<Dropdown.Menu>
				{DATA_TYPES.map((data_type, i) => (
					<Dropdown.Item key={i} onClick={() => handleChange(data_type)}>
						{data_type}
					</Dropdown.Item>
				))}
			</Dropdown.Menu>
		</Dropdown>
	)
})

export default ResponseDataType
