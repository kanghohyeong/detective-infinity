import React, { useEffect, useState } from 'react';
import { GuessingScheme } from "../model/GuessingScheme";
import useScenarioStore from "../store/scenarioStore";
import useGameStore from "../store/gameStore";
import { useChatGpt } from "../hooks/useChatGpt";
import { getScorerSystemMessage } from "../prompt/prompt";
import styles from '../styles/components/Guessing.module.css';
import { Suspect } from '../model/ScenarioScheme';
import { CHAT_TYPE } from '../model/enums';

interface GuessingProps {
    suspects: Suspect[];
}

interface GuessingHistory {
    name: string;
    reasoning: string;
    grade: string;
    hint: string;
}

const Guessing: React.FC<GuessingProps> = ({ suspects }) => {
    const { apiKey, guessingHistory, updateGuessingHistory, chatCounts, incrementChatCount, finishGame } = useGameStore();
    const scenario = useScenarioStore((state) => state.scenario);
    const { chat } = useChatGpt(apiKey, getScorerSystemMessage(scenario), 0.4);

    const [who, setWho] = useState(suspects[0].name);
    const [reasoning, setReasoning] = useState('');
    const [waiting, setWaiting] = useState(false);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();

        if (who === '' || reasoning === '') return;

        setWaiting(true);

        const guessPrompt = `This is my reasoning.
        - murderer: ${who}
        - reasoning: ${reasoning}
        `;
        const guessScore = await chat(guessPrompt, [], GuessingScheme);

        if (guessScore === null) {
            window.alert("Ai Error. retry.");
            setWaiting(false);
            return;
        }

        try {
            if (guessScore.grade === "S") {
                window.alert('Congratulation!!');
                finishGame();
                return;
            }
            const newHistory = guessingHistory.concat({
                name: who,
                reasoning: reasoning,
                grade: guessScore.grade,
                hint: guessScore.hint
            });
            updateGuessingHistory(newHistory);
            incrementChatCount(CHAT_TYPE.GUESSING);
        } catch (e) {
            window.alert("Ai Error. retry.");
        } finally {
            setWaiting(false);
            setWho(suspects[0].name);
            setReasoning('');
        }
    };

    useEffect(() => {
        if ((chatCounts.guessing || 0) >= 5) {
            window.alert("No more try..");
            finishGame();
        }
    }, [chatCounts.guessing, finishGame]);

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Max Try : {(chatCounts.guessing || 0)}/5</h1>
            {guessingHistory.map((history: GuessingHistory, index: number) => (
                <div className={styles.history} key={index}>
                    <h3 className={styles.historyTitle}>try {index + 1}</h3>
                    <p className={styles.historyContent}>
                        <span className={styles.historyLabel}>name:</span> {history.name}
                    </p>
                    <p className={styles.historyContent}>
                        <span className={styles.historyLabel}>reasoning:</span> {history.reasoning}
                    </p>
                    <p className={styles.historyContent}>
                        <span className={styles.historyLabel}>grade:</span> {history.grade}
                    </p>
                    <p className={styles.historyContent}>
                        <span className={styles.historyLabel}>hint:</span> {history.hint}
                    </p>
                </div>
            ))}
            <form className={styles.form} onSubmit={handleSend}>
                <div className={styles.inputContainer}>
                    <label className={styles.label}>murderer</label>
                    <select
                        className={styles.select}
                        value={who}
                        onChange={e => setWho(e.target.value)}
                    >
                        {suspects.map((suspect, index) => (
                            <option key={index} value={suspect.name}>{suspect.name}</option>
                        ))}
                    </select>
                </div>
                <div className={styles.inputContainer}>
                    <label className={styles.label}>reasoning</label>
                    <textarea
                        className={styles.textarea}
                        value={reasoning}
                        onChange={e => setReasoning(e.target.value)}
                        placeholder="your reasoning"
                    />
                </div>
                <div className={styles.buttonContainer}>
                    <button
                        className={styles.button}
                        type="button"
                        onClick={finishGame}
                    >
                        give up..
                    </button>
                    <button
                        className={styles.button}
                        type="submit"
                        disabled={waiting || (chatCounts.guessing || 0) >= 5}
                    >
                        Busted!
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Guessing; 