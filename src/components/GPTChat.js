import React, { useState, useEffect, useRef } from 'react';
import { Button, Form, Spinner, InputGroup } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { FiSend, FiSave, FiTrash2 } from 'react-icons/fi';
import './gptChat.scss';

const GPTChat = () => {
    const [inputText, setInputText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'system', content: 'You are a helpful assistant. use schemes from https://ide.bitquery.io/' }
    ]);
    const [savedQuery, setSavedQuery] = useState(null); // Для хранения последнего сохраненного кода

    const chatEndRef = useRef(null);

    useEffect(() => {
        const storedQuery = localStorage.getItem('savedQuery');
        if (storedQuery) setSavedQuery(storedQuery);
    }, []);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleInputChange = (e) => {
        setInputText(e.target.value);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    const handleClearChat = () => {
        setMessages([{ role: 'system', content: 'You are a helpful assistant.' }]);
        setInputText('');
    };

    const handleSubmit = async () => {
        if (!inputText) {
            toast('Please enter a query for GPT', { type: 'error' });
            return;
        }

        const newMessages = [...messages, { role: 'user', content: inputText }];
        setIsLoading(true);

        try {
            const response = await fetch('https://www.chatbase.co/api/v1/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer dc67ecc8-ff82-4bc4-833b-45006da0b135`
                },
                body: JSON.stringify({
                    chatbotId: "Vz0cwoEYRJW6n5B2JeSeu",
                    model: "gpt-4o",
                    messages: newMessages,
                })
            });

            const data = await response.json();
            const assistantMessage = { role: 'assistant', content: data.text };
            setMessages([...newMessages, assistantMessage]);
            setInputText('');
        } catch (error) {
            console.error('Error fetching GPT response:', error);
            toast('Error fetching GPT response', { type: 'error' });
        }

        setIsLoading(false);
    };

    const saveQuery = () => {
        // Находим последнее сообщение от ассистента
        const lastAssistantMessage = messages.slice().reverse().find(message => message.role === 'assistant');

        if (!lastAssistantMessage || !lastAssistantMessage.content.includes('```')) {
            toast('No code to save', { type: 'warning' });
            return;
        }

        // Извлекаем содержимое кода из текста с использованием регулярного выражения
        const codeMatches = lastAssistantMessage.content.match(/```([\s\S]*?)```/);
        const codeContent = codeMatches ? codeMatches[1].trim() : null;

        if (codeContent) {
            setSavedQuery(codeContent); // Сохраняем последний код
            localStorage.setItem('savedQuery', codeContent); // Сохраняем в localStorage
            toast('Code saved successfully', { type: 'success' });
        } else {
            toast('No code to save', { type: 'warning' });
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        toast('Copied to clipboard', { type: 'success' });
    };

    const renderMessageContent = (content) => {
        return content.split('```').map((part, index) => {
            if (index % 2 === 1) {
                return (
                    <pre key={index} className="code-block">
                        <code>{part}</code>
                    </pre>
                );
            } else {
                return <div key={index}>{part}</div>;
            }
        });
    };

    return (
        <div className="gpt-chat-container">
            <div className="chat-history">
                {messages.slice(1).map((message, index) => (
                    <div key={index} className={`gpt-response ${message.role === 'user' ? 'user-message' : 'assistant-message'}`}>
                        <strong>{message.role === 'user' ? 'You:' : 'GPT:'}</strong>
                        <p>{renderMessageContent(message.content)}</p>
                    </div>
                ))}
                <div ref={chatEndRef} />
            </div>
            <Form>
                <Form.Group>
                    <InputGroup>
                        <Form.Control
                            as="textarea"
                            rows={2}
                            placeholder="Type your question here"
                            value={inputText}
                            onChange={handleInputChange}
                            onKeyDown={handleKeyDown}
                            className="input-textarea"
                        />
                        <Button variant="primary" onClick={handleSubmit} disabled={isLoading} size="sm" className="send-button">
                            {isLoading ? (
                                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                            ) : (
                                <FiSend />
                            )}
                        </Button>
                    </InputGroup>
                </Form.Group>
                <div className="d-flex justify-content-between mt-2">
                    <Button variant="secondary" onClick={saveQuery} size="sm">
                        <FiSave /> Save Query
                    </Button>
                    <Button variant="danger" onClick={handleClearChat} size="sm">
                        <FiTrash2 /> Clear Chat
                    </Button>
                </div>
                {savedQuery && (
                    <div className="saved-query mt-3">
                        <h6>Saved Code</h6>
                        <pre>{savedQuery}</pre>
                        <Button
                            variant="outline-secondary"
                            size="sm"
                            onClick={() => copyToClipboard(savedQuery)}
                            className="copy-button"
                        >
                            Copy
                        </Button>
                    </div>
                )}
            </Form>
        </div>
    );
};

export default GPTChat;
