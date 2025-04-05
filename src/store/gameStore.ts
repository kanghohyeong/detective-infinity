import { create } from 'zustand';
import { GAME_STATUS } from '../model/enums';

interface ChatCounts {
    watson: number;
    suspects: Record<string, number>;
    guessing: number;
}

interface GameState {
    gameStatus: typeof GAME_STATUS[keyof typeof GAME_STATUS];
    progress: number;
    apiKey: string;
    suspectChatHistory: Record<string, any[]>;
    watsonChatHistory: any[];
    guessingHistory: any[];
    chatCounts: ChatCounts;
    setGameStatus: (status: typeof GAME_STATUS[keyof typeof GAME_STATUS]) => void;
    setProgress: (progress: number) => void;
    finishGame: () => void;
    updateApiKey: (newApiKey: string) => void;
    updateSuspectChatHistory: (suspectName: string, messages: any[]) => void;
    updateWatsonChatHistory: (messages: any[]) => void;
    updateGuessingHistory: (history: any[]) => void;
    incrementChatCount: (type: 'watson' | 'suspect' | 'guessing', suspectName?: string) => void;
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
    updateSuspectChatHistory: (suspectName, messages) => set((state) => ({
        suspectChatHistory: {
            ...state.suspectChatHistory,
            [suspectName]: messages
        }
    })),
    updateWatsonChatHistory: (messages) => set({ watsonChatHistory: messages }),
    updateGuessingHistory: (history) => set({ guessingHistory: history }),
    incrementChatCount: (type, suspectName) => set((state) => {
        if (type === 'watson') {
            return {
                chatCounts: {
                    ...state.chatCounts,
                    watson: state.chatCounts.watson + 1
                }
            };
        } else if (type === 'suspect' && suspectName) {
            return {
                chatCounts: {
                    ...state.chatCounts,
                    suspects: {
                        ...state.chatCounts.suspects,
                        [suspectName]: (state.chatCounts.suspects[suspectName] || 0) + 1
                    }
                }
            };
        } else if (type === 'guessing') {
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