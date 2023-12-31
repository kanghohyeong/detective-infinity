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
import styled from "styled-components";

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 1000px;
  min-width: 300px;
  margin: auto;
`

const InputContainer = styled.div`
  width: 80%;
  border: 1px solid #000000;
  padding-bottom: 10px;
  margin-bottom: 20px;
  text-align: center;

  label {
    border: 1px solid #ffffff;
    margin-right: 10px;
  }

  input {
    width: 60%;
  }

  a {
    color: blue;
  }
`

const StartBtn = styled.button`
  width: 100px;
  height: 30px;
`

const Main = ({setGameStatus, setProgress}) => {

    const {apiKey, updateApiKey} = useContext(ApiKeyContext)
    const {updateScenario} = useContext(ScenarioContext)
    const [background, setBackground] = useState("")
    const {chat: writerChat} = useChatGpt(apiKey, getStoryWriterSystemMessage());
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
            const victim = await writerChat(`From now on, let's make a story in order according to my request step by step considering the following keywords.
        keywords : ${background}
        First, Define the victim. The victim's name, age, personality, occupation, appearance etc`);
            setProgress(20);
            const suspects = await writerChat(`Define the suspect. There are a total of four suspects. Name, personality, age, occupation, appearance etc. of the suspect. Every suspect must have an motive for murder the victim.`);
            setProgress(35);
            const murderer = await writerChat('Define one killer who actually committed a murder among the suspects defined above. Describe the method of murder, the trick to escape the suspect, and the loophole in the trick. The loophole in deception should not be due to evidence such as cctv, dna, but rather the logical error of the alibi claimed by the killer or traces left at the crime scene.');
            setProgress(50);
            const story = await writerChat('Describe the story, alibi, of the other three suspects, excluding the murderer, among the four suspects defined above. The suspects had a chance to commit the crime and a motive for the murder, but they did not actually kill.');
            setProgress(75);
            const scenario = await formatterChat(`This is story to convert. 
        victim : ${victim}
        ----
        suspects : ${suspects}
        ----
        murderer : ${murderer}
        ----
        suspects story : ${story}
        `);
            setProgress(85);
            try {
                const scenarioJson = await ScenarioParser.parse(scenario);
                console.log(`scenario parse ok`);
                setProgress(100);
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
            setProgress(0);
        }
    }

    return (
        <MainContainer>
            <h1 style={{color: '#8b0000'}}>DETECTIVE INFINITY</h1>
            <h2>100% AI generated game powered by chatGPT</h2>
            <p>You become a detective and investigate a murder case.</p>
            <p>Nobody knows the truth of the case. Every time you face a new incident that no one has ever seen.</p>
            <InputContainer className={"window"}>
                <div className="title-bar">
                    <h1 className="title">API KEY</h1>
                </div>
                <div className="separator"></div>
                <p>You need OpenAi API Key. You can create API Key <a
                    href="https://platform.openai.com/account/api-keys">HERE</a></p>
                <input type={"text"} placeholder={"sk-xxxx.."} value={apiKey}
                       onChange={(e) => updateApiKey(e.target.value)}/>
            </InputContainer>
            <InputContainer className={"window"}>
                <div className="title-bar">
                    <h1 className="title">CUSTOM SCENE</h1>
                </div>
                <div className="separator"></div>
                <p>You can set the background for the case you're investigating if you want</p>
                <input type={"text"} placeholder={"ex> school, office, airplane, chosun dynasty..?"} value={background}
                       onChange={(e) => setBackground(e.target.value)}/>
            </InputContainer>
            <StartBtn className={"btn"} type={"button"} onClick={handlePlayBtn}>START</StartBtn>
        </MainContainer>
    );
};

export default Main;