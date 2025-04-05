export enum GAME_STATUS {
    INIT = "init",
    LOADING = "loading",
    PLAYING = "playing",
    FINISH = "finish"
}

export enum GAME_TABS {
    PROLOGUE = "prologue",
    WATSON = "watson",
    SUSPECTS = "suspects",
    GUESSING = "guessing",
    EPILOGUE = "epilogue"
}

export enum SUSPECT_STATUS {
    UNINTERVIEWED = "uninterviewed",
    INTERVIEWED = "interviewed",
    CONVICTED = "convicted"
}

export enum GUESSING_STATUS {
    UNGUESSED = "unguessed",
    CORRECT = "correct",
    INCORRECT = "incorrect"
} 