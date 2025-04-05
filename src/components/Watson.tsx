import React from 'react';
import WatsonSurvey from "./WatsonSurvey";
import useScenarioStore from "../store/scenarioStore";
import useGameStore from "../store/gameStore";
import { useChatGpt } from "../hooks/useChatGpt";
import { getWatsonSystemMessage } from "../prompt/prompt";
import styles from '../styles/components/Watson.module.css';

const Watson: React.FC = () => {
    const { apiKey, watsonChatHistory, updateWatsonChatHistory } = useGameStore();
    const scenario = useScenarioStore((state) => state.scenario);
    const { chat } = useChatGpt(apiKey, getWatsonSystemMessage(scenario));

    const messages = watsonChatHistory;
    const setMessages = updateWatsonChatHistory;

    return (
        <div className={styles.container}>
            <div className={styles.watsonInfo}>
                <img
                    src={`${process.env.PUBLIC_URL}/assets/detective-infinity-watson.png`}
                    alt='watson'
                    className={styles.character}
                />
                <h3 className={styles.title}>What shall we investigate, detective?</h3>
                <p className={styles.description}>Watson at your service! Just give me a shout if you need a hand solving this mystery!</p>
            </div>
            <div className={styles.chatArea}>
                <WatsonSurvey
                    messages={messages}
                    setMessages={setMessages}
                    chat={chat}
                />
            </div>
        </div>
    );
};

export default Watson; 