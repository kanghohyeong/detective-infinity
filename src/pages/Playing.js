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
`;

const AccordionHeader = styled.div`
  cursor: pointer;
`;

const AccordionContent = styled.div`
  opacity: 0;
  height: 0;
  overflow: hidden;
    // display: ${({ isOpen }) => (isOpen ? 'block' : 'none')};

  transition: opacity 0.3s ease, height 0.8s ease;

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
`

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
            <AccordionItem key={1} className={"window"}>
                <AccordionHeader className={"title-bar"}
                    onClick={() => changeActiveTab(GAME_TABS.PROLOGUE)}>
                    <h1 className={"title"}>Prologue</h1>
                    <button aria-label="Resize" className="resize"></button>
                </AccordionHeader>
                <div className="separator"></div>
                <AccordionContent className={"window-pane"} isOpen={activeTab === GAME_TABS.PROLOGUE}>
                    <h1>{scenario.title}</h1>
                    <p>{scenario.prologue}</p>
                    <div className="separator"></div>
                    <h2>VICTIM</h2>
                    <h3>{scenario.victim.name} / {scenario.victim.age} / {scenario.victim.gender}</h3>
                    <VictimInfoDiv className={"modeless-dialog"}>
                        <span className={"modeless-text field-row"}>occupation</span>
                        <p>{scenario.victim.occupation}</p>
                        <span className={"modeless-text field-row"}>appearance</span>
                        <p>{scenario.victim.appearance}</p>
                        <span className={"modeless-text field-row"}>description</span>
                        <p>{scenario.victim.description}</p>
                        <span className={"modeless-text field-row"}>cause of death</span>
                        <p>{scenario.victim.causeOfDeath}</p>
                    </VictimInfoDiv>
                    <div className="separator"></div>
                    <h2>CRIME SCENE</h2>
                    <p>{scenario.crimeScene}</p>
                </AccordionContent>
            </AccordionItem>
            <AccordionItem key={2} className={"window"}>
                <AccordionHeader className={"title-bar"}
                    onClick={() => changeActiveTab(GAME_TABS.SUSPECTS)}>
                    <h1 className={"title"}>Suspects - interview</h1>
                    <button aria-label="Resize" className="resize"></button>
                </AccordionHeader>
                <div className="separator"></div>
                <AccordionContent className={"window-pane"} isOpen={activeTab === GAME_TABS.SUSPECTS}>
                    <p>Click suspect..</p>
                    {scenario.suspects.map((suspect, index) =>
                        <Suspect key={index} info={suspect} />
                    )}
                </AccordionContent>
            </AccordionItem>
            <AccordionItem key={3} className={"window"}>
                <AccordionHeader className={"title-bar"}
                    onClick={() => changeActiveTab(GAME_TABS.WATSON)}>
                    <h1 className={"title"}>Watson - helpful assistant</h1>
                    <button aria-label="Resize" className="resize"></button>
                </AccordionHeader>
                <div className="separator"></div>
                <AccordionContent className={"window-pane"} style={{ textAlign: "center" }}
                    isOpen={activeTab === GAME_TABS.WATSON}>
                    <Watson />
                </AccordionContent>
            </AccordionItem>
            <AccordionItem key={4} className={"window"}>
                <AccordionHeader className={"title-bar"}
                    onClick={() => changeActiveTab(GAME_TABS.GUESSING)}>
                    <h1 className={"title"}>I got it!!!</h1>
                    <button aria-label="Resize" className="resize"></button>
                </AccordionHeader>
                <div className="separator"></div>
                <AccordionContent className={"window-pane"} isOpen={activeTab === GAME_TABS.GUESSING}>
                    <Guessing suspects={scenario.suspects} />
                </AccordionContent>
            </AccordionItem>
        </AccordionContainer>
    );
};

export default Playing;