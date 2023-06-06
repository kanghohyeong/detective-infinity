const GAME_STATUS = {
    INIT: "init",
    LOADING: "loading",
    PLAYING: "playing",
    FINISH: "finish"
}
Object.freeze(GAME_STATUS);

const GAME_TABS = {
    PROLOGUE: "prologue",
    SUSPECTS: "suspects",
    WATSON: "watson",
    GUESSING: "guessing"
}
Object.freeze(GAME_TABS);

export {GAME_STATUS, GAME_TABS}