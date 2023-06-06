import React from 'react';
import {useState} from "react";
import WatsonSurvey from "./WatsonSurvey";

const Watson = () => {

    const [onSurvey, setOnSurvey] = useState(false);
    const [messages, setMessages] = useState([]);

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
            {onSurvey && <WatsonSurvey messages={messages} setMessages={setMessages} offSurvey={()=>setOnSurvey(false)} />}
        </div>
    );
};

export default Watson;