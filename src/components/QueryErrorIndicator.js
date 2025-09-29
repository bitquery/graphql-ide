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
                    <br /> Contact us on Telegram: 
                    <a style={{ color: '#3f1f8a' }} href="https://t.me/Bloxy_info" target="_blank"> Bitquery.io (Bloxy) Network</a> or email us at
                    <a style={{ color: '#3f1f8a' }} href="mailto:sales@bitquery.io"> sales@bitquery.io</a>
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
