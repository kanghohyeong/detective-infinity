import React from 'react';
import styled from "styled-components";

const BackgroundPanel = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 50;
`

const ModalDiv = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80%;
  max-width: 500px;
  max-height: 70%;
  background-color: #ffffff;
  color: #000000;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.8);
  z-index: 100;
  overflow-y: scroll;
  
  button.close-btn {
    position: absolute;
    right: 10px;
    top: 10px;
    background: black;
    color: white;
    cursor: pointer;
  }
`

const Modal = ({children, offModal}) => {

    const closeModal = (e) => {
        e.stopPropagation();
        offModal();
    }

    return (
        <BackgroundPanel onClick={closeModal}>
            <ModalDiv onClick={(e) => {
                e.stopPropagation();
            }}>
                <button className="close-btn" onClick={closeModal}>x</button>
                {children}
            </ModalDiv>
        </BackgroundPanel>
    );
};

export default Modal;