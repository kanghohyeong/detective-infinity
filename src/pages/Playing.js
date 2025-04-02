import React, { useState } from 'react';
import Suspect from "../components/Suspect";
import useScenarioStore from "../store/scenarioStore";
import { GAME_TABS } from "../model/enums";
import styled, { css } from "styled-components";
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
  margin-bottom: 10px;
  width: 100%;
  border: 1px solid #000;
`;

const AccordionHeader = styled.div`
  cursor: pointer;
  background: #000;
  color: #fff;
  padding: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const AccordionTitle = styled.h1`
  margin: 0;
  font-size: 1.2em;
`;

const ResizeButton = styled.button`
  background: none;
  border: none;
  color: #fff;
  cursor: pointer;
  padding: 0 5px;
`;

const Separator = styled.div`
  border-top: 1px solid #000;
`;

const AccordionContent = styled.div`
  opacity: 0;
  height: 0;
  overflow: hidden;
  transition: opacity 0.3s ease, height 0.8s ease;
  padding: 20px;

  ${(props) =>
    props.isOpen &&
    css`
      opacity: 1;
      height: auto;
    `}
`;

const VictimInfoDiv = styled.div`
  p {
    margin: 5px;
  }
`;

const Playing = () => {
    const scenario = useScenarioStore((state) => state.scenario);
    const [activeTab, setActiveTab] = useState(GAME_TABS.PROLOGUE);

    const changeActiveTab = (tab) => {
        const actived = Object.values(GAME_TABS).find(value => value === tab) ?? GAME_TABS.PROLOGUE;
        setActiveTab(actived);
    }

    return (
        scenario &&
        <AccordionContainer>
            <AccordionItem>
                <AccordionHeader onClick={() => changeActiveTab(GAME_TABS.PROLOGUE)}>
                    <AccordionTitle>Prologue</AccordionTitle>
                    <ResizeButton aria-label="Resize"></ResizeButton>
                </AccordionHeader>
                <Separator />
                <AccordionContent isOpen={activeTab === GAME_TABS.PROLOGUE}>
                    <h1>{scenario.title}</h1>
                    <p>{scenario.prologue}</p>
                    <Separator />
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
                    <Separator />
                    <h2>CRIME SCENE</h2>
                    <p>{scenario.crimeScene}</p>
                </AccordionContent>
            </AccordionItem>
            <AccordionItem>
                <AccordionHeader onClick={() => changeActiveTab(GAME_TABS.SUSPECTS)}>
                    <AccordionTitle>Suspects - interview</AccordionTitle>
                    <ResizeButton aria-label="Resize"></ResizeButton>
                </AccordionHeader>
                <Separator />
                <AccordionContent isOpen={activeTab === GAME_TABS.SUSPECTS}>
                    <p>Click suspect..</p>
                    {scenario.suspects.map((suspect, index) =>
                        <Suspect key={index} info={suspect} />
                    )}
                </AccordionContent>
            </AccordionItem>
            <AccordionItem>
                <AccordionHeader onClick={() => changeActiveTab(GAME_TABS.WATSON)}>
                    <AccordionTitle>Watson - helpful assistant</AccordionTitle>
                    <ResizeButton aria-label="Resize"></ResizeButton>
                </AccordionHeader>
                <Separator />
                <AccordionContent style={{ textAlign: "center" }} isOpen={activeTab === GAME_TABS.WATSON}>
                    <Watson />
                </AccordionContent>
            </AccordionItem>
            <AccordionItem>
                <AccordionHeader onClick={() => changeActiveTab(GAME_TABS.GUESSING)}>
                    <AccordionTitle>I got it!!!</AccordionTitle>
                    <ResizeButton aria-label="Resize"></ResizeButton>
                </AccordionHeader>
                <Separator />
                <AccordionContent isOpen={activeTab === GAME_TABS.GUESSING}>
                    <Guessing suspects={scenario.suspects} />
                </AccordionContent>
            </AccordionItem>
        </AccordionContainer>
    );
};

export default Playing;