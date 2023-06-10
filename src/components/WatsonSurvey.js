import React from 'react';
import {useEffect, useRef, useState} from "react";
import Modal from "./Modal";

const WatsonSurvey = ({messages, setMessages, offSurvey, chat, count}) => {
    // const {executeHumanQuestion, addAIMessage} = useContext(AIChatContext);

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

        const watsonQuestion = `
        Command type: Watson
        Question: ${input}`
        const aiMessage = await chat(watsonQuestion);
        if (aiMessage == null) {
            setMessages(currentMessages.concat({type: "error", message: "AI Error"}));
        } else {
            setMessages(currentMessages.concat({type: "watson", message: aiMessage}));
        }
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
                    <p>Questions : {count}/15</p>
                    <input value={input} onChange={e => setInput(e.target.value)}
                           placeholder={count >= 15 ? "No more question" : "Type a interview question"}
                           disabled={waiting}/>
                    <button style={{backgroundColor: "#5f9ea0", color: "#ffffff"}} type="submit"
                            disabled={waiting || count >= 15}>Send
                    </button>
                </form>
            </div>
        </Modal>
    );
};

export default WatsonSurvey;