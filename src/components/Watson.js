import React from 'react';
import {useState} from "react";
import WatsonSurvey from "./WatsonSurvey";
import useScenarioStore from "../store/scenarioStore";
import useGameStore from "../store/gameStore";
import {useChatGpt} from "../hooks/useChatGpt";
import {getWatsonSystemMessage} from "../prompt/prompt";
import styles from '../styles/components/Watson.module.css';

const Watson = () => {
    const [onSurvey, setOnSurvey] = useState(false);
    const { apiKey, watsonChatHistory, updateWatsonChatHistory } = useGameStore();
    const scenario = useScenarioStore((state) => state.scenario);
    const {count, chat} = useChatGpt(apiKey, getWatsonSystemMessage(scenario));

    const messages = watsonChatHistory;
    const setMessages = updateWatsonChatHistory;

    return (
        <div className={styles.container}>
            <pre className={styles.ascii} onClick={() => setOnSurvey(true)}>
                <code>{`
  ___
/     \\
/_______\\
/      \\
/        \\
|  |    |  |
\\  \\__/  /
\\______/
\\\\||//
\\\\||//
.----\\\\||//----.
(     /\\\\  /\\\\     )
(    /  \\\\/  \\\\    )
(   /    ||    \\\\   )
(  /     ||     \\\\  )
( /      ||      \\\\ )
(<       ||       >)
\\\\      ||      /
\\\\____/\\\\____/
`}
                </code>
            </pre>
            <h3 className={styles.title}>What shall we investigate, detective?</h3>
            <p className={styles.description}>crime scene investigation, surrounding investigation, etc..</p>
            {onSurvey && (
                <WatsonSurvey
                    messages={messages}
                    setMessages={setMessages}
                    offSurvey={() => setOnSurvey(false)}
                    chat={chat}
                    count={count}
                />
            )}
        </div>
    );
};

export default Watson;