import {useEffect, useRef, useState} from "react";
import {ChatOpenAI} from "langchain/chat_models/openai";
import {AIChatMessage, HumanChatMessage, SystemChatMessage} from "langchain/schema";
import {getGameHostSystemPrompt} from "../prompt/prompt";

export function useChatGpt(apiKey, baseScenario) {
    const [chatLog, setChatLog] = useState(null);
    const [chatCnt, setChatCnt] = useState(0);
    const model = useRef(null);

    useEffect(() => {
        if (apiKey === '') return;
        model.current = new ChatOpenAI({
            temperature: 0.9,
            openAIApiKey: apiKey
        });
    }, [apiKey]);

    useEffect(() => {
        if (baseScenario === null) return;
        setChatLog([new SystemChatMessage(getGameHostSystemPrompt(baseScenario))]);
    }, [baseScenario]);

    useEffect(()=>{
        if(model.current == null || chatLog == null) return;
        model.current.getNumTokensFromMessages(chatLog)
            .then(res=>{
                console.log(res.totalCount);
            });
    },[chatLog]);

    const executeHumanQuestion = async (message) => {
        try {
            const response = await model.current.call(chatLog.concat(new HumanChatMessage(message)));
            console.log(`chat ok. ${response.text}`);
            setChatLog(chatLog.concat([new HumanChatMessage(message), new AIChatMessage(response.text)]));
            setChatCnt(chatCnt + 1);
            return response.text;
        } catch (e) {
            console.error(e);
            return null;
        }
    };

    const gptProps = {
        count: chatCnt,
        chat: executeHumanQuestion
    }

    return gptProps;

}