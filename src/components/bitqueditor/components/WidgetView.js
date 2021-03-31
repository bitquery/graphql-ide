import React, { useEffect } from 'react'

function WidgetView({ el, config, dataSource, displayedData, children, renderFunc }) {
	useEffect(() => {
		if (dataSource && config && displayedData && dataSource.data) {
			typeof renderFunc === 'function' && renderFunc(dataSource, config, el)
		}
	}, [JSON.stringify(config), JSON.stringify(dataSource), displayedData, renderFunc])
	if (!dataSource) return (<div></div>)
	return (
		<>
			{children}
			<div style={{'width': '100%', 'height': '100%', 'overflowY': 'hidden'}} id={el} />
		</>
	)
}

export default WidgetView
