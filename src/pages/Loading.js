import React, {useEffect, useState} from 'react';

const Loading = ({progress}) => {
    const [loadingText, setLoadingText] = useState("Loading...");
    const [progressText, setProgressText] = useState("XXXXXXXXXXXXXXXXXXXX");

    const loadingTextArray = [
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

    const pickRandomText = () => {
        const randomIndex = Math.floor(Math.random() * loadingTextArray.length);
        return loadingTextArray[randomIndex];
    }

    useEffect(() => {
        const interval = setInterval(() => {
            setLoadingText(pickRandomText());
        }, 3000);

        setProgressText("XXXXXXXXXXXXXXXXXXXX");

        return () => clearInterval(interval);
    },[]);

    useEffect(() => {
        const ok = Math.floor((progress / 5) + 0.5);
        const notOk = 20 - ok;
        setProgressText('O'.repeat(ok) + 'X'.repeat(notOk));
    }, [progress]);

    return (
        <div>
            <h3>{loadingText}</h3>
            <p>{progressText}</p>
        </div>
    );
};

export default Loading;