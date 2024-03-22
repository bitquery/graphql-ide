import React from 'react'
import Loader from 'react-loader-spinner'
import StopIcon from './icons/StopIcon'
import PlayIcon from './icons/PlayIcon'
import ErrorIcon from './icons/ErrorIcon'

export const InteractionButton = ({queryStatus, accordance}) => {
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
        return <div className='d-flex align-items-center justify-content-center flex-column'>
            <StopIcon/>
            <span className="execute-button__text">Stop query</span>
        </div>
    }
    if (queryStatus.readyToExecute) {

        return <div className='d-flex align-items-center justify-content-center flex-column'>
            <PlayIcon fill='#14ff41'/>
            <span className="execute-button__text">Run query</span>
        </div>
    }
    if (queryStatus.schemaError) {
        return <ErrorIcon fill={'#FF2D00'}/>
    }
}
