import { useEffect, useRef, useState } from "react";
import { ChatOpenAI } from "@langchain/openai";
import { AIMessage, HumanMessage, SystemMessage } from "@langchain/core/messages";

export const useChatGpt = (apiKey, systemMessage, temperature = 0.8) => {
    const chatLog = useRef([new SystemMessage(systemMessage)]);
    const [chatCnt, setChatCnt] = useState(0);
    const model = useRef(null);

    useEffect(() => {
        if (apiKey === '') return;
        model.current = new ChatOpenAI({
            temperature: temperature,
            openAIApiKey: apiKey,
            // model: "gpt-4o-2024-08-06"
            model: "gpt-4o-mini-2024-07-18"
        });
    }, [apiKey, temperature]);

    const executeHumanQuestion = async (message) => {
        try {
            chatLog.current.push(new HumanMessage(message));
            const response = await model.current.invoke(chatLog.current);
            console.log(`chat ok. ${response.content}`);
            chatLog.current.push(new AIMessage(response.content));
            setChatCnt(chatCnt + 1);
            return response.content;
        } catch (e) {
            console.error(e);
            return null;
        } finally {
            model.current.getNumTokensFromMessages(chatLog.current)
                .then(res => {
                    console.log(res.totalCount);
                });
            console.log(`log size: ${chatLog.current.length}`);
        }
    };

    const gptProps = {
        count: chatCnt,
        chat: executeHumanQuestion
    }

    return gptProps;
}