import React, {useEffect, useState} from 'react';
import {useContext} from "react";
import {GuessingParser} from "../model/GuessingScheme";
import styled from "styled-components";
import {ApiKeyContext} from "../context/ApiKeyContextProvider";
import {ScenarioContext} from "../context/ScenarioContextProvider";
import {useChatGpt} from "../hooks/useChatGpt";
import {getScorerSystemMessage} from "../prompt/prompt";

const HistoryDiv = styled.div`
  border: 1px dotted #ffffff;
  margin-bottom: 20px;
`

const GuessingForm = styled.form`
  border: 1px solid black;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  
  button {
    width: 200px;
    height: 30px;
    background: #8b0000;
    color: #ffffff;
  }
`

const GuessingInputContainer = styled.div`
  width: 80%;
  max-width: 800px;
  display: flex;
  justify-content: space-between;

  label {
    border: 1px solid #ffffff;
    width: 100px;
  }
  
  select {
    width: 60%;
  }
  
  textarea {
    width: 60%;
    height: 100px;
    resize: none;
  }
  
  

  margin-bottom: 10px;
`

const Guessing = ({suspects, finishGame}) => {

    const {apiKey} = useContext(ApiKeyContext);
    const {scenario} = useContext(ScenarioContext);
    const {count, chat} = useChatGpt(apiKey, getScorerSystemMessage(scenario), 0.4);

    const [who, setWho] = useState(suspects[0].name);
    const [reasoning, setReasoning] = useState('');
    // const [how, setHow] = useState('');
    // const [why, setWhy] = useState('');
    const [waiting, setWaiting] = useState(false);

    const [guessHistory, setGuessHistory] = useState([]);

    const handleSend = async (e) => {
        e.preventDefault();

        if (who === '' || reasoning === '') return;

        setWaiting(true);

        const guessPrompt = `This is my reasoning.
        - murderer: ${who}
        - reasoning: ${reasoning}
        ---
        ${GuessingParser.getFormatInstructions()}
        `;
        const aiMessage = await chat(guessPrompt);

        try {
            const guessingJson = await GuessingParser.parse(aiMessage);
            if (guessingJson.grade === "S") {
                window.alert('Congratulation!!');
                finishGame();
                return;
            }
            setGuessHistory(guessHistory.concat({
                "name": who,
                "reasoning": reasoning,
                "grade": guessingJson.grade,
                "hint": guessingJson.hint
            }));
        } catch (e) {
            window.alert("Ai Error. retry.");
        } finally {
            setWaiting(false);
            setWho(suspects[0].name);
            setReasoning('');
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
                    <p>reasoning: {history.reasoning}</p>
                    <p>grade: {history.grade}</p>
                    <p>hint : {history.hint}</p>
                </HistoryDiv>
            ))}
            <GuessingForm onSubmit={handleSend}>
                <GuessingInputContainer>
                    <label>who</label>
                    <select value={who} onChange={e => setWho(e.target.value)}>
                        {suspects.map((suspect, index) =>
                            <option key={index} value={suspect.name}>{suspect.name}</option>)}
                    </select>
                </GuessingInputContainer>
                <GuessingInputContainer>
                    <label>reasoning</label>
                    <textarea value={reasoning} onChange={e => setReasoning(e.target.value)}
                              placeholder="your reasoning"/>
                </GuessingInputContainer>
                <button type="submit" disabled={waiting}>Busted!</button>
            </GuessingForm>
            <button type="button" onClick={finishGame}>give up..</button>
        </div>
    );
};

export default Guessing;