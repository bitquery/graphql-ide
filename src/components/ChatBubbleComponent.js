import { useEffect, useState } from 'react';
import ChatBubble from './ChatBubble';

const ChatBubbleComponent = ({ endpoint_url }) => {
    const [chatVersion, setChatVersion] = useState(null);

    useEffect(() => {
        if (endpoint_url === "https://graphql.bitquery.io") {
            setChatVersion("v1");
        } else {
            setChatVersion("v2");
        }
    }, [endpoint_url]);

    return (
        <>
            {chatVersion === "v1" && (
                <ChatBubble
                    key="v1"
                    iframeSrc="https://www.chatbase.co/chatbot-iframe/AyacAyaYZrLbucHlUUbZ5"
                    iframeId="chatbase-iframe-v1"
                />
            )}
            {chatVersion === "v2" && (
                <ChatBubble
                    key="v2"
                    iframeSrc="https://www.chatbase.co/chatbot-iframe/Vz0cwoEYRJW6n5B2JeSeu"
                    iframeId="chatbase-iframe-v2"
                />
            )}
        </>
    );
};

export default ChatBubbleComponent;