import React, {useState} from 'react';
import styled from "styled-components";
import SuspectInterview from "./SuspectInterview";
import useScenarioStore from "../store/scenarioStore";
import useGameStore from "../store/gameStore";
import {useChatGpt} from "../hooks/useChatGpt";
import {getInterviewSystemMessage} from "../prompt/prompt";

const SuspectDiv = styled.div`
  margin: 10px 0px;
  cursor: pointer;
  border: 1px solid #333333;
  padding: 10px;
  background: #3d3d3d;
  color: #ffffff;
  border-radius: 4px;
  transition: background-color 0.2s;

  &:hover {
    background: #4d4d4d;
  }

  p {
    margin: 5px 0;
  }
`

const Suspect = ({info}) => {
    const [onInterview, setOnInterview] = useState(false);
    const { apiKey, suspectChatHistory, updateSuspectChatHistory } = useGameStore();
    const scenario = useScenarioStore((state) => state.scenario);
    const {count, chat} = useChatGpt(apiKey, getInterviewSystemMessage(info, scenario));

    const messages = suspectChatHistory[info.name] || [];
    const setMessages = (newMessages) => updateSuspectChatHistory(info.name, newMessages);

    return (
        <SuspectDiv onClick={() => {
            setOnInterview(true);
        }}>
            <p>name : {info.name}</p>
            <p>gender : {info.gender}</p>
            <p>age : {info.age}</p>
            <p>occupation : {info.occupation}</p>
            <p>appearance : {info.appearance}</p>
            {onInterview &&
                <SuspectInterview name={info.name} messages={messages} setMessages={setMessages}
                                  offInterview={() => setOnInterview(false)} chat={chat} count={count}/>}
        </SuspectDiv>
    );
};

export default Suspect;