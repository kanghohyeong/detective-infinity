import React from 'react';
import {GAME_STATUS} from "../model/enums";
import useScenarioStore from "../store/scenarioStore";
import useGameStore from "../store/gameStore";

const Ending = () => {
    const scenario = useScenarioStore((state) => state.scenario);
    const { setGameStatus } = useGameStore();

    return (
        <div className={"window"}>
            <div className="title-bar">
                <h1 className="title">Ending..</h1>
            </div>
            <div className="separator"></div>
            <div className={"modeless-dialog"}>
                <h3>Murderer</h3>
                <div>
                    <p>name : {scenario.truth.murderer}</p>
                    <p>how : {scenario.truth.how}</p>
                    <p>why : {scenario.truth.why}</p>
                    <p>trick : {scenario.truth.trick}</p>
                    <p>loophole : {scenario.truth.loophole}</p>
                    <p>story : ${scenario.suspects.find(suspect => suspect.isMurderer).story}</p>
                </div>
                <div className="separator"></div>
                <h3>Suspects</h3>
                {scenario.suspects.filter(suspect => !suspect.isMurderer).map((suspect, index) => (
                    <div key={index} className={"standard-dialog"} style={{marginBottom: "5px"}}>
                        <p>name : {suspect.name}</p>
                        <p>alibi : {suspect.alibi}</p>
                        <p>story : {suspect.story}</p>
                    </div>
                ))}
                <div style={{textAlign:"center", marginTop:"10px"}}>
                    <button className={"btn btn-default"} style={{margin: "auto"}} type="button"
                            onClick={() => setGameStatus(GAME_STATUS.INIT)}>HOME
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Ending;