import React, {useState} from 'react';
import styled from "styled-components";
import SuspectInterview from "./SuspectInterview";
import {useContext} from "react";
import {ApiKeyContext} from "../context/ApiKeyContextProvider";
import useScenarioStore from "../store/scenarioStore";
import {useChatGpt} from "../hooks/useChatGpt";
import {getInterviewSystemMessage} from "../prompt/prompt";

const SuspectDiv = styled.div`
  margin: 10px 0px;
  cursor: pointer;
`

const Suspect = ({info}) => {

    const [onInterview, setOnInterview] = useState(false);
    const [messages, setMessages] = useState([]);
    const {apiKey} = useContext(ApiKeyContext);
    const scenario = useScenarioStore((state) => state.scenario);
    const {count, chat} = useChatGpt(apiKey, getInterviewSystemMessage(info, scenario));

    return (
        <SuspectDiv className={"standard-dialog"} onClick={() => {
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