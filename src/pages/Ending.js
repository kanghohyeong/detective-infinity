import React, {useContext} from 'react';
import {GAME_STATUS} from "../model/enums";
import {ScenarioContext} from "../context/ScenarioContextProvider";

const Ending = ({setGameStatus}) => {
    const {scenario} = useContext(ScenarioContext);

    return (
        <div>
            <h1>Ending..</h1>
            <h3>Murderer</h3>
            <div>
                <p>name : {scenario.truth.name}</p>
                <p>how : {scenario.truth.how}</p>
                <p>why : {scenario.truth.why}</p>
                <p>trick : {scenario.truth.trick}</p>
                <p>story : ${scenario.suspects.find(suspect => suspect.isMurderer).story}</p>
            </div>
            <h3>Suspects</h3>
            {scenario.suspects.filter(suspect => !suspect.isMurderer).map((suspect, index) => (
                <div key={index}>
                    <p>name : {suspect.name}</p>
                    <p>story : {suspect.story}</p>
                </div>
            ))}
            <button type="button" onClick={() => setGameStatus(GAME_STATUS.INIT)}>HOME</button>
        </div>
    );
};

export default Ending;