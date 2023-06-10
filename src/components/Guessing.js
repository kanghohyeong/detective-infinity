import React, {useEffect, useState} from 'react';
import {useContext} from "react";
import {GuessingParser} from "../model/GuessingScheme";
import styled from "styled-components";
import {ApiKeyContext} from "../context/ApiKeyContextProvider";
import {ScenarioContext} from "../context/ScenarioContextProvider";
import {useChatGpt} from "../hooks/useChatGpt";

const HistoryDiv = styled.div`
  border: 1px solid black;
`

const GuessingForm = styled.form`
  border: 1px solid black;
`

const Guessing = ({suspects, finishGame}) => {

    // const {executeHumanQuestion, addAIMessage} = useContext(AIChatContext);
    const {apiKey} = useContext(ApiKeyContext);
    const {scenario} = useContext(ScenarioContext);
    const {count, chat} = useChatGpt(apiKey, scenario);

    const [who, setWho] = useState(suspects[0].name);
    const [how, setHow] = useState('');
    const [why, setWhy] = useState('');
    const [waiting, setWaiting] = useState(false);

    const [guessHistory, setGuessHistory] = useState([]);

    const handleSend = async (e) => {
        e.preventDefault();

        if (who === '' || why === '' || why === '') return;

        setWaiting(true);

        const guessPrompt = `
        Command type: Guessing
        My guessing:
        - name: ${who}
        - how: ${how}
        - why: ${why}
        `;
        const aiMessage = await chat(guessPrompt);

        try {
            const guessingJson = await GuessingParser.parse(aiMessage);
            if (guessingJson.isTrue) {
                window.alert('Congratulation!!');
                finishGame();
                return;
            }
            setGuessHistory(guessHistory.concat({
                "name": who,
                "how": how,
                "why": why,
                "hint": guessingJson.hint
            }));
        } catch (e) {
            window.alert("Ai Error. retry.");
        } finally {
            setWaiting(false);
            setWho(suspects[0].name);
            setWhy('');
            setHow('');
        }
    };

    useEffect(() => {
        if (count >= 5) {
            window.alert("No more try..");
            finishGame();
        }

    }, [count]);

    return (
        <div>
            <h1>Max Try : {count}/5</h1>
            {guessHistory.map((history, index) => (
                <HistoryDiv key={index}>
                    <h3>try {index + 1}</h3>
                    <p>name: {history.name}</p>
                    <p>how: {history.how}</p>
                    <p>why: {history.why}</p>
                    <p>hint : {history.hint}</p>
                </HistoryDiv>
            ))}
            <GuessingForm onSubmit={handleSend}>
                <div>
                    <label>who</label>
                    <select value={who} onChange={e => setWho(e.target.value)}>
                        {suspects.map((suspect, index) =>
                            <option key={index} value={suspect.name}>{suspect.name}</option>)}
                    </select>
                </div>
                <div>
                    <label>why</label>
                    <input value={why} onChange={e => setWhy(e.target.value)} placeholder="what is the motive"/>
                </div>
                <div>
                    <label>how</label>
                    <input value={how} onChange={e => setHow(e.target.value)} placeholder="how to kill"/>
                </div>
                <button type="submit" disabled={waiting}>Busted!</button>
            </GuessingForm>
            <button type="button" onClick={finishGame}>give up..</button>
        </div>
    );
};

export default Guessing;