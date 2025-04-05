import React, { useEffect, useRef, useState } from "react";
import useGameStore from "../store/gameStore";
import styles from '../styles/components/SuspectInterview.module.css';
import { ChatMessage } from '../hooks/useChatGpt';
import { CHAT_TYPE } from '../model/enums';

interface SuspectInterviewProps {
    name: string;
    messages: ChatMessage[];
    setMessages: (messages: ChatMessage[]) => void;
    offInterview: () => void;
    chat: (message: string, chatHistory?: ChatMessage[]) => Promise<string | null>;
}

const SuspectInterview: React.FC<SuspectInterviewProps> = ({ 
    name, 
    messages, 
    setMessages, 
    offInterview, 
    chat 
}) => {
    const [input, setInput] = useState('');
    const [waiting, setWaiting] = useState(false);
    const endOfMessages = useRef<HTMLDivElement>(null);
    const { chatCounts, incrementChatCount } = useGameStore();

    const scrollToBottom = () => {
        endOfMessages.current?.scrollIntoView({ behavior: 'smooth' });
    }

    useEffect(scrollToBottom, [messages]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();

        if (input === '') return;

        const currentMessages = messages.concat({ type: 'user', message: input });
        setMessages(currentMessages);
        setWaiting(true);

        const interviewQuestion = `
        Interviewee: ${name} 
        Question: ${input}`;
        const aiMessage = await chat(interviewQuestion, messages);
        if (aiMessage == null) {
            setMessages(currentMessages.concat({ type: "error", message: "AI Error" }));
        } else {
            setMessages(currentMessages.concat({ type: name, message: aiMessage }));
            incrementChatCount(CHAT_TYPE.SUSPECT, name);
        }
        setWaiting(false);
        setInput('');
    }

    return (
        <div className={styles.chatContainer}>
            <div className={styles.chatHeader}>
                <h3>Interview with {name}</h3>
                <button className={styles.closeButton} onClick={offInterview}>×</button>
            </div>
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
                        placeholder={(chatCounts.suspects[name] || 0) >= 15 ? "No more questions" : "Type an interview question"}
                        disabled={waiting}
                    />
                    <button
                        className={styles.button}
                        type="submit"
                        disabled={waiting || (chatCounts.suspects[name] || 0) >= 15}
                    >
                        Send
                    </button>
                </div>
            </form>
            <div className={styles.fieldRow}>
                <span className={styles.questionCount}>Questions: {(chatCounts.suspects[name] || 0)}/15</span>
            </div>
        </div>
    );
};

export default SuspectInterview; 