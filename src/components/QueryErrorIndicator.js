import React from 'react'

function QueryErrorIndicator({error, removeError}) {
    return error ?
        <>
            <div className="error__wrapper">
                <p className="error__message">
                    {error}
                </p>
                
            </div>
            <div 
                className="error__wrapper__close"
                onClick={() => removeError(null)}
            >
                <i className="fas fa-times"/>
            </div>
        </> : null
}

export default QueryErrorIndicator
