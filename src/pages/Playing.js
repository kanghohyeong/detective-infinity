import React, { useState } from 'react';
import Suspect from "../components/Suspect";
import useScenarioStore from "../store/scenarioStore";
import { GAME_TABS } from "../model/enums";
import styled from "styled-components";
import Watson from "../components/Watson";
import Guessing from "../components/Guessing";

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #1a1a1a;
  color: #ffffff;
`;

const TabHeader = styled.div`
  display: flex;
  width: 100%;
  border-bottom: 1px solid #333333;
`;

const Tab = styled.div`
  padding: 15px 20px;
  cursor: pointer;
  border-right: 1px solid #333333;
  background: ${props => props.isActive ? '#333333' : '#2d2d2d'};
  color: ${props => props.isActive ? '#ffffff' : '#cccccc'};
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.isActive ? '#333333' : '#3d3d3d'};
  }
`;

const ContentArea = styled.div`
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  background-color: #2d2d2d;
`;

const VictimInfoDiv = styled.div`
  p {
    margin: 5px;
  }
  background-color: #3d3d3d;
  padding: 15px;
  border-radius: 4px;
  border: 1px solid #4d4d4d;
`;

const Playing = () => {
    const scenario = useScenarioStore((state) => state.scenario);
    const [activeTab, setActiveTab] = useState(GAME_TABS.PROLOGUE);

    const changeActiveTab = (tab) => {
        const actived = Object.values(GAME_TABS).find(value => value === tab) ?? GAME_TABS.PROLOGUE;
        setActiveTab(actived);
    }

    const renderContent = () => {
        switch (activeTab) {
            case GAME_TABS.PROLOGUE:
                return (
                    <>
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
                    </>
                );
            case GAME_TABS.SUSPECTS:
                return (
                    <>
                        <p>Click suspect..</p>
                        {scenario.suspects.map((suspect, index) =>
                            <Suspect key={index} info={suspect} />
                        )}
                    </>
                );
            case GAME_TABS.WATSON:
                return <Watson />;
            case GAME_TABS.GUESSING:
                return <Guessing suspects={scenario.suspects} />;
            default:
                return null;
        }
    };

    return (
        scenario &&
        <Container>
            <TabHeader>
                <Tab isActive={activeTab === GAME_TABS.PROLOGUE} onClick={() => changeActiveTab(GAME_TABS.PROLOGUE)}>
                    Prologue
                </Tab>
                <Tab isActive={activeTab === GAME_TABS.SUSPECTS} onClick={() => changeActiveTab(GAME_TABS.SUSPECTS)}>
                    Suspects
                </Tab>
                <Tab isActive={activeTab === GAME_TABS.WATSON} onClick={() => changeActiveTab(GAME_TABS.WATSON)}>
                    Watson
                </Tab>
                <Tab isActive={activeTab === GAME_TABS.GUESSING} onClick={() => changeActiveTab(GAME_TABS.GUESSING)}>
                    I got it!!!
                </Tab>
            </TabHeader>
            <ContentArea>
                {renderContent()}
            </ContentArea>
        </Container>
    );
};

export default Playing;