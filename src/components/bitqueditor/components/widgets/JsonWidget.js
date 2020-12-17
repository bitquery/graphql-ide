import React from 'react'
import { v4 } from 'uuid'

function JsonWidget({dataSource}) {
	return (
		<div className="widget-display">
			<pre style={{
				'alignSelf': 'flex-start',
				'width': '100%'
				}}
			>
				{JSON.stringify(dataSource.data, null, 2)}
			</pre>
		</div>
	)
}

class JsonPlugin {
	constructor() {
		this.id = v4()
		this.name = 'JSON'
		this.editor = () => (<div className="widget"/>)
		this.renderer = JsonWidget
	}
	supportsModel() {
		return true
	}
}

export default new JsonPlugin()
