import React, { useState, useEffect } from 'react'
import { useFirstUpdate } from '../utils/useFirstUpdate'
import WidgetOptions from '../WidgetOptions'

function TableWidgetEditor({model, config, setConfig, displayedData}) {
	const xFunc = key => {if (model[key].typeInfo) {
		return true
	}}
	const yFunc = key => {if (model[key].typeInfo) {
		return (model[key].typeInfo.toString().includes('Int')
			||model[key].typeInfo.toString().includes('Float'))
			&&!model[key].typeInfo.toString().includes('Int!')
	}}
	const [xAxis, setXAxis] = useState('')
	const [yAxis, setYAxis] = useState('')
	const [sample, setSample] = useState('')
    const [columnsNumber, setColumnsNumber] = useState(config.length || 1)
    const [columns, setColumns] = useState([{
        /* field: 'field1',
        title: 'title1' */
    }])
	
	//set options if query has config, only on mount
	useEffect(() => {
		/* if (!xAxis && config) {
			if (Object.keys(config).length) {
				if ('encoding' in config) {
					if ('x' in config.encoding) {
						setXAxis(`${displayedData}.${config.encoding.x.field}`)
					}
					if ('y' in config.encoding) {
						setYAxis(`${displayedData}.${config.encoding.y.field}`)
					}
					if ('transform' in config) {
						setSample(config.transform[0].sample)
					}
				}
			}
		}  */
	}, [])
	//every time since first update when xAxis, yAxis or displayedData changed, set config
	useFirstUpdate(() => {
		// if (model && xAxis && yAxis && xAxis.includes(displayedData)) {
			/* let fieldX = xAxis.replace(`${displayedData}.`, '')
			let fieldY = yAxis.replace(`${displayedData}.`, '') */

			let cfg = {
				columns
			}
			setConfig(cfg)
		// }
	}, [JSON.stringify(columns), displayedData])
    const updateColumns = (value, i) => {
        console.log(value, i)
        let newColumns = [...columns]
        newColumns[i] = {field: value.replace(`${displayedData}.`, ''), title: value}
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
                        value={columns[i]?.field || ''}
                        setValue={updateColumns}
                        condition={xFunc}
                        title={i}
                        model={model}
                    />)}
				
			</div>
		</div>
	)
}

export default TableWidgetEditor