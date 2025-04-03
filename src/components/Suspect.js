import React, {useState} from 'react';
import SuspectInterview from "./SuspectInterview";
import useScenarioStore from "../store/scenarioStore";
import useGameStore from "../store/gameStore";
import {useChatGpt} from "../hooks/useChatGpt";
import {getInterviewSystemMessage} from "../prompt/prompt";
import styles from '../styles/components/Suspect.module.css';

const Suspect = ({info}) => {
    const [onInterview, setOnInterview] = useState(false);
    const { apiKey, suspectChatHistory, updateSuspectChatHistory } = useGameStore();
    const scenario = useScenarioStore((state) => state.scenario);
    const {count, chat} = useChatGpt(apiKey, getInterviewSystemMessage(info, scenario));

    const messages = suspectChatHistory[info.name] || [];
    const setMessages = (newMessages) => updateSuspectChatHistory(info.name, newMessages);

    return (
        <div className={styles.suspectCard} onClick={() => setOnInterview(true)}>
            <p className={styles.suspectInfo}>
                <span className={styles.label}>Name:</span> {info.name}
            </p>
            <p className={styles.suspectInfo}>
                <span className={styles.label}>Gender:</span> {info.gender}
            </p>
            <p className={styles.suspectInfo}>
                <span className={styles.label}>Age:</span> {info.age}
            </p>
            <p className={styles.suspectInfo}>
                <span className={styles.label}>Occupation:</span> {info.occupation}
            </p>
            <p className={styles.suspectInfo}>
                <span className={styles.label}>Appearance:</span> {info.appearance}
            </p>
            {onInterview && (
                <SuspectInterview
                    name={info.name}
                    messages={messages}
                    setMessages={setMessages}
                    offInterview={() => setOnInterview(false)}
                    chat={chat}
                    count={count}
                />
            )}
        </div>
    );
};

export default Suspect;