import React from 'react'
import { v4 } from 'uuid'

function JsonWidget({el, dataSource}) {
	if (!dataSource) return (<div></div>)
	return (
		<div className="widget-display" id={el}>
			<pre style={{
				'alignSelf': 'flex-start',
				'width': '100%'
				}}
			>
				{dataSource && JSON.stringify(dataSource.data, null, 2)}
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
	supportsModel() {
		return true
	}
}

export default new JsonPlugin()
