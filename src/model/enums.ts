export const GAME_STATUS = {
    INIT: 'init',
    LOADING: 'loading',
    PLAYING: 'playing',
    FINISH: 'finish'
} as const;

export type GameStatus = typeof GAME_STATUS[keyof typeof GAME_STATUS];

export const GAME_TABS = {
    PROLOGUE: 'prologue',
    WATSON: 'watson',
    SUSPECTS: 'suspects',
    GUESSING: 'guessing',
    EPILOGUE: 'epilogue'
} as const;

export type GameTab = typeof GAME_TABS[keyof typeof GAME_TABS];

export const CHAT_TYPE = {
    WATSON: 'watson',
    SUSPECT: 'suspect',
    GUESSING: 'guessing'
} as const;

export type ChatType = typeof CHAT_TYPE[keyof typeof CHAT_TYPE]; 