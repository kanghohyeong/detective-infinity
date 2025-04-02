import React from 'react';
import {useState} from "react";
import WatsonSurvey from "./WatsonSurvey";
import {useContext} from "react";
import {ApiKeyContext} from "../context/ApiKeyContextProvider";
import useScenarioStore from "../store/scenarioStore";
import {useChatGpt} from "../hooks/useChatGpt";
import {getWatsonSystemMessage} from "../prompt/prompt";

const Watson = () => {

    const [onSurvey, setOnSurvey] = useState(false);
    const [messages, setMessages] = useState([]);
    const {apiKey} = useContext(ApiKeyContext);
    const scenario = useScenarioStore((state) => state.scenario);
    const {count, chat} = useChatGpt(apiKey, getWatsonSystemMessage(scenario));

    return (
        <div>
            <pre>
                <code style={{cursor: "pointer"}}
                      onClick={() => setOnSurvey(true)}>{`
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
            </pre>
            <h3>What shall we investigate, detective?</h3>
            <p>crime scene investigation, surrounding investigation, etc..</p>
            {onSurvey &&
                <WatsonSurvey messages={messages} setMessages={setMessages} offSurvey={() => setOnSurvey(false)}
                              chat={chat} count={count}/>}
        </div>
    );
};

export default Watson;