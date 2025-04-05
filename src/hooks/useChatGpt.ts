import { useEffect, useRef } from "react";
import { ChatOpenAI } from "@langchain/openai";
import { AIMessage, HumanMessage, SystemMessage } from "@langchain/core/messages";

export interface ChatMessage {
    type: 'user' | 'assistant' | 'error' | string;
    message: string;
}

interface UseChatGptReturn {
    chat: (message: string, chatHistory?: ChatMessage[]) => Promise<string | null>;
}

export const useChatGpt = (
    apiKey: string,
    systemMessage: string,
    temperature: number = 0.8
): UseChatGptReturn => {
    const model = useRef<ChatOpenAI | null>(null);

    useEffect(() => {
        if (apiKey === '') return;
        model.current = new ChatOpenAI({
            temperature: temperature,
            openAIApiKey: apiKey,
            model: "gpt-4o-mini-2024-07-18"
        });
    }, [apiKey, temperature]);

    const executeHumanQuestion = async (
        message: string,
        chatHistory: ChatMessage[] = []
    ): Promise<string | null> => {
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

            if (!model.current) {
                throw new Error('Chat model not initialized');
            }

            const response = await model.current.invoke(messages);
            console.log(`chat ok. ${response.content}`);
            return typeof response.content === 'string' ? response.content : null;
        } catch (e) {
            console.error(e);
            return null;
        } finally {
            if (messages && model.current) {
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
}; 