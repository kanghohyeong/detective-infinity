import { useEffect, useRef } from "react";
import { ChatOpenAI } from "@langchain/openai";
import { AIMessage, HumanMessage, SystemMessage } from "@langchain/core/messages";

export const useChatGpt = (apiKey, systemMessage, temperature = 0.8) => {
    const model = useRef(null);

    useEffect(() => {
        if (apiKey === '') return;
        model.current = new ChatOpenAI({
            temperature: temperature,
            openAIApiKey: apiKey,
            model: "gpt-4o-mini-2024-07-18"
        });
    }, [apiKey, temperature]);

    const executeHumanQuestion = async (message, chatHistory = []) => {
        let messages;
        try {
            messages = [
                new SystemMessage(systemMessage),
                ...chatHistory.map(msg => {
                    if (msg.type === 'user') {
                        return new HumanMessage(msg.message);
                    } else {
                        return new AIMessage(msg.message);
                    }
                }),
                new HumanMessage(message)
            ];

            const response = await model.current.invoke(messages);
            console.log(`chat ok. ${response.content}`);
            return response.content;
        } catch (e) {
            console.error(e);
            return null;
        } finally {
            if (messages) {
                model.current.getNumTokensFromMessages(messages)
                    .then(res => {
                        console.log(res.totalCount);
                    });
                console.log(`log size: ${messages.length}`);
            }
        }
    };

    return {
        chat: executeHumanQuestion
    };
}