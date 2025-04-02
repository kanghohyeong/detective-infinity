import React, {useEffect, useState} from 'react';
import useGameStore from "../store/gameStore";
import styled from "styled-components";

const Window = styled.div`
  border: 1px solid #333333;
  margin: 20px auto;
  max-width: 600px;
  width: 90%;
  background-color: #2d2d2d;
`

const TitleBar = styled.div`
  background: #333333;
  color: #ffffff;
  padding: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const Title = styled.h1`
  margin: 0;
  font-size: 1.2em;
`

const Separator = styled.div`
  border-top: 1px solid #333333;
`

const WindowPane = styled.div`
  padding: 20px;
  text-align: center;
  color: #ffffff;
`

const Loading = () => {
    const [loadingText, setLoadingText] = useState("Please wait..");
    const [progressText, setProgressText] = useState("XXXXXXXXXXXXXXXXXXXX");
    const { progress } = useGameStore();

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
        <Window>
            <TitleBar>
                <Title>Loading</Title>
            </TitleBar>
            <Separator />
            <WindowPane>
                <h3>{loadingText}</h3>
                <p>{progressText}</p>
            </WindowPane>
        </Window>
    );
};

export default Loading;