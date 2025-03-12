import { useEffect, useState } from 'react';

const ChatBubble = ({ iframeSrc, iframeId }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [showTooltip, setShowTooltip] = useState(true);
    //
    // useEffect(() => {
    //     const timer = setTimeout(() => {
    //         setShowTooltip(false);
    //     }, 150000);
    //
    //     return () => clearTimeout(timer);
    // }, []);

    const toggleChat = () => {
        setIsOpen((prevState) => !prevState);
        setShowTooltip(false);
    };

    return (
        <div className="chat-bubble-container">
            {showTooltip && (
                <div className="chat-tooltip gradient-border">
                    <span>✨ Need a quick GraphQL query? Let our AI help!</span>
                </div>
            )}

            {isOpen && (
                <iframe
                    src={iframeSrc}
                    id={iframeId}
                    className="chat-bubble-iframe"
                />
            )}

            <button
                onClick={toggleChat}
                className="chat-bubble-button"
            >
                {isOpen ? (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="2.3"
                        stroke="white"
                        className="chat-bubble-close-icon"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                        ></path>
                    </svg>
                ) : (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 1120 1120"
                        className="chat-bubble-icon"
                    >
                        <title>Chatbase chatbot bubble icon</title>
                        <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            fill="white"
                            d="M252 434c0-62 50-112 112-112h406c62 0 112 50 112 112v180l-77-28-5-5-37-100c-2-7-12-7-14 0l-37 100-5 5-100 37c-7 2-7 12 0 14l100 37 5 5 28 77H630l-1 1-51 68c-5 8-17 8-22 0l-51-68-1-1H364c-62 0-112-50-112-112V434Zm382 37c-2-3-6-3-8 0l-7 20-2 2-20 7c-3 2-3 6 0 8l20 7 2 2 7 20c2 3 6 3 8 0l7-20 2-2 20-7c3-2 3-6 0-8l-20-7-2-2-7-20Z"
                        ></path>
                        <path
                            fill="white"
                            d="M772 756c60-1 109-50 110-110l-77 28-5 5-28 77Z"
                        ></path>
                    </svg>
                )}
            </button>
        </div>
    );
};

export default ChatBubble;