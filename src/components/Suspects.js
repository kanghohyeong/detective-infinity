import React, { useState } from 'react';
import Suspect from "./Suspect";
import SuspectInterview from "./SuspectInterview";
import useScenarioStore from "../store/scenarioStore";
import useGameStore from "../store/gameStore";
import { useChatGpt } from "../hooks/useChatGpt";
import { getInterviewSystemMessage } from "../prompt/prompt";
import styles from '../styles/components/Suspects.module.css';

const Suspects = ({ suspects }) => {
    const [selectedSuspect, setSelectedSuspect] = useState(null);
    const { apiKey, suspectChatHistory, updateSuspectChatHistory } = useGameStore();
    const scenario = useScenarioStore((state) => state.scenario);

    const { chat } = useChatGpt(
        apiKey,
        selectedSuspect ? getInterviewSystemMessage(selectedSuspect, scenario) : ''
    );

    const handleSuspectSelect = (suspect) => {
        setSelectedSuspect(suspect);
    };

    const handleCloseInterview = () => {
        setSelectedSuspect(null);
    };

    return (
        <div className={styles.container}>
            <div className={styles.suspectsList}>
                <h3>Suspects</h3>
                {suspects.map((suspect, index) => (
                    <Suspect 
                        key={index} 
                        info={suspect} 
                        isSelected={selectedSuspect?.name === suspect.name}
                        onSelect={() => handleSuspectSelect(suspect)}
                    />
                ))}
            </div>
            <div className={styles.chatArea}>
                {selectedSuspect ? (
                    <SuspectInterview
                        name={selectedSuspect.name}
                        messages={suspectChatHistory[selectedSuspect.name] || []}
                        setMessages={(newMessages) => updateSuspectChatHistory(selectedSuspect.name, newMessages)}
                        offInterview={handleCloseInterview}
                        chat={chat}
                    />
                ) : (
                    <div className={styles.noSelection}>
                        <p>Select a suspect to start the interview</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Suspects; 