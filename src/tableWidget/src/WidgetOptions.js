import React, { useEffect } from 'react'

function WidgetOptions({model, condition, value, setValue, title, displayedData, config}) {
	let optionValue = ''
	useEffect(() => {
		if (model && !Object.keys(config).length) {
			let list = Object.keys(model).filter(condition)
			if (!value) setValue(list[0], title)
			else if (value !== optionValue) setValue(value, title)
		}
	}, [JSON.stringify(model)])

	return (
		<div className="widget-option"> 
			<label>Column {title}</label>
			<select 
				className="custom-select" 
				value={value} 
				onChange={(e=>setValue(e.target.value, title))}
				ref={select => optionValue = select?.value}
			>
				{Object.keys(model).length 
					? Object.keys(model).map((node, i)=>condition(node)
						? <option key={i} value={node.replace(`${displayedData}.`, '')}>{node.replace(`${displayedData}.`, '')}</option>
						: null
					) : <option value={value}>{value}</option>
						
				}
			</select>
		</div>
	)
}

export default WidgetOptions
