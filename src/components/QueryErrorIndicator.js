import React from 'react'

function QueryErrorIndicator({ error, removeError }) {
    if (!error) {
        return null;
    }

    const renderError = () => {
        if (error.includes('##TELEGRAM_LINK##')) {
            const message = error.split('##TELEGRAM_LINK##')[0];
            return (
                <>
                    {message}
                    <br />
                    <a href="https://t.me/Bitquery_sales" target="_blank" rel="noopener noreferrer">
                        Contact sales via Telegram - Bitquery.io (Bloxy) Network
                    </a>
                </>
            );
        }
        return error;
    };

    return error ?
        <>
            <div className="error__wrapper">
                <p className="error__message">
                    {renderError()}
                </p>

            </div>
            <div
                className="error__wrapper__close"
                onClick={() => removeError(null)}
            >
                <i className="fas fa-times" />
            </div>
        </> : null
}

export default QueryErrorIndicator
