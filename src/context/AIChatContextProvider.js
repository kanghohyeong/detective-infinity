import React, {createContext, useEffect, useRef, useState} from 'react';
import {AIChatMessage, HumanChatMessage, SystemChatMessage} from "langchain/schema";
import {getGameHostSystemPrompt} from "../prompt/prompt";
import {ChatOpenAI} from "langchain/chat_models/openai";

export const AIChatContext = createContext(null);

export const AIChatProvider = ({children, baseScenario, apiKey}) => {
    const [chatLog, setChatLog] = useState(null);
    const model = useRef(null);

    useEffect(() => {
        if (apiKey === '') return;
        model.current = new ChatOpenAI({
            temperature: 0.9,
            openAIApiKey: apiKey
        });
    }, [apiKey]);

    useEffect(() => {
        setChatLog([new SystemChatMessage(getGameHostSystemPrompt(JSON.stringify(baseScenario)))]);
    }, [baseScenario]);

    const addAIMessage = (message) => {
        setChatLog(chatLog.concat(new AIChatMessage(message)));
    };

    const executeHumanQuestion = async (message) => {
        setChatLog(chatLog.concat(new HumanChatMessage(message)));
        const response = await model.current.call(chatLog.concat(new HumanChatMessage(message)));
        console.log(`chat ok. ${response.text}`);
        return response.text;
    };

    return (
        <AIChatContext.Provider value={{chatLog, addAIMessage, executeHumanQuestion}}>
            {children}
        </AIChatContext.Provider>
    );
};