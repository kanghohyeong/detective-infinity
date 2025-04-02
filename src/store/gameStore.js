import { create } from 'zustand';
import { GAME_STATUS } from '../model/enums';

const useGameStore = create((set) => ({
    gameStatus: GAME_STATUS.INIT,
    progress: 0,
    setGameStatus: (status) => set({ gameStatus: status }),
    setProgress: (progress) => set({ progress }),
    finishGame: () => set({ gameStatus: GAME_STATUS.FINISH }),
}));

export default useGameStore; 