import React from 'react';
import {useEffect, useRef, useState} from "react";
import Modal from "./Modal";
import styled from "styled-components";

const SurveyForm = styled.form`
  input {
    width: 80%;
    border: 1px solid black;
  }

  p {
    margin: 0;
  }
`

const SurveyChatDiv = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;

  strong {
    border: 1px solid #000000;
    width: 100px;
    flex-shrink: 0;
    background: ${({type}) => (type === 'user' ? 'white' : '#4682b4')};
    color: ${({type}) => (type === 'user' ? 'black' : 'white')};
  }

  span {
    text-align: left;
    width: 100%;
    margin-left: 5px;
  }
`

const WatsonSurvey = ({messages, setMessages, offSurvey, chat, count}) => {
    // const {executeHumanQuestion, addAIMessage} = useContext(AIChatContext);

    const [input, setInput] = useState('');
    const [waiting, setWaiting] = useState(false);
    const endOfMessages = useRef(null);

    const scrollToBottom = () => {
        endOfMessages.current.scrollIntoView({behavior: 'smooth'});
    }

    useEffect(scrollToBottom, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();

        if (input === '') return;

        const currentMessages = messages.concat({type: 'user', message: input});
        setMessages(currentMessages);
        setWaiting(true);

        const aiMessage = await chat(input);
        if (aiMessage == null) {
            setMessages(currentMessages.concat({type: "error", message: "AI Error"}));
        } else {
            setMessages(currentMessages.concat({type: "watson", message: aiMessage}));
        }
        setWaiting(false);
        setInput('');
    }

    return (
        <Modal offModal={offSurvey}>
            <div className="chat">
                <div className="chat-messages">
                    {messages.map((msg, index) => (
                        <SurveyChatDiv type={msg.type} key={index}>
                            <strong>{msg.type}</strong><span>{msg.message}</span>
                        </SurveyChatDiv>
                    ))}
                    <div ref={endOfMessages}></div>
                </div>
                <SurveyForm className="chat-input" onSubmit={handleSend}>
                    <input value={input} onChange={e => setInput(e.target.value)}
                           placeholder={count >= 15 ? "No more question" : "Type a survey question"}
                           disabled={waiting}/>
                    <button style={{backgroundColor: "#4682b4", color: "#ffffff"}} type="submit"
                            disabled={waiting || count >= 15}>Send
                    </button>
                    <p>Questions : {count}/15</p>
                </SurveyForm>
            </div>
        </Modal>
    );
};

export default WatsonSurvey;