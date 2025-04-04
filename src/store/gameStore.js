import { create } from 'zustand';
import { GAME_STATUS } from '../model/enums';

const useGameStore = create((set) => ({
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
    incrementChatCount: (type, suspectName = null) => set((state) => {
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