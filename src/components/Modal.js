import React from 'react';
import styled from "styled-components";

const BackgroundPanel = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
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
  z-index: 100;
  border: 1px solid #333333;
  background-color: #2d2d2d;
  border-radius: 4px;
`

const InnerBorder = styled.div`
  border: 1px solid #333333;
  padding: 10px;
`

const ModalContents = styled.div`
  padding: 10px;
  color: #ffffff;
`

const ModalTitle = styled.h1`
  margin: 0;
  font-size: 1.2em;
  color: #ffffff;
`

const Separator = styled.div`
  border-top: 1px solid #333333;
  margin: 10px 0;
`

const ScrollableContent = styled.div`
  overflow-y: scroll;
  max-height: 500px;
  color: #ffffff;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #2d2d2d;
  }

  &::-webkit-scrollbar-thumb {
    background: #4d4d4d;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #5d5d5d;
  }
`

const Modal = ({children, offModal, title = "title"}) => {
    const closeModal = (e) => {
        e.stopPropagation();
        offModal();
    }

    return (
        <BackgroundPanel onClick={closeModal}>
            <ModalDiv onClick={(e) => {
                e.stopPropagation();
            }}>
                <InnerBorder>
                    <ModalContents>
                        <ModalTitle>{title}</ModalTitle>
                        <Separator />
                        <ScrollableContent>
                            {children}
                        </ScrollableContent>
                    </ModalContents>
                </InnerBorder>
            </ModalDiv>
        </BackgroundPanel>
    );
};

export default Modal;