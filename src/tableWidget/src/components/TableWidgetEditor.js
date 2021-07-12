import React, { useState, useEffect } from 'react'
import { useFirstUpdate } from '../utils/useFirstUpdate'
import WidgetOptions from '../WidgetOptions'

function TableWidgetEditor({model, config, setConfig, displayedData}) {
	const condition = key => {if (model[key].typeInfo) { 
		return true
	}}
    const [columnsNumber, setColumnsNumber] = useState(1)
    const [columns, setColumns] = useState([])
	let ignore = false
	
	//set options if query has config, only on mount
	useEffect(() => {
		if (config && config.columns && config.columns.length) {
			setColumns(config.columns)
			setColumnsNumber(config.columns.length)
		}
	}, [])
	useEffect(() => {
		if (!ignore) {
			if (config && config.columns && config.columns.length) {
				setColumns(config.columns)
				setColumnsNumber(config.columns.length)
				setConfig(config)
			}
		}
	}, [JSON.stringify(config)])

    const updateColumns = (value, i) => {
		console.log('why update')
		ignore = true
        let newColumns = [...columns]
        newColumns[i-1] = {field: value.replace(`${displayedData}.`, ''), title: value}
        setColumns(newColumns)
		setConfig({columns: newColumns})
		ignore = false
    }
	
	return (
		<div className="widget">
			<div className="widget-editor">
            <div className="widget-option"> 
                <label>Number of columns</label>
                <select 
                    className="custom-select" 
                    value={columnsNumber} 
                    onChange={e=>setColumnsNumber(+e.target.value)}
                >
                    {[...Array(10).keys()].map(i => i+1).map(number => <option key={number} value={number}> {number} </option>)}
                </select>
            </div>
                {[...Array(columnsNumber).keys()].map(i => i+1).map(i => 
                    <WidgetOptions 
                        key={i}
                        value={columns[i-1]?.title || ''}
                        setValue={updateColumns}
                        condition={condition}
                        title={i}
                        model={model}
                    />)}
				
			</div>
		</div>
	)
}

export default TableWidgetEditor