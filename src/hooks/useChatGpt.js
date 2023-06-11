import {useEffect, useRef, useState} from "react";
import {ChatOpenAI} from "langchain/chat_models/openai";
import {AIChatMessage, HumanChatMessage, SystemChatMessage} from "langchain/schema";

export const useChatGpt = (apiKey, systemMessage, temperature = 0.8) => {
    const chatLog = [new SystemChatMessage(systemMessage)];
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
            chatLog.push(new HumanChatMessage(message));
            const response = await model.current.call(chatLog);
            console.log(`chat ok. ${response.text}`);
            chatLog.push(new AIChatMessage(response.text));
            // setChatLog(chatLog.concat([new HumanChatMessage(message), new AIChatMessage(response.text)]));
            setChatCnt(chatCnt + 1);
            return response.text;
        } catch (e) {
            console.error(e);
            return null;
        } finally {
            model.current.getNumTokensFromMessages(chatLog)
                .then(res => {
                    console.log(res.totalCount);
                });
        }
    };

    const gptProps = {
        count: chatCnt,
        chat: executeHumanQuestion
    }

    return gptProps;

}