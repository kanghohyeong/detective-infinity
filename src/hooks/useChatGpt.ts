import { useEffect, useRef } from "react";
import { ChatOpenAI } from "@langchain/openai";
import { AIMessage, HumanMessage, SystemMessage } from "@langchain/core/messages";
import { ZodType } from "zod";

export interface ChatMessage {
    type: 'user' | 'assistant' | 'error' | string;
    message: string;
}

interface UseChatGptReturn {
    chat: (message: string, chatHistory?: ChatMessage[], structuredOutput?: ZodType) => Promise<string | any | null>;
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
            // model: "gpt-4o-2024-11-20"
        });
    }, [apiKey, temperature]);

    const executeHumanQuestion = async (
        message: string,
        chatHistory: ChatMessage[] = [],
        structuredOutput: ZodType | null = null
    ): Promise<any | string | null> => {
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
            console.log('chat start')
            console.log(messages);

            if (!model.current) {
                throw new Error('Chat model not initialized');
            }

            let pipedModel;
            if (structuredOutput !== null) {
                pipedModel = model.current.withStructuredOutput(structuredOutput);
            } else {
                pipedModel = model.current;
            }

            const response = await pipedModel.invoke(messages);
            console.log("chat ok");
            console.log(response);

            return structuredOutput !== null ? response : response.content;
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