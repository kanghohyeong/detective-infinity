import React, {useContext} from 'react';
import Suspect from "../components/Suspect";
import {ScenarioContext} from "../context/ScenarioContextProvider";

const Playing = props => {

    const {scenario} = useContext(ScenarioContext);

    return (
        <div>
            <h1>{scenario.title}</h1>
            <p>{scenario.prologue}</p>
            <h2>victim</h2>
            <p>{JSON.stringify(scenario.victim)}</p>
            <h2>crime scene</h2>
            <p>{scenario.crimeScene}</p>
            <h2>suspects</h2>
            {scenario.suspects.map((suspect, index) =>
                <Suspect key={index} info={{
                    name: suspect.name,
                    gender: suspect.gender,
                    age: suspect.age,
                    description: suspect.description,
                    alibi: suspect.alibi
                }}/>
            )}
        </div>
    );
};

export default Playing;