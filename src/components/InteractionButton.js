import React from 'react'
import Loader from 'react-loader-spinner'
import StopIcon from './icons/StopIcon'
import PlayIcon from './icons/PlayIcon'
import ErrorIcon from './icons/ErrorIcon'

export const InteractionButton = ({ queryStatus, accordance }) => {
	if (queryStatus.schemaLoading) {
		return <Loader
			className="view-loader"
			type="Oval"
			color="#3d77b6"
			height={25}
			width={25}
		/>
	}
	if (queryStatus.activeFetch || queryStatus.activeSubscription) {
		return <StopIcon />
	}
	if (queryStatus.readyToExecute) {
		return <PlayIcon fill={accordance ? '#eee' : '#14ff41'} />
	}
	if (queryStatus.schemaError) {
		return <ErrorIcon fill={'#FF2D00'} />
	}
}
