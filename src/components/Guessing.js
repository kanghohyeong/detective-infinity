import React, {useState} from 'react';
import {useContext} from "react";
import {AIChatContext} from "../context/AIChatContextProvider";
import {GuessingParser} from "../model/GuessingScheme";
import styled from "styled-components";

const HistoryDiv = styled.div`
  border: 1px solid black;
`

const GuessingForm = styled.form`
  border: 1px solid black;
`

const Guessing = ({ending}) => {

    const {executeHumanQuestion, addAIMessage} = useContext(AIChatContext);

    const [who, setWho] = useState('');
    const [how, setHow] = useState('');
    const [why, setWhy] = useState('');
    const [waiting, setWaiting] = useState(false);

    const [guessHistory, setGuessHistory] = useState([]);

    const handleSend = async (e) => {
        e.preventDefault();

        if (who === '' || why === '' || why === '') return;

        setWaiting(true);

        const guessPrompt = `
        Question type: Guessing
        My guessing:
        - name: ${who}
        - how: ${how}
        - why: ${why}
        `;
        const aiMessage = await executeHumanQuestion(guessPrompt);
        addAIMessage(aiMessage);

        try {
            const guessingJson = await GuessingParser.parse(aiMessage);
            if (guessingJson.isTrue) {
                window.alert('Congratulation!!')
                // ending();
            }
            setGuessHistory(guessHistory.concat({
                "name": who,
                "how": how,
                "why": why,
                "hint": guessingJson.hint
            }));
        } catch (e) {
            console.error("parse error");
            setGuessHistory(guessHistory.concat({
                "name": who,
                "how": how,
                "why": why,
                "hint": "error"
            }))
        } finally {
            setWaiting(false);
            setWho('');
            setWhy('');
            setHow('');
        }
    };

    return (
        <div>
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
                    <input value={who} onChange={e => setWho(e.target.value)} placeholder="who is murderer"/>
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
            <button type="button" onClick={ending}>give up..</button>
        </div>
    );
};

export default Guessing;