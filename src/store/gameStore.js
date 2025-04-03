import { create } from 'zustand';
import { GAME_STATUS } from '../model/enums';

const useGameStore = create((set) => ({
    gameStatus: GAME_STATUS.INIT,
    progress: 0,
    apiKey: '',
    suspectChatHistory: {},
    watsonChatHistory: [],
    guessingHistory: [],
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
    updateGuessingHistory: (history) => set({ guessingHistory: history })
}));

export default useGameStore; 