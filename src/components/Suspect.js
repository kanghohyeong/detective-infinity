import React, {useState} from 'react';
import styled from "styled-components";
import SuspectInterview from "./SuspectInterview";

const SuspectDiv = styled.div`
  border: 1px solid #ffffff;
  margin: 5px 5px;
  cursor: pointer;
`

const Suspect = ({info}) => {

    const [onInterview, setOnInterview] = useState(false);
    const [messages, setMessages] = useState([]);

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
                                  offInterview={() => setOnInterview(false)}/>}
        </SuspectDiv>
    );
};

export default Suspect;