import React, {useContext, useState} from 'react';
import {GAME_STATUS} from "../model/enums";
import {ChatOpenAI} from "langchain/chat_models/openai";
import {ApiKeyContext} from "../context/ApiKeyContextProvider";
import {ScenarioContext} from "../context/ScenarioContextProvider";
import {ScenarioParser} from "../model/ScenarioScheme";
import testScenario from "../test_scenario.json";
import {getGameScreenWriterPrompt} from "../prompt/prompt";

const Main = ({setGameStatus}) => {

    const {apiKey, updateApiKey} = useContext(ApiKeyContext)
    const {updateScenario} = useContext(ScenarioContext)
    const [background, setBackground] = useState("")

    const handlePlayBtn = async (e) => {
        setGameStatus(GAME_STATUS.LOADING);

        if (apiKey === "test") {
            updateScenario(testScenario);
            setGameStatus(GAME_STATUS.PLAYING);
            return;
        }
        const chat = new ChatOpenAI({openAIApiKey: apiKey, temperature: 0.8});

        try {
            console.log("start generate");
            const prompt = await getGameScreenWriterPrompt(background);
            console.log("prompt ok");
            const scenario = (await chat.generatePrompt([prompt])).generations[0][0].text;
            console.log(scenario);
            const scenarioJson = await ScenarioParser.parse(scenario);
            console.log("scenario parse ok");
            updateScenario(scenarioJson);
            setGameStatus(GAME_STATUS.PLAYING);
        } catch (e) {
            window.alert("game boot failed. please retry.");
            setGameStatus(GAME_STATUS.INIT);
        }
    }

    return (
        <div>
            <h1>AI DETECTIVE GAME</h1>
            <h2>100% AI generated game powered by chatGPT</h2>
            <p>You're a detective investigating a murder case</p>
            <div>
                <p>You can set the background for the scenario you're investigating if you want</p>
                <label>scenario background</label>
                <input type={"text"} placeholder={"ex> school, office, airplane, chosun dynasty..?"} value={background}
                       onChange={(e) => setBackground(e.target.value)}/>
            </div>
            <div>
                <label>api key</label>
                <input type={"text"} placeholder={"sk-xxxx.."} value={apiKey}
                       onChange={(e) => updateApiKey(e.target.value)}/>
            </div>
            <button type={"button"} onClick={handlePlayBtn}>play!</button>
        </div>
    );
};

export default Main;