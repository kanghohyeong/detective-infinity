import React from 'react';
import {GAME_STATUS} from "../model/enums";
import useScenarioStore from "../store/scenarioStore";
import useGameStore from "../store/gameStore";
import styled from "styled-components";

const Window = styled.div`
  border: 1px solid #333333;
  margin: 20px auto;
  max-width: 800px;
  width: 90%;
  background-color: #2d2d2d;
`

const TitleBar = styled.div`
  background: #333333;
  color: #ffffff;
  padding: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const Title = styled.h1`
  margin: 0;
  font-size: 1.2em;
`

const Separator = styled.div`
  border-top: 1px solid #333333;
`

const Dialog = styled.div`
  padding: 20px;
  background: #2d2d2d;
  color: #ffffff;
`

const StandardDialog = styled.div`
  padding: 10px;
  margin-bottom: 5px;
  border: 1px solid #4d4d4d;
  background-color: #3d3d3d;
`

const ButtonContainer = styled.div`
  text-align: center;
  margin-top: 10px;
`

const Button = styled.button`
  margin: auto;
  padding: 8px 16px;
  background: #4a9eff;
  color: #ffffff;
  border: none;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.2s;
  
  &:hover {
    background: #357abd;
  }
`

const Ending = () => {
    const scenario = useScenarioStore((state) => state.scenario);
    const { setGameStatus } = useGameStore();

    return (
        <Window>
            <TitleBar>
                <Title>Ending..</Title>
            </TitleBar>
            <Separator />
            <Dialog>
                <h3>Murderer</h3>
                <div>
                    <p>name : {scenario.truth.murderer}</p>
                    <p>how : {scenario.truth.how}</p>
                    <p>why : {scenario.truth.why}</p>
                    <p>trick : {scenario.truth.trick}</p>
                    <p>loophole : {scenario.truth.loophole}</p>
                    <p>story : ${scenario.suspects.find(suspect => suspect.isMurderer).story}</p>
                </div>
                <Separator />
                <h3>Suspects</h3>
                {scenario.suspects.filter(suspect => !suspect.isMurderer).map((suspect, index) => (
                    <StandardDialog key={index}>
                        <p>name : {suspect.name}</p>
                        <p>alibi : {suspect.alibi}</p>
                        <p>story : {suspect.story}</p>
                    </StandardDialog>
                ))}
                <ButtonContainer>
                    <Button type="button"
                            onClick={() => setGameStatus(GAME_STATUS.INIT)}>HOME
                    </Button>
                </ButtonContainer>
            </Dialog>
        </Window>
    );
};

export default Ending;