import React from 'react';
import {useState} from "react";
import WatsonSurvey from "./WatsonSurvey";
import useScenarioStore from "../store/scenarioStore";
import useGameStore from "../store/gameStore";
import {useChatGpt} from "../hooks/useChatGpt";
import {getWatsonSystemMessage} from "../prompt/prompt";
import styled from "styled-components";

const WatsonContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`

const WatsonAscii = styled.pre`
  cursor: pointer;
  margin: 0;
  font-family: monospace;
  text-align: center;
  display: flex;
  justify-content: center;
  width: 100%;
`

const Watson = () => {
    const [onSurvey, setOnSurvey] = useState(false);
    const { apiKey, watsonChatHistory, updateWatsonChatHistory } = useGameStore();
    const scenario = useScenarioStore((state) => state.scenario);
    const {count, chat} = useChatGpt(apiKey, getWatsonSystemMessage(scenario));

    const messages = watsonChatHistory;
    const setMessages = updateWatsonChatHistory;

    return (
        <WatsonContainer>
            <WatsonAscii>
                <code onClick={() => setOnSurvey(true)}>{`
  ___
/     \\
/_______\\
/      \\
/        \\
|  |    |  |
\\  \\__/  /
\\______/
\\\\||//
\\\\||//
.----\\\\||//----.
(     /\\\\  /\\\\     )
(    /  \\\\/  \\\\    )
(   /    ||    \\\\   )
(  /     ||     \\\\  )
( /      ||      \\\\ )
(<       ||       >)
\\\\      ||      /
\\\\____/\\\\____/
`}
                </code>
            </WatsonAscii>
            <h3>What shall we investigate, detective?</h3>
            <p>crime scene investigation, surrounding investigation, etc..</p>
            {onSurvey &&
                <WatsonSurvey messages={messages} setMessages={setMessages} offSurvey={() => setOnSurvey(false)}
                              chat={chat} count={count}/>}
        </WatsonContainer>
    );
};

export default Watson;