import React from 'react'

function ToolbarComponent() {
	return (
		<div className="bitqueditor__toolbar">
			<input 
				className="endpointURL"
				type="text" 
				// value={query[i].endpoint_url} 
				value={'query[i].endpoint_url'} 
				// onChange={e=>handleInputURLChange(i, e)} 
			/>
		</div>
	)
}

export default ToolbarComponent
