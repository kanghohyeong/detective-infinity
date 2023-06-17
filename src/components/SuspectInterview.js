import React from 'react';
import {useEffect, useRef, useState} from "react";
import Modal from "./Modal";
import styled from "styled-components";

const InterviewForm = styled.form`
  input {
    width: 80%;
    border: 1px solid black;
  }

  p {
    margin: 0;
  }
`

const InterviewChatDiv = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;

  strong {
    border: 1px solid #000000;
    width: 100px;
    flex-shrink: 0;
    background: ${({type}) => (type === 'user' ? 'white' : '#2f4f4f')};
    color: ${({type}) => (type === 'user' ? 'black' : 'white')};
  }

  span {
    text-align: left;
    width: 100%;
    margin-left: 5px;
  }
`

const SuspectInterview = ({name, messages, setMessages, offInterview, chat, count}) => {

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

        const interviewQuestion = `
        Interviewee: ${name} 
        Question: ${input}`;
        const aiMessage = await chat(interviewQuestion);
        if (aiMessage == null) {
            setMessages(currentMessages.concat({type: "error", message: "AI Error"}));
        } else {
            setMessages(currentMessages.concat({type: name, message: aiMessage}));
        }
        setWaiting(false);
        setInput('');
    }

    return (
        <Modal offModal={offInterview} title={`interview-${name}`}>
            <div className="chat">
                <div className="chat-messages">
                    {messages.map((msg, index) => (
                        <InterviewChatDiv type={msg.type} key={index}>
                            <strong>{msg.type}</strong> <span>{msg.message}</span>
                        </InterviewChatDiv>
                    ))}
                    <div ref={endOfMessages}></div>
                </div>
                <InterviewForm className={"field-row"} onSubmit={handleSend}>
                    <input value={input} onChange={e => setInput(e.target.value)}
                           placeholder={count >= 15 ? "No more question" : "Type a interview question"}
                           disabled={waiting}/>
                    <button className={"btn"}  type="submit"
                            disabled={waiting || count >= 15}>Send
                    </button>
                </InterviewForm>
                <div className={"field-row" }>Questions : {count}/15</div>
            </div>
        </Modal>
    );
};

export default SuspectInterview;