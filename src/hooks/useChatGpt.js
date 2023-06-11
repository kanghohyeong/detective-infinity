import {useEffect, useRef, useState} from "react";
import {ChatOpenAI} from "langchain/chat_models/openai";
import {AIChatMessage, HumanChatMessage, SystemChatMessage} from "langchain/schema";

export const useChatGpt = (apiKey, systemMessage, temperature = 0.8) => {
    const chatLog = useRef([new SystemChatMessage(systemMessage)]);
    const [chatCnt, setChatCnt] = useState(0);
    const model = useRef(null);

    useEffect(() => {
        if (apiKey === '') return;
        model.current = new ChatOpenAI({
            temperature: temperature,
            openAIApiKey: apiKey
        });
    }, [apiKey, temperature]);

    const executeHumanQuestion = async (message) => {
        try {
            chatLog.current.push(new HumanChatMessage(message));
            const response = await model.current.call(chatLog.current);
            console.log(`chat ok. ${response.text}`);
            chatLog.current.push(new AIChatMessage(response.text));
            setChatCnt(chatCnt + 1);
            return response.text;
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