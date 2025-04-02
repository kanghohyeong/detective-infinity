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

const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`

const ChatMessages = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`

const FieldRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`

const Button = styled.button`
  padding: 5px 10px;
  background: #000;
  color: #fff;
  border: none;
  cursor: pointer;
  
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
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
            <ChatContainer>
                <ChatMessages>
                    {messages.map((msg, index) => (
                        <InterviewChatDiv type={msg.type} key={index}>
                            <strong>{msg.type}</strong> <span>{msg.message}</span>
                        </InterviewChatDiv>
                    ))}
                    <div ref={endOfMessages}></div>
                </ChatMessages>
                <InterviewForm onSubmit={handleSend}>
                    <FieldRow>
                        <input value={input} onChange={e => setInput(e.target.value)}
                               placeholder={count >= 15 ? "No more question" : "Type a interview question"}
                               disabled={waiting}/>
                        <Button type="submit"
                                disabled={waiting || count >= 15}>Send
                        </Button>
                    </FieldRow>
                </InterviewForm>
                <FieldRow>Questions : {count}/15</FieldRow>
            </ChatContainer>
        </Modal>
    );
};

export default SuspectInterview;