import React from 'react';
import styles from '../styles/Playing.module.css';
import { Scenario } from '../model/ScenarioScheme';

interface PrologueProps {
    scenario: Scenario;
}

const Prologue: React.FC<PrologueProps> = ({ scenario }) => {
    return (
        <>
            <h1>{scenario.title}</h1>
            <p>{scenario.prologue}</p>
            <h2>VICTIM</h2>
            <h3>{scenario.victim.name} / {scenario.victim.age} / {scenario.victim.gender}</h3>
            <div className={styles.victimInfo}>
                <span>occupation</span>
                <p>{scenario.victim.occupation}</p>
                <span>appearance</span>
                <p>{scenario.victim.appearance}</p>
                <span>description</span>
                <p>{scenario.victim.description}</p>
                <span>cause of death</span>
                <p>{scenario.victim.causeOfDeath}</p>
            </div>
            <h2>CRIME SCENE</h2>
            <p>{scenario.crimeScene}</p>
        </>
    );
};

export default Prologue; 