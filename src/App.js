import '@sakun/system.css'
import {useEffect} from "react";
import {GAME_STATUS} from "./model/enums";
import Main from "./pages/Main";
import Loading from "./pages/Loading";
import Playing from "./pages/Playing";
import Ending from "./pages/Ending";
import useGameStore from "./store/gameStore";

function App() {
    const { gameStatus } = useGameStore();

    useEffect(() => {
        if (process.env.NODE_ENV === 'production') {
            console.log = function no_console() {
            };
            console.warn = function no_console() {
            };
        }
    }, []);

    return (
        <div className="App">
            {gameStatus === GAME_STATUS.INIT && <Main />}
            {gameStatus === GAME_STATUS.LOADING && <Loading />}
            {gameStatus === GAME_STATUS.PLAYING && <Playing />}
            {gameStatus === GAME_STATUS.FINISH && <Ending />}
        </div>
    );
}

export default App;
