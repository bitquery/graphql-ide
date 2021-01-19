import React, { useState, useEffect } from 'react'

function JsonWidget({el, dataSource}) {
	const [data, setData] = useState('')
	useEffect(() => {
		if (Object.keys(dataSource).length) {
			if (dataSource.data) {
				setData(JSON.stringify(dataSource.data, null, 2))
			} else {
				setData(JSON.stringify(dataSource.error, null, 2))
			}
			if (dataSource.data && dataSource.error) {
				setData(`${JSON.stringify(dataSource.data, null, 2)},
"errors": ${JSON.stringify(dataSource.error, null, 2)}`)
			}
		}
	}, [JSON.stringify(dataSource)])
	if (!dataSource) return (<div></div>)
	return (
		<div className="widget-display" id={el}>
			<pre style={{
				'alignSelf': 'flex-start',
				'width': '100%',
				'whiteSpace': 'pre-wrap'
				}}
			>
				{data}
			</pre>
		</div>
	)
}

class JsonPlugin {
	constructor() {
		this.id = 'json.widget'
		this.name = 'JSON'
		this.editor = () => (<div className="widget"/>)
		this.renderer = JsonWidget
	}
	supportsModel(model) {
		for (let key in model) {
			return !key.includes('.')
		}
	}
}

export default new JsonPlugin()
