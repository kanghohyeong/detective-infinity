import React, {useContext, useState} from 'react';
import Suspect from "../components/Suspect";
import {ScenarioContext} from "../context/ScenarioContextProvider";
import {GAME_STATUS, GAME_TABS} from "../model/enums";
import styled, {css} from "styled-components";
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
  opacity: 0;
  height: 0;
  overflow: hidden;
    // display: ${({isOpen}) => (isOpen ? 'block' : 'none')};

  transition: opacity 0.3s ease, height 0.8s ease;

  ${(props) =>
          props.isOpen &&
          css`
            opacity: 1;
            height: auto;
          `}
`;

const VictimInfoDiv = styled.div`
  span {
    border: 1px solid #ffffff;
  }
  p {
    margin: 5px;
  }
`

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
                <AccordionHeader style={{backgroundColor: "#696969"}}
                                 onClick={() => changeActiveTab(GAME_TABS.PROLOGUE)}>
                    Prologue
                </AccordionHeader>
                <AccordionContent isOpen={activeTab === GAME_TABS.PROLOGUE}>
                    <h1>{scenario.title}</h1>
                    <p>{scenario.prologue}</p>
                    <h2>VICTIM</h2>
                    <h3>{scenario.victim.name} / {scenario.victim.age} / {scenario.victim.gender}</h3>
                    <VictimInfoDiv>
                        <span>occupation</span>
                        <p>{scenario.victim.occupation}</p>
                        <span>appearance</span>
                        <p>{scenario.victim.appearance}</p>
                        <span>description</span>
                        <p>{scenario.victim.description}</p>
                        <span>cause of death</span>
                        <p>{scenario.victim.causeOfDeath}</p>
                    </VictimInfoDiv>
                    <h2>CRIME SCENE</h2>
                    <p>{scenario.crimeScene}</p>
                </AccordionContent>
            </AccordionItem>
            <AccordionItem key={2}>
                <AccordionHeader style={{backgroundColor: "#2f4f4f"}}
                                 onClick={() => changeActiveTab(GAME_TABS.SUSPECTS)}>
                    Suspects - interview
                </AccordionHeader>
                <AccordionContent isOpen={activeTab === GAME_TABS.SUSPECTS}>
                    {scenario.suspects.map((suspect, index) =>
                        <Suspect key={index} info={suspect}/>
                    )}
                </AccordionContent>
            </AccordionItem>
            <AccordionItem>
                <AccordionHeader style={{backgroundColor: "#4682b4"}}
                                 onClick={() => changeActiveTab(GAME_TABS.WATSON)}>
                    Watson - helpful assistant
                </AccordionHeader>
                <AccordionContent isOpen={activeTab === GAME_TABS.WATSON}>
                    <Watson/>
                </AccordionContent>
            </AccordionItem>
            <AccordionItem>
                <AccordionHeader style={{backgroundColor: "#8b0000"}}
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