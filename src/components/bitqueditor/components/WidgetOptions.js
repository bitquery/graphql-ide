import React, { useEffect } from 'react'

function WidgetOptions({model, condition, value, setValue, title}) {
	useEffect(() => {
		if (model) {
			let list = Object.keys(model).filter(condition)
			if (!value) setValue(list[0])
		}
	}, [JSON.stringify(model)])
	return (
		<div className="widget-option"> 
			<label>{title}</label>
			<select className="custom-select" value={value} onChange={e=>setValue(e.target.value)}>
				{model 
					? Object.keys(model).map((node, i)=>condition(node)
						? <option key={i} value={node}>{node.split('.').slice(-1)}</option>
						: null
					) : null
				}
			</select>
		</div>
	)
}

export default WidgetOptions
