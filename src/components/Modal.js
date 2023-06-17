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
  z-index: 100;
`

const Modal = ({children, offModal, title = "title"}) => {

    const closeModal = (e) => {
        e.stopPropagation();
        offModal();
    }

    return (
        <BackgroundPanel onClick={closeModal}>
            <ModalDiv className={"modal-dialog outer-border"} onClick={(e) => {
                e.stopPropagation();
            }}>
                <div className={"inner-border"}>
                    <div className={"modal-contents"}>
                        <h1 className="modal-text">{title}</h1>
                        <div className="separator"></div>
                        <div className={"modeless-dialog"} style={{overflowY: "scroll", maxHeight: "500px"}}>
                            {children}
                        </div>
                    </div>
                </div>
            </ModalDiv>
        </BackgroundPanel>
    );
};

export default Modal;