import React, { useEffect, useRef, useState } from 'react';
import useGameStore from "../store/gameStore";
import { ChatMessage } from '../hooks/useChatGpt';
import { CHAT_TYPE } from '../model/enums';
import styles from '../styles/components/WatsonSurvey.module.css';

interface WatsonSurveyProps {
    messages: ChatMessage[];
    setMessages: (messages: ChatMessage[]) => void;
    chat: (message: string, chatHistory?: ChatMessage[]) => Promise<string | null>;
}

const WatsonSurvey: React.FC<WatsonSurveyProps> = ({ messages, setMessages, chat }) => {
    const [input, setInput] = useState('');
    const [waiting, setWaiting] = useState(false);
    const endOfMessages = useRef<HTMLDivElement>(null);
    const { chatCounts, incrementChatCount } = useGameStore();

    const scrollToBottom = () => {
        endOfMessages.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();

        if (input === '') return;

        const currentMessages = messages.concat({ type: 'user', message: input });
        setMessages(currentMessages);
        setWaiting(true);

        const aiMessage = await chat(input, currentMessages);
        if (aiMessage == null) {
            setMessages(currentMessages.concat({ type: "error", message: "AI Error" }));
        } else {
            setMessages(currentMessages.concat({ type: "watson", message: aiMessage }));
            incrementChatCount(CHAT_TYPE.WATSON);
        }
        setWaiting(false);
        setInput('');
    };

    return (
        <div className={styles.chatContainer}>
            <div className={styles.chatHeader}>
                <h3>Watson Survey</h3>
            </div>
            <div className={styles.chatMessages}>
                {messages.map((msg: ChatMessage, index: number) => (
                    <div className={styles.chatMessage} key={index}>
                        <strong className={`${styles.messageType} ${msg.type === 'user' ? styles.messageTypeUser : styles.messageTypeWatson}`}>
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
                        placeholder={(chatCounts.watson || 0) >= 20 ? "No more questions" : "Type a question for Watson"}
                        disabled={waiting}
                    />
                    <button
                        className={styles.button}
                        type="submit"
                        disabled={waiting || (chatCounts.watson || 0) >= 20}
                    >
                        Send
                    </button>
                </div>
            </form>
            <div className={styles.fieldRow}>
                <span className={styles.questionCount}>Questions: {(chatCounts.watson || 0)}/20</span>
            </div>
        </div>
    );
};

export default WatsonSurvey; 