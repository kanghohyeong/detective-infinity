import React from 'react';
import styles from '../styles/components/Suspect.module.css';
import { Suspect as SuspectType } from '../model/ScenarioScheme';

interface SuspectProps {
    info: SuspectType;
    isSelected: boolean;
    onSelect: () => void;
}

const Suspect: React.FC<SuspectProps> = ({ info, isSelected, onSelect }) => {
    return (
        <div 
            className={`${styles.suspectCard} ${isSelected ? styles.selected : ''}`} 
            onClick={onSelect}
        >
            <p className={styles.suspectInfo}>
                <span className={styles.label}>Name:</span> {info.name}
            </p>
            <p className={styles.suspectInfo}>
                <span className={styles.label}>Gender:</span> {info.gender}
            </p>
            <p className={styles.suspectInfo}>
                <span className={styles.label}>Age:</span> {info.age}
            </p>
            <p className={styles.suspectInfo}>
                <span className={styles.label}>Occupation:</span> {info.occupation}
            </p>
            <p className={styles.suspectInfo}>
                <span className={styles.label}>Appearance:</span> {info.appearance}
            </p>
        </div>
    );
};

export default Suspect; 