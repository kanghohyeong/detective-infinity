import React from 'react';
import {useContext, useEffect, useRef, useState} from "react";
import {AIChatContext} from "../context/AIChatContextProvider";
import Modal from "./Modal";

const SuspectInterview = ({name, messages, setMessages, offInterview}) => {

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

        const interviewPrompt = `
        Question type: Interview 
        Interviewee: ${name} 
        Question: ${input}`;
        const aiMessage = await executeHumanQuestion(interviewPrompt);
        addAIMessage(aiMessage);
        setMessages(currentMessages.concat({type: name, message: aiMessage}));
        setWaiting(false);
        setInput('');
    }

    return (
        <Modal offModal={offInterview}>
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
                    <input value={input} onChange={e => setInput(e.target.value)}
                           placeholder="Type a interview question"
                           disabled={waiting}/>
                    <button style={{backgroundColor: "#2f4f4f", color: "#ffffff"}} type="submit"
                            disabled={waiting}>Send
                    </button>
                </form>
            </div>
        </Modal>
    );
};

export default SuspectInterview;