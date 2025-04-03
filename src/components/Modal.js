import React from 'react';
import styles from '../styles/components/Modal.module.css';

const Modal = ({children, offModal, title = "title"}) => {
    const closeModal = (e) => {
        e.stopPropagation();
        offModal();
    }

    return (
        <div className={styles.overlay} onClick={closeModal}>
            <div className={styles.modal} onClick={(e) => {
                e.stopPropagation();
            }}>
                <div className={styles.innerBorder}>
                    <div className={styles.modalContents}>
                        <h1 className={styles.modalTitle}>{title}</h1>
                        <div className={styles.separator} />
                        <div className={styles.scrollableContent}>
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Modal;