import React, { useState, useEffect } from 'react'
import WidgetOptions from '../WidgetOptions'
import { formatter } from '../utils/formatter'
import { useFirstUpdate } from '../../../utils/useFirstUpdate'

function TableWidgetEditor({model, config, setConfig, displayedData}) {
	const condition = key => {if (model[key].typeInfo) { 
		return (
			model[key].typeInfo.toString()[0]==='[' || 
			model[key].typeInfo.toString()==='Date' || 
			!key.includes('.')
		) ? false : true
	}}
    const [columnsNumber, setColumnsNumber] = useState(1)
    const [columns, setColumns] = useState([])
	
	//set options if query has config, only on mount
	useEffect(() => {
		if (config && config.columns && config.columns.length) {
			setColumns(config.columns)
			setColumnsNumber(config.columns.length)
		}
	}, [])
	useFirstUpdate(() => {
		setColumns(config.columns)
		setColumnsNumber(config.columns.length)
	}, [JSON.stringify(config)])
	
	const removeColumn = number => {
		setColumnsNumber(prev => prev - 1)
		const updColumns = [...columns]
		updColumns.splice(number-1, 1)
		setColumns(updColumns)
		setConfig({columns: updColumns})
	}
	const updateColumnsNumber = value => {
		setColumnsNumber(value)
		const defColumn = {field: columns[0].field, title: columns[0].title}
		const newColumnsNumber = value - columns.length
		const additionalColumns = Array(newColumnsNumber).fill({...defColumn})
		setColumns(prev => {return [...prev, ...additionalColumns]})
		setConfig({columns: [...columns, ...additionalColumns]})
	}
    const updateColumns = ({value, title, link, expression}, i) => {
		let newColumns = [...columns]
		let formatterParams = null
		if (value) {
			newColumns[i-1] = {field: value.replace(`${displayedData}.`, ''), 
				title: title || value.replace(`${displayedData}.`, '')}
		} else if (title || title === '') {
			newColumns[i-1].title = title
		}
		if (newColumns[i-1]) {
			if (link || link === '') {
				newColumns[i-1].formatterParams = newColumns[i-1].formatterParams 
				? {
					...newColumns[i-1].formatterParams,
					url: link,
					target:"_blank",
				} : {
					url: link,
					target:"_blank"
				}
			}
			if (expression || expression === '') {
				newColumns[i-1].formatterParams = newColumns[i-1].formatterParams 
					? {...newColumns[i-1].formatterParams, expression}
					: { expression }
			}
			newColumns[i-1].formatter = formatterParams && formatter
		}
		if ((typeof link==='string' && !link) || (typeof expression==='string' && !expression)) newColumns[i-1].formatter = null 
		setColumns(newColumns)
		setConfig({columns: newColumns})
    }
	
	return (
		<div className="widget">
			<div className="table-widget-editor">
				{[...Array(columnsNumber).keys()].map(i => i+1).map(i => 
					<WidgetOptions 
						key={i}
						config={config}
						displayedData={displayedData}
						value={columns[i-1]?.field || ''}
						setValue={updateColumns}
						removeColumn={removeColumn}
						condition={condition}
						title={i}
						customTitle={columns[i-1]?.title}
						columnLink={columns[i-1]?.formatterParams?.url}
						expression={columns[i-1]?.formatterParams?.expression}
						model={model}
				/>)}
				<button className="columns_number" onClick={() => updateColumnsNumber(columnsNumber + 1)}>
					<i className="tab__add fas fa-plus"/>
				</button>
			</div>
		</div>
	)
}

export default TableWidgetEditor