import React, { useEffect, useState } from 'react';
import { GuessingParser } from "../model/GuessingScheme";
import styled from "styled-components";
import useScenarioStore from "../store/scenarioStore";
import useGameStore from "../store/gameStore";
import { useChatGpt } from "../hooks/useChatGpt";
import { getScorerSystemMessage } from "../prompt/prompt";

const HistoryDiv = styled.div`
  border: 1px solid #000000;
  margin-bottom: 20px;
  padding: 5px 5px;
`

const GuessingForm = styled.form`
  padding: 5px 5px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;

  button {
    margin: 0px 10px;
    padding: 5px 10px;
    background: #000;
    color: #fff;
    border: none;
    cursor: pointer;
    
    &:disabled {
      background: #ccc;
      cursor: not-allowed;
    }
  }
`

const GuessingInputContainer = styled.div`
  width: 80%;
  max-width: 800px;
  display: flex;
  justify-content: space-between;
  gap: 10px;

  label {
    border: 1px solid #ffffff;
    width: 100px;
    padding: 5px;
    background: #000;
    color: #fff;
  }

  select {
    width: 60%;
    padding: 5px;
  }

  textarea {
    width: 60%;
    height: 100px;
    resize: none;
    padding: 5px;
  }
`

const ButtonContainer = styled.div`
  display: flex;
  gap: 10px;
`

const GuessingContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`

const Guessing = ({ suspects }) => {
    const { apiKey } = useGameStore();
    const scenario = useScenarioStore((state) => state.scenario);
    const { finishGame } = useGameStore();
    const { count, chat } = useChatGpt(apiKey, getScorerSystemMessage(scenario), 0.4);

    const [who, setWho] = useState(suspects[0].name);
    const [reasoning, setReasoning] = useState('');
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
    }, [count, finishGame]);

    return (
        <GuessingContainer>
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
                    <label>murderer</label>
                    <select value={who} onChange={e => setWho(e.target.value)}>
                        {suspects.map((suspect, index) =>
                            <option key={index} value={suspect.name}>{suspect.name}</option>)}
                    </select>
                </GuessingInputContainer>
                <GuessingInputContainer>
                    <label>reasoning</label>
                    <textarea value={reasoning} onChange={e => setReasoning(e.target.value)}
                        placeholder="your reasoning" />
                </GuessingInputContainer>
                <ButtonContainer>
                    <button type="button" onClick={finishGame}>give up..</button>
                    <button type="submit" disabled={waiting}>Busted!</button>
                </ButtonContainer>
            </GuessingForm>
        </GuessingContainer>
    );
};

export default Guessing;