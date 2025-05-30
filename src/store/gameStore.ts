import { create } from 'zustand';
import { GAME_STATUS, CHAT_TYPE, ChatType, GameStatus } from '../model/enums';
import { ChatMessage } from '../hooks/useChatGpt';

interface ChatCounts {
    watson: number;
    suspects: Record<string, number>;
    guessing: number;
}

interface GuessingHistory {
    name: string;
    method: string;
    motive: string;
    evidence: string;
    grade: string;
    hint: string;
}

interface GameState {
    gameStatus: GameStatus;
    progress: number;
    apiKey: string;
    suspectChatHistory: Record<string, ChatMessage[]>;
    watsonChatHistory: ChatMessage[];
    guessingHistory: GuessingHistory[];
    chatCounts: ChatCounts;
    setGameStatus: (status: GameStatus) => void;
    setProgress: (progress: number) => void;
    finishGame: () => void;
    updateApiKey: (newApiKey: string) => void;
    resetGameState: () => void;
    updateSuspectChatHistory: (suspectName: string, messages: ChatMessage[]) => void;
    updateWatsonChatHistory: (messages: ChatMessage[]) => void;
    updateGuessingHistory: (history: GuessingHistory[]) => void;
    incrementChatCount: (type: ChatType, suspectName?: string) => void;
    resetChatCounts: () => void;
}

const useGameStore = create<GameState>((set) => ({
    gameStatus: GAME_STATUS.INIT,
    progress: 0,
    apiKey: '',
    suspectChatHistory: {},
    watsonChatHistory: [],
    guessingHistory: [],
    chatCounts: {
        watson: 0,
        suspects: {},
        guessing: 0
    },
    setGameStatus: (status) => set({ gameStatus: status }),
    setProgress: (progress) => set({ progress }),
    finishGame: () => set({ gameStatus: GAME_STATUS.FINISH }),
    updateApiKey: (newApiKey) => set({ apiKey: newApiKey }),
    resetGameState: () => set({
        suspectChatHistory: {},
        watsonChatHistory: [],
        guessingHistory: [],
        chatCounts: {
            watson: 0,
            suspects: {},
            guessing: 0
        }
    }),
    updateSuspectChatHistory: (suspectName, messages) => set((state) => ({
        suspectChatHistory: {
            ...state.suspectChatHistory,
            [suspectName]: messages
        }
    })),
    updateWatsonChatHistory: (messages) => set({ watsonChatHistory: messages }),
    updateGuessingHistory: (history) => set({ guessingHistory: history }),
    incrementChatCount: (type, suspectName) => set((state) => {
        if (type === CHAT_TYPE.WATSON) {
            return {
                chatCounts: {
                    ...state.chatCounts,
                    watson: state.chatCounts.watson + 1
                }
            };
        } else if (type === CHAT_TYPE.SUSPECT && suspectName) {
            return {
                chatCounts: {
                    ...state.chatCounts,
                    suspects: {
                        ...state.chatCounts.suspects,
                        [suspectName]: (state.chatCounts.suspects[suspectName] || 0) + 1
                    }
                }
            };
        } else if (type === CHAT_TYPE.GUESSING) {
            return {
                chatCounts: {
                    ...state.chatCounts,
                    guessing: state.chatCounts.guessing + 1
                }
            };
        }
        return state;
    }),
    resetChatCounts: () => set({
        chatCounts: {
            watson: 0,
            suspects: {},
            guessing: 0
        }
    })
}));

export default useGameStore; 