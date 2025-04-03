import React, { useState } from 'react';
import Suspect from "../components/Suspect";
import useScenarioStore from "../store/scenarioStore";
import { GAME_TABS } from "../model/enums";
import Watson from "../components/Watson";
import Guessing from "../components/Guessing";
import styles from '../styles/Playing.module.css';

const Playing = () => {
    const scenario = useScenarioStore((state) => state.scenario);
    const [activeTab, setActiveTab] = useState(GAME_TABS.PROLOGUE);

    const changeActiveTab = (tab) => {
        const actived = Object.values(GAME_TABS).find(value => value === tab) ?? GAME_TABS.PROLOGUE;
        setActiveTab(actived);
    }

    const renderContent = () => {
        switch (activeTab) {
            case GAME_TABS.PROLOGUE:
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
            case GAME_TABS.SUSPECTS:
                return (
                    <>
                        <p>Click suspect..</p>
                        {scenario.suspects.map((suspect, index) =>
                            <Suspect key={index} info={suspect} />
                        )}
                    </>
                );
            case GAME_TABS.WATSON:
                return <Watson />;
            case GAME_TABS.GUESSING:
                return <Guessing suspects={scenario.suspects} />;
            default:
                return null;
        }
    };

    return (
        scenario &&
        <div className={styles.container}>
            <div className={styles.tabHeader}>
                <div 
                    className={activeTab === GAME_TABS.PROLOGUE ? styles.tabActive : styles.tab}
                    onClick={() => changeActiveTab(GAME_TABS.PROLOGUE)}
                >
                    Prologue
                </div>
                <div 
                    className={activeTab === GAME_TABS.SUSPECTS ? styles.tabActive : styles.tab}
                    onClick={() => changeActiveTab(GAME_TABS.SUSPECTS)}
                >
                    Suspects
                </div>
                <div 
                    className={activeTab === GAME_TABS.WATSON ? styles.tabActive : styles.tab}
                    onClick={() => changeActiveTab(GAME_TABS.WATSON)}
                >
                    Watson
                </div>
                <div 
                    className={activeTab === GAME_TABS.GUESSING ? styles.tabActive : styles.tab}
                    onClick={() => changeActiveTab(GAME_TABS.GUESSING)}
                >
                    I got it!!!
                </div>
            </div>
            <div className={styles.contentArea}>
                {renderContent()}
            </div>
        </div>
    );
};

export default Playing;