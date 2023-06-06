import React, {useEffect, useState} from 'react';

const Loading = props => {
    const [loadingText, setLoadingText] = useState("Loading...");

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

        return () => clearInterval(interval);
    })


    return (
        <div>
            {loadingText}
        </div>
    );
};

export default Loading;