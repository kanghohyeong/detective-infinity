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
    method: string;
    motive: string;
    evidence: string;
    grade: string;
    hint: string;
}

const Guessing: React.FC<GuessingProps> = ({ suspects }) => {
    const { apiKey, guessingHistory, updateGuessingHistory, chatCounts, incrementChatCount, finishGame } = useGameStore();
    const scenario = useScenarioStore((state) => state.scenario);
    const { chat } = useChatGpt(apiKey, getScorerSystemMessage(scenario), 0.4);

    const [who, setWho] = useState(suspects[0].name);
    const [method, setMethod] = useState('');
    const [motive, setMotive] = useState('');
    const [evidence, setEvidence] = useState('');
    const [waiting, setWaiting] = useState(false);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();

        if (who === '' || method === '' || motive === '' || evidence === '') return;

        setWaiting(true);

        const guessPrompt = `This is my reasoning.
        - murderer: ${who}
        - method: ${method}
        - motive: ${motive}
        - evidence: ${evidence}
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
                method: method,
                motive: motive,
                evidence: evidence,
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
            setMethod('');
            setMotive('');
            setEvidence('');
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
            <div className={styles.tryContainer}>
                <div className={styles.tryTitle}>Max Try</div>
                <div className={styles.tryProgress}>
                    <div className={styles.tryCount}>{(chatCounts.guessing || 0)}/5</div>
                    <div className={styles.tryBar}>
                        <div 
                            className={styles.tryBarFill} 
                            style={{ width: `${((chatCounts.guessing || 0) / 5) * 100}%` }}
                        />
                    </div>
                </div>
            </div>
            <p className={styles.instruction}>
                So, who's the murderer? Reveal the killer, the method of the crime, their motive—and the evidence to back it all up!
            </p>

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
                    <label className={styles.label}>method</label>
                    <textarea
                        className={styles.textarea}
                        value={method}
                        onChange={e => setMethod(e.target.value)}
                        placeholder="How was the crime committed?"
                    />
                </div>
                <div className={styles.inputContainer}>
                    <label className={styles.label}>motive</label>
                    <textarea
                        className={styles.textarea}
                        value={motive}
                        onChange={e => setMotive(e.target.value)}
                        placeholder="Why did they commit the crime?"
                    />
                </div>
                <div className={styles.inputContainer}>
                    <label className={styles.label}>evidence</label>
                    <textarea
                        className={styles.textarea}
                        value={evidence}
                        onChange={e => setEvidence(e.target.value)}
                        placeholder="What evidence supports your theory?"
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
            {[...guessingHistory].reverse().map((history: GuessingHistory, index: number) => (
                <div className={styles.history} key={index}>
                    <h3 className={styles.historyTitle}># {guessingHistory.length - index}</h3>
                    <p className={styles.historyContent}>
                        <span className={styles.historyLabel}>name:</span> {history.name}
                    </p>
                    <p className={styles.historyContent}>
                        <span className={styles.historyLabel}>method:</span> {history.method}
                    </p>
                    <p className={styles.historyContent}>
                        <span className={styles.historyLabel}>motive:</span> {history.motive}
                    </p>
                    <p className={styles.historyContent}>
                        <span className={styles.historyLabel}>evidence:</span> {history.evidence}
                    </p>
                    <p className={styles.historyContent}>
                        <span className={styles.historyLabel}>grade:</span> {history.grade}
                    </p>
                    <p className={styles.historyContent}>
                        <span className={styles.historyLabel}>hint:</span> {history.hint}
                    </p>
                </div>
            ))}
        </div>
    );
};

export default Guessing; 