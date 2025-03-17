import React from 'react'
import { observer } from 'mobx-react'

const ToolbarButton = observer(function ToolbarButton({ visible = true, onClick, disabled = false, title, ...props }) {
	return visible && (
		<button
			type="button"
			className="topBar__button bitquery-btn"
			onClick={onClick}
			disabled={disabled}
			{...props}
		>
			{ title }
		</button>
	)
})

export default ToolbarButton