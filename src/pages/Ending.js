import React from 'react';
import { GAME_STATUS } from "../model/enums";
import useScenarioStore from "../store/scenarioStore";
import useGameStore from "../store/gameStore";
import styles from '../styles/Ending.module.css';

const Ending = () => {
    const scenario = useScenarioStore((state) => state.scenario);
    const { setGameStatus } = useGameStore();

    return (
        <div className={styles.window}>
            <div className={styles.titleBar}>
                <h1 className={styles.title}>Ending..</h1>
            </div>
            <div className={styles.separator} />
            <div className={styles.dialog}>
                <h3>Murderer</h3>
                <div>
                    <p>name : {scenario.truth.murderer}</p>
                    <p>how : {scenario.truth.how}</p>
                    <p>why : {scenario.truth.why}</p>
                    <p>trick : {scenario.truth.trick}</p>
                    <p>loophole : {scenario.truth.loophole}</p>
                    <p>story : {scenario.suspects.find(suspect => suspect.isMurderer).story}</p>
                </div>
                <div className={styles.separator} />
                <h3>Suspects</h3>
                {scenario.suspects.filter(suspect => !suspect.isMurderer).map((suspect, index) => (
                    <div className={styles.standardDialog} key={index}>
                        <p>name : {suspect.name}</p>
                        <p>alibi : {suspect.alibi}</p>
                        <p>story : {suspect.story}</p>
                    </div>
                ))}
                <div className={styles.buttonContainer}>
                    <button 
                        className={styles.button}
                        type="button"
                        onClick={() => setGameStatus(GAME_STATUS.INIT)}
                    >
                        HOME
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Ending;