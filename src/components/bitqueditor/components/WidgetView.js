import React, { useEffect } from 'react'

function WidgetView({ el, config, dataSource, displayedData, children, renderFunc }) {
	useEffect(() => {
		if (dataSource && config && displayedData && dataSource.data) {
			typeof renderFunc === 'function' && Object.keys(config).length && renderFunc(dataSource, config, el)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [JSON.stringify(config), JSON.stringify(dataSource), displayedData, renderFunc])
	if (!dataSource || !displayedData) return (<div></div>)
	return (
		<>
			{children}
			<div className="table-striped" style={{'width': '100%', 'height': '100%', 'overflowY': 'hidden'}} id={el} />
		</>
	)
}

export default WidgetView
