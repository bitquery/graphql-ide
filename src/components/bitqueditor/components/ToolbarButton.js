import React from 'react'
import { observer } from 'mobx-react'

const ToolbarButton = observer(function ToolbarButton({ visible, onClick, disabled, title, ...props }) {
	return visible && (
		<button
			className="topBar__button"
			onClick={onClick}
			disabled={disabled}
			{...props}
		>
			{ title }
		</button>
	)
})

export default ToolbarButton