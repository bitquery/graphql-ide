import React from 'react'

function QueryErrorIndicator({error, removeError}) {
    return error ?
        <>
            <div className="error__wrapper">
                <p className="error__message">
                    {JSON.stringify(error, null, 2)}
                </p>
                
            </div>
            <div 
                className="error__wrapper__close"
                onClick={() => removeError(prev => {return {...prev, error: null}})}
            >
                <i className="fas fa-times"/>
            </div>
        </> : null
}

export default QueryErrorIndicator
