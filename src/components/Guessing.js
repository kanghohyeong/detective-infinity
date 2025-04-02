import React, {useEffect, useState} from 'react';
import {useContext} from "react";
import {GuessingParser} from "../model/GuessingScheme";
import styled from "styled-components";
import {ApiKeyContext} from "../context/ApiKeyContextProvider";
import useScenarioStore from "../store/scenarioStore";
import {useChatGpt} from "../hooks/useChatGpt";
import {getScorerSystemMessage} from "../prompt/prompt";

const HistoryDiv = styled.div`
  border: 1px solid #000000;
  margin-bottom: 20px;
  padding: 5px 5px;
`

const GuessingForm = styled.form`
  //border: 1px solid black;
  padding: 5px 5px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  button {
    margin: 0px 10px;
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
    const scenario = useScenarioStore((state) => state.scenario);
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
        <div className={"modal-dialog"}>
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
            <GuessingForm className={"inner-border"} onSubmit={handleSend}>
                <GuessingInputContainer className={"modal-contents"}>
                    <label>murderer</label>
                    <select value={who} onChange={e => setWho(e.target.value)}>
                        {suspects.map((suspect, index) =>
                            <option key={index} value={suspect.name}>{suspect.name}</option>)}
                    </select>
                </GuessingInputContainer>
                <GuessingInputContainer className={"modal-contents"}>
                    <label>reasoning</label>
                    <textarea value={reasoning} onChange={e => setReasoning(e.target.value)}
                              placeholder="your reasoning"/>
                </GuessingInputContainer>
                <div>
                    <button className={"btn"} type="button" onClick={finishGame}>give up..</button>
                    <button className={"btn btn-default"} type="submit" disabled={waiting}>Busted!</button>
                </div>
            </GuessingForm>

        </div>
    );
};

export default Guessing;