import React from 'react';
import {useContext, useEffect, useRef, useState} from "react";
import {AIChatContext} from "../context/AIChatContextProvider";
import Modal from "./Modal";

const WatsonSurvey = ({messages, setMessages, offSurvey}) => {
    const {executeHumanQuestion, addAIMessage} = useContext(AIChatContext);

    const [input, setInput] = useState('');
    const [waiting, setWaiting] = useState(false);
    const endOfMessages = useRef(null);

    const scrollToBottom = () => {
        endOfMessages.current.scrollIntoView({behavior: 'smooth'});
    }

    useEffect(scrollToBottom, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();

        if (input === '') return;

        const currentMessages = messages.concat({type: 'user', message: input});
        setMessages(currentMessages);
        setWaiting(true);

        const watsonPrompt = `
        Question type: Watson
        Question: ${input}`
        const aiMessage = await executeHumanQuestion(watsonPrompt);
        addAIMessage(aiMessage);
        setMessages(currentMessages.concat({type: 'watson', message: aiMessage}));
        setWaiting(false);
        setInput('');
    }

    return (
        <Modal offModal={offSurvey}>
            <div className="chat">
                <div className="chat-messages">
                    {messages.map((msg, index) => (
                        <div key={index}>
                            <p><strong>{msg.type}</strong>: {msg.message}</p>
                        </div>
                    ))}
                    <div ref={endOfMessages}></div>
                </div>
                <form className="chat-input" onSubmit={handleSend}>
                    <input value={input} onChange={e => setInput(e.target.value)} placeholder="Type a message"
                           disabled={waiting}/>
                    <button type="submit" disabled={waiting}>Send</button>
                </form>
            </div>
        </Modal>
    );
};

export default WatsonSurvey;