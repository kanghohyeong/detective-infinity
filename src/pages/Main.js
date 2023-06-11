import React, {useContext, useState} from 'react';
import {GAME_STATUS} from "../model/enums";
import {ApiKeyContext} from "../context/ApiKeyContextProvider";
import {ScenarioContext} from "../context/ScenarioContextProvider";
import {ScenarioParser} from "../model/ScenarioScheme";
import testScenario from "../test_scenario.json";
import {getStoryFormatterSystemMessage, getStoryWriterSystemMessage} from "../prompt/prompt";
import {useChatGpt} from "../hooks/useChatGpt";
import {OutputFixingParser} from "langchain/output_parsers";
import {ChatOpenAI} from "langchain/chat_models/openai";

const Main = ({setGameStatus}) => {

    const {apiKey, updateApiKey} = useContext(ApiKeyContext)
    const {updateScenario} = useContext(ScenarioContext)
    const [background, setBackground] = useState("")
    const {chat: writerChat} = useChatGpt(apiKey, getStoryWriterSystemMessage(background));
    const {chat: formatterChat} = useChatGpt(apiKey, getStoryFormatterSystemMessage(), 0);

    const handlePlayBtn = async () => {
        if (apiKey === '') {
            window.alert("enter api key");
            return;
        }
        setGameStatus(GAME_STATUS.LOADING);

        if (background === "skip generate") {
            updateScenario(testScenario);
            setGameStatus(GAME_STATUS.PLAYING);
            return;
        }

        try {
            console.log("start generate");
            const victim = await writerChat(`From now on, you have to make a story in order according to my request.
First, Define the victim. The victim's name, age, personality, occupation, appearance etc`);
            const suspects = await writerChat(`Define the suspect. There are a total of four suspects. Name, personality, age, occupation, appearance etc. of the suspect. Every suspect must have an motive for murder the victim.`);
            const murderer = await writerChat('Define one killer who actually committed a murder among the suspects defined above. Describe the method of murder, the trick to escape the suspect, and the loophole in the trick. The loophole in deception should not be due to evidence such as cctv, dna, but rather the logical error of the alibi claimed by the killer or traces left at the crime scene.');
            const story = await writerChat('Describe the story, alibi, of the other three suspects, excluding the murderer, among the four suspects defined above. The suspects had a chance to commit the crime and a motive for the murder, but they did not actually kill.');
            const scenario = await formatterChat(`This is story to convert. 
        victim : ${victim}
        ----
        suspects : ${suspects}
        ----
        murderer : ${murderer}
        ----
        suspects story : ${story}
        `);
            console.log(`scenario ok ${scenario}`);
            try {
                const scenarioJson = await ScenarioParser.parse(scenario);
                console.log(`scenario parse ok`);
                updateScenario(scenarioJson);
                setGameStatus(GAME_STATUS.PLAYING);
            } catch (e) {
                console.error("parse error. try fix", e);
                const fixParser = OutputFixingParser.fromLLM(new ChatOpenAI({
                    openAIApiKey: apiKey,
                    temperature: 0
                }), ScenarioParser);
                const fixedOutput = await fixParser.parse(scenario);
                updateScenario(fixedOutput);
                setGameStatus(GAME_STATUS.PLAYING);
            }
        } catch (e) {
            console.error(e);
            window.alert("game boot failed. please retry.");
            setGameStatus(GAME_STATUS.INIT);
        }
    }

    return (
        <div>
            <h1 style={{color: '#8b0000'}}>DETECTIVE INFINITY</h1>
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