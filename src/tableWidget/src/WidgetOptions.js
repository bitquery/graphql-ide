import React, { useEffect } from 'react'

function WidgetOptions({model, condition, value, setValue, title, displayedData, config, customTitle, columnLink, expression}) {
	let optionValue = ''
	useEffect(() => {
		if (model && !Object.keys(config).length) {
			let list = Object.keys(model).filter(condition)
			if (!value) setValue({value: list[0]}, title)
			else if (value !== optionValue) setValue({value}, title)
		}
	}, [JSON.stringify(model)])

	return (
		<div className="widget-option"> 
			<label>Column {title}</label>
			<select 
				className="custom-select mb-1" 
				value={value} 
				onChange={(e=>setValue({value: e.target.value}, title))}
				ref={select => optionValue = select?.value}
			>
				{Object.keys(model).length 
					? Object.keys(model).map((node, i)=>condition(node)
						? <option key={i} value={node.replace(`${displayedData}.`, '')}>{node.replace(`${displayedData}.`, '')}</option>
						: null
					) : <option value={value}>{value}</option>
						
				}
			</select>
			<input
				type="text" className="form-control mb-1"
				placeholder="Title"
				value={customTitle}
				onChange={e=>setValue({title: e.target.value}, title)}
			/>
			<input
				type="text" className="form-control mb-1"
				placeholder="Column link"
				value={columnLink}
				onChange={e=>setValue({link: e.target.value}, title)}
			/>
			<input
				type="text" className="form-control mb-1"
				placeholder="javascript"
				value={expression}
				onChange={e=>setValue({expression: e.target.value}, title)}
			/>
		</div>
	)
}

export default WidgetOptions
