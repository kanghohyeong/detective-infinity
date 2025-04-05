import React, { useState } from 'react';
import { GAME_STATUS } from '../model/enums';
import useScenarioStore from "../store/scenarioStore";
import { ScenarioScheme } from "../model/ScenarioScheme";
import testScenario from "../test_scenario.json";
import { getStoryWriterSystemMessage } from "../prompt/prompt";
import { useChatGpt } from "../hooks/useChatGpt";
import { ChatOpenAI } from "@langchain/openai";
import useGameStore from "../store/gameStore";
import styles from '../styles/Main.module.css';

const Main: React.FC = () => {
    const { apiKey, updateApiKey } = useGameStore();
    const updateScenario = useScenarioStore((state) => state.updateScenario);
    const [background, setBackground] = useState<string>("");
    const [language, setLanguage] = useState<string>("English");
    const { chat: writerChat } = useChatGpt(apiKey, getStoryWriterSystemMessage(language));
    const { setGameStatus, setProgress } = useGameStore();

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
            let writerChatHistory: { type: string; message: string }[] = [];

            const victim = await writerChat(`From now on, let's make a story in order according to my request step by step considering the following keywords.
        keywords : ${background}
        First, Define the victim. The victim's name, age, personality, occupation, appearance etc`, writerChatHistory);
            if (victim === null) {
                throw new Error("Failed to generate victim information");
            }
            writerChatHistory = [...writerChatHistory, {
                type: 'user', message: `From now on, let's make a story in order according to my request step by step considering the following keywords.
        keywords : ${background}
        First, Define the victim. The victim's name, age, personality, occupation, appearance etc`}, { type: 'assistant', message: victim }];
            setProgress(20);

            const suspects = await writerChat(`Define the suspect. There are a total of four suspects. Name, personality, age, occupation, appearance etc. of the suspect. Every suspect must have an motive for murder the victim.`, writerChatHistory);
            if (suspects === null) {
                throw new Error("Failed to generate suspects information");
            }
            writerChatHistory = [...writerChatHistory, { type: 'user', message: `Define the suspect. There are a total of four suspects. Name, personality, age, occupation, appearance etc. of the suspect. Every suspect must have an motive for murder the victim.` }, { type: 'assistant', message: suspects }];
            setProgress(35);

            const murderer = await writerChat('Define one killer who actually committed a murder among the suspects defined above. Describe the method of murder, the trick to escape the suspect, and the loophole in the trick. The loophole in deception should not be due to evidence such as cctv, dna, but rather the logical error of the alibi claimed by the killer or traces left at the crime scene.', writerChatHistory);
            if (murderer === null) {
                throw new Error("Failed to generate murderer information");
            }
            writerChatHistory = [...writerChatHistory, { type: 'user', message: 'Define one killer who actually committed a murder among the suspects defined above. Describe the method of murder, the trick to escape the suspect, and the loophole in the trick. The loophole in deception should not be due to evidence such as cctv, dna, but rather the logical error of the alibi claimed by the killer or traces left at the crime scene.' }, { type: 'assistant', message: murderer }];
            setProgress(50);

            const story = await writerChat('Describe the story, alibi, of the other three suspects, excluding the murderer, among the four suspects defined above. The suspects had a chance to commit the crime and a motive for the murder, but they did not actually kill.', writerChatHistory);
            if (story === null) {
                throw new Error("Failed to generate suspects' stories");
            }
            writerChatHistory = [...writerChatHistory, { type: 'user', message: 'Describe the story, alibi, of the other three suspects, excluding the murderer, among the four suspects defined above. The suspects had a chance to commit the crime and a motive for the murder, but they did not actually kill.' }, { type: 'assistant', message: story }];
            setProgress(75);

            const model = new ChatOpenAI({
                openAIApiKey: apiKey,
                temperature: 0,
                model: "gpt-4o-mini-2024-07-18"
            }).withStructuredOutput(ScenarioScheme);

            const scenarioJson = await model.invoke(`
                Based on the following story elements, generate a structured scenario in ${language}:
                
                Victim: ${victim}
                ----
                Suspects: ${suspects}
                ----
                Murderer: ${murderer}
                ----
                Suspects' Stories: ${story}
            `);

            console.log(`scenario parse ok - ${JSON.stringify(scenarioJson)}`);
            setProgress(100);
            updateScenario(scenarioJson);
            setGameStatus(GAME_STATUS.PLAYING);

        } catch (e) {
            console.error(e);
            window.alert("game boot failed. please retry.");
            setGameStatus(GAME_STATUS.INIT);
            setProgress(0);
        }
    };

    return (
        <div className={styles.mainContainer}>
            <img
                className={styles.titleImage}
                src={`${process.env.PUBLIC_URL}/assets/detective-infinity-title-black.png`}
                alt="Detective Infinity"
            />
            <h2>Unleash your inner Sherlock Holmes in an Al-powered mystery adventure!</h2>
            <p>You become a detective and investigate a murder case.</p>
            <p>Nobody knows the truth of the case. Every time you face a new incident that no one has ever seen.</p>
            <div className={styles.inputContainer}>
                <div className={styles.titleBar}>
                    <h1 className={styles.title}>API KEY</h1>
                </div>
                <div className={styles.separator} />
                <p>You need OpenAi API Key. You can create API Key <a
                    href="https://platform.openai.com/account/api-keys">HERE</a></p>
                <input type="text" placeholder="sk-xxxx.." value={apiKey}
                    onChange={(e) => updateApiKey(e.target.value)} />
            </div>
            <div className={styles.inputContainer}>
                <div className={styles.titleBar}>
                    <h1 className={styles.title}>CUSTOM SCENE ( optional )</h1>
                </div>
                <div className={styles.separator} />
                <p>You can set the background for the case you're investigating if you want</p>
                <input type="text" placeholder="ex> school, office, airplane, chosun dynasty..?" value={background}
                    onChange={(e) => setBackground(e.target.value)} />
            </div>
            <div className={styles.inputContainer}>
                <div className={styles.titleBar}>
                    <h1 className={styles.title}>LANGUAGE ( optional )</h1>
                </div>
                <div className={styles.separator} />
                <p>Select the language for the game (e.g., English, Korean, Japanese)</p>
                <input type="text" placeholder="ex> English, Korean, Japanese" value={language}
                    onChange={(e) => setLanguage(e.target.value)} />
            </div>
            <button className={styles.startBtn} type="button" onClick={handlePlayBtn}>START</button>
        </div>
    );
};

export default Main; 