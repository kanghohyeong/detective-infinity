import React, { useEffect, useState } from 'react';
import useGameStore from "../store/gameStore";
import styles from '../styles/Loading.module.css';

const Loading: React.FC = () => {
    const [loadingText, setLoadingText] = useState<string>("Please wait..");
    const [progressText, setProgressText] = useState<string>("XXXXXXXXXXXXXXXXXXXX");
    const { progress } = useGameStore();

    const loadingTextArray: string[] = [
        'Deciphering clues...',
        'Sleuthing mysteries...',
        'Setting up the crime scene...',
        'Gathering suspects...',
        'Polishing magnifying glass...',
        'Sharpening detective instincts...',
        'Brewing coffee for late-night investigations...',
        'Prepping noir atmosphere...',
        'Calibrating plot twists...',
        'Ready your deductions...',
        'Bribing informants...',
        'Shuffling case files...'
    ];

    const pickRandomText = (): string => {
        const randomIndex = Math.floor(Math.random() * loadingTextArray.length);
        return loadingTextArray[randomIndex];
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setLoadingText(pickRandomText());
        }, 3000);

        setProgressText("XXXXXXXXXXXXXXXXXXXX");

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const ok = Math.floor((progress / 5) + 0.5);
        const notOk = 20 - ok;
        setProgressText('O'.repeat(ok) + 'X'.repeat(notOk));
    }, [progress]);

    return (
        <div className={styles.window}>
            <div className={styles.titleBar}>
                <h1 className={styles.title}>Loading</h1>
            </div>
            <div className={styles.separator} />
            <div className={styles.windowPane}>
                <h3>{loadingText}</h3>
                <p>{progressText}</p>
            </div>
        </div>
    );
};

export default Loading; 