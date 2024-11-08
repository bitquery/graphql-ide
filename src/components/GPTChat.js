import React, { useState, useEffect, useRef } from 'react';
import { Form, Spinner, InputGroup } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { FiSend, FiSave, FiTrash2 } from 'react-icons/fi';
import { RiFileTransferFill } from "react-icons/ri";
import 'codemirror/lib/codemirror.css';
import { Controlled as CodeMirror } from 'react-codemirror2';
import 'codemirror/addon/hint/show-hint';
import 'codemirror/addon/comment/comment';
import 'codemirror/addon/edit/matchbrackets';
import 'codemirror/addon/edit/closebrackets';
import 'codemirror/addon/fold/foldgutter';
import 'codemirror/addon/fold/brace-fold';
import 'codemirror/addon/search/search';
import 'codemirror/addon/search/searchcursor';
import 'codemirror/addon/search/jump-to-line';
import 'codemirror/addon/dialog/dialog';
import 'codemirror/addon/lint/lint';
import 'codemirror/keymap/sublime';
import 'codemirror-graphql/hint';
import 'codemirror-graphql/lint';
import 'codemirror-graphql/info';
import 'codemirror-graphql/jump';
import 'codemirror-graphql/mode';
import './gptChat.scss';
import { getGPTResponse } from "../api/api";

const GPTChat = ({ onSaveCode, initialQuery }) => {
    const [inputText, setInputText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'system', content: 'You are a helpful assistant. Use the following query as context: ' + initialQuery }
    ]);
    const chatEndRef = useRef(null);

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

    const handleSubmit = async () => {
        if (!inputText) {
            toast('Please enter a query for GPT', { type: 'error' });
            return;
        }

        const newMessages = [...messages, { role: 'user', content: inputText }];
        setIsLoading(true);

        try {
            const response = await getGPTResponse(newMessages);
            const assistantMessage = { role: 'assistant', content: response.data.content };
            setMessages([...newMessages, assistantMessage]);

            const codeMatches = assistantMessage.content.match(/```([\s\S]*?)```/);
            const codeContent = codeMatches ? codeMatches[1].trim() : null;

            if (codeContent) {
                onSaveCode(codeContent);
            }

            setInputText('');
        } catch (error) {
            console.error('Error fetching GPT response:', error);
            toast('Error fetching GPT response', { type: 'error' });
        }

        setIsLoading(false);
    };

    const saveQuery = () => {
        const lastAssistantMessage = messages.slice().reverse().find(message => message.role === 'assistant');

        if (!lastAssistantMessage || !lastAssistantMessage.content.includes('```')) {
            toast('No code to save', { type: 'warning' });
            return;
        }

        const codeMatches = lastAssistantMessage.content.match(/```([\s\S]*?)```/);
        const codeContent = codeMatches ? codeMatches[1].trim() : null;

        if (codeContent) {
            onSaveCode(codeContent);
            toast('Query saved', { type: 'success' });
        } else {
            toast('No code to save', { type: 'warning' });
        }
    };

    const renderMessageContent = (content) => {
        return content?.split('```').map((part, index) => {
            if (index % 2 === 1) {
                return (
                    <CodeMirror
                        key={index}
                        value={part}
                        options={{
                            mode: 'graphql',
                            theme: 'graphiql',
                            lineNumbers: true,
                            readOnly: true,
                            tabSize: 2,
                            autoCloseBrackets: true,
                            matchBrackets: true,
                            foldGutter: true,
                            keyMap: 'sublime',
                            gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
                        }}
                        onBeforeChange={() => {}}
                    />
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
                        <div>{renderMessageContent(message.content)}</div>
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
                        <div className="button-group">
                            <div
                                onClick={handleSubmit}
                                className={`bitquery-little-gptBtn send-button ${isLoading ? 'disabled' : ''}`}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true"/>
                                ) : (
                                    <FiSend/>
                                )}
                            </div>
                            <div className='bitquery-little-gptBtn' onClick={saveQuery}>
                                <RiFileTransferFill/>
                            </div>
                            <div className='bitquery-little-gptBtn' onClick={() => setMessages([])}>
                                <FiTrash2/>
                            </div>
                        </div>
                    </InputGroup>
                </Form.Group>
            </Form>
        </div>
    );
};

export default GPTChat;
