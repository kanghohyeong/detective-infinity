import React, {useState} from 'react';
import styled from "styled-components";
import SuspectInterview from "./SuspectInterview";
import {useContext} from "react";
import {ApiKeyContext} from "../context/ApiKeyContextProvider";
import {ScenarioContext} from "../context/ScenarioContextProvider";
import {useChatGpt} from "../hooks/useChatGpt";

const SuspectDiv = styled.div`
  border: 1px solid #ffffff;
  margin: 5px 5px;
  cursor: pointer;
`

const Suspect = ({info}) => {

    const [onInterview, setOnInterview] = useState(false);
    const [messages, setMessages] = useState([]);
    const {apiKey} = useContext(ApiKeyContext);
    const {scenario} = useContext(ScenarioContext);
    const {count, chat} = useChatGpt(apiKey, scenario);

    return (
        <SuspectDiv onClick={(e) => {
            setOnInterview(true);
        }}>
            <p>name : {info.name}</p>
            <p>gender : {info.gender}</p>
            <p>age : {info.age}</p>
            <p>description : {info.description}</p>
            <p>alibi : {info.alibi}</p>
            {onInterview &&
                <SuspectInterview name={info.name} messages={messages} setMessages={setMessages}
                                  offInterview={() => setOnInterview(false)} chat={chat} count={count}/>}
        </SuspectDiv>
    );
};

export default Suspect;