import React from 'react'

function QueryErrorIndicator({ error, removeError }) {
    if (!error) {
        return null;
    }

    const renderError = () => {
        const errorText = typeof error === 'string'
            ? error
            : (error && typeof error.message === 'string')
                ? error.message
                : String(error);

        const linkify = (text) => {
            const parts = text.split(/(https?:\/\/[^\s)"']+)/g);
            return parts.map((part, i) => {
                const isLink = /^https?:\/\//.test(part);
                return isLink
                    ? <a key={i} style={{ color: '#3f1f8a' }} href={part} target="_blank" rel="noreferrer">{part}</a>
                    : part;
            });
        };

        if (errorText.includes('##TELEGRAM_LINK##')) {
            const message = errorText.split('##TELEGRAM_LINK##')[0];
            return (
                <>
                    {message}
                    <br /> Contact us on Telegram: 
                    <a style={{ color: '#3f1f8a' }} href="https://t.me/Bloxy_info" target="_blank"> Bitquery.io (Bloxy) Network</a> or email us at
                    <a style={{ color: '#3f1f8a' }} href="mailto:sales@bitquery.io"> sales@bitquery.io</a>
                </>
            );
        }
        return <>{linkify(errorText)}</>;
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
