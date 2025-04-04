import React, { useState } from 'react';
import useScenarioStore from "../store/scenarioStore";
import { GAME_TABS } from "../model/enums";
import Watson from "../components/Watson";
import Guessing from "../components/Guessing";
import Prologue from "../components/Prologue";
import Suspects from "../components/Suspects";
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
                return <Prologue scenario={scenario} />;
            case GAME_TABS.SUSPECTS:
                return <Suspects suspects={scenario.suspects} />;
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