import React, { useState, useEffect } from 'react'
import { useFirstUpdate } from '../utils/useFirstUpdate'
import WidgetOptions from '../WidgetOptions'

function TableWidgetEditor({model, config, setConfig, displayedData}) {
	const condition = key => /* {if (model[key].typeInfo) { 
		return true
	}} */
	true
    const [columnsNumber, setColumnsNumber] = useState(1)
    const [columns, setColumns] = useState([])
	
	//set options if query has config, only on mount
	useEffect(() => {
		console.log(model)
		if (!columns.length && config) {
			if (Object.keys(config).length) {
				if ('columns' in config) {
					setColumns(config.columns)
					setColumnsNumber(config.columns.length)
					setConfig({columns: config.columns})
				}
			}
		}
	}, [])
	//every time since first update when options changed, set config
	useFirstUpdate(() => {
			let cfg = {
				columns
			}
			setConfig(cfg)
			
	}, [JSON.stringify(columns), displayedData])

    const updateColumns = (value, i) => {
        console.log(value, i)
        let newColumns = [...columns]
        newColumns[i-1] = {field: value.replace(`${displayedData}.`, ''), title: value}
		console.log(newColumns, value, i)
        setColumns(newColumns)
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
                        value={columns[i-1]?.field || ''}
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