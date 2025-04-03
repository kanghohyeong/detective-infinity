import React from 'react';
import {useEffect, useRef, useState} from "react";
import Modal from "./Modal";
import styles from '../styles/components/SuspectInterview.module.css';

const SuspectInterview = ({name, messages, setMessages, offInterview, chat, count}) => {
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

        const interviewQuestion = `
        Interviewee: ${name} 
        Question: ${input}`;
        const aiMessage = await chat(interviewQuestion);
        if (aiMessage == null) {
            setMessages(currentMessages.concat({type: "error", message: "AI Error"}));
        } else {
            setMessages(currentMessages.concat({type: name, message: aiMessage}));
        }
        setWaiting(false);
        setInput('');
    }

    return (
        <Modal offModal={offInterview} title={`Interview - ${name}`}>
            <div className={styles.chatContainer}>
                <div className={styles.chatMessages}>
                    {messages.map((msg, index) => (
                        <div className={styles.chatMessage} key={index}>
                            <strong className={`${styles.messageType} ${msg.type === 'user' ? styles.messageTypeUser : styles.messageTypeSuspect}`}>
                                {msg.type}
                            </strong>
                            <span className={styles.messageContent}>{msg.message}</span>
                        </div>
                    ))}
                    <div ref={endOfMessages}></div>
                </div>
                <form className={styles.form} onSubmit={handleSend}>
                    <div className={styles.fieldRow}>
                        <input
                            className={styles.input}
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            placeholder={count >= 15 ? "No more questions" : "Type an interview question"}
                            disabled={waiting}
                        />
                        <button
                            className={styles.button}
                            type="submit"
                            disabled={waiting || count >= 15}
                        >
                            Send
                        </button>
                    </div>
                </form>
                <div className={styles.fieldRow}>
                    <span className={styles.questionCount}>Questions: {count}/15</span>
                </div>
            </div>
        </Modal>
    );
};

export default SuspectInterview;