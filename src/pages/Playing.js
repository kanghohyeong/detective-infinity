import React, {useContext, useState} from 'react';
import Suspect from "../components/Suspect";
import {ScenarioContext} from "../context/ScenarioContextProvider";
import {GAME_STATUS, GAME_TABS} from "../model/enums";
import styled from "styled-components";
import Watson from "../components/Watson";
import Guessing from "../components/Guessing";

const AccordionContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const AccordionItem = styled.div`
  border: 1px solid #ccc;
  margin-bottom: 10px;
  width: 100%;
`;

const AccordionHeader = styled.div`
  background-color: #f1f1f1;
  padding: 10px;
  cursor: pointer;
  height: 40px;
`;

const AccordionContent = styled.div`
  padding: 10px;
  overflow: auto;
  display: ${({isOpen}) => (isOpen ? 'block' : 'none')};
`;

const Playing = ({setGameStatus}) => {

    const {scenario} = useContext(ScenarioContext);
    const [activeTab, setActiveTab] = useState(GAME_TABS.PROLOGUE);

    const changeActiveTab = (tab) => {
        const actived = Object.values(GAME_TABS).find(value => value === tab) ?? GAME_TABS.PROLOGUE;
        setActiveTab(actived);
    }

    return (
        <AccordionContainer>
            <AccordionItem key={1}>
                <AccordionHeader onClick={() => changeActiveTab(GAME_TABS.PROLOGUE)}>
                    Prologue
                </AccordionHeader>
                <AccordionContent isOpen={activeTab === GAME_TABS.PROLOGUE}>
                    <h1>{scenario.title}</h1>
                    <p>{scenario.prologue}</p>
                    <h2>victim</h2>
                    <p>{JSON.stringify(scenario.victim)}</p>
                    <h2>crime scene</h2>
                    <p>{scenario.crimeScene}</p>
                </AccordionContent>
            </AccordionItem>
            <AccordionItem key={2}>
                <AccordionHeader style={{backgroundColor: "green", color: "white"}}
                                 onClick={() => changeActiveTab(GAME_TABS.SUSPECTS)}>
                    Suspects - interview
                </AccordionHeader>
                <AccordionContent isOpen={activeTab === GAME_TABS.SUSPECTS}>
                    {scenario.suspects.map((suspect, index) =>
                        <Suspect key={index} info={{
                            name: suspect.name,
                            gender: suspect.gender,
                            age: suspect.age,
                            description: suspect.description,
                            alibi: suspect.alibi
                        }}/>
                    )}
                </AccordionContent>
            </AccordionItem>
            <AccordionItem>
                <AccordionHeader style={{backgroundColor: "blue", color: "white"}}
                                 onClick={() => changeActiveTab(GAME_TABS.WATSON)}>
                    Watson - helpful assistant
                </AccordionHeader>
                <AccordionContent isOpen={activeTab === GAME_TABS.WATSON}>
                    <Watson/>
                </AccordionContent>
            </AccordionItem>
            <AccordionItem>
                <AccordionHeader style={{backgroundColor: "red", color: "white"}}
                                 onClick={() => changeActiveTab(GAME_TABS.GUESSING)}>
                    I got it!!!
                </AccordionHeader>
                <AccordionContent isOpen={activeTab === GAME_TABS.GUESSING}>
                    <Guessing suspects={scenario.suspects} finishGame={() => setGameStatus(GAME_STATUS.FINISH)}/>
                </AccordionContent>
            </AccordionItem>
        </AccordionContainer>
    );
};

export default Playing;