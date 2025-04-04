import React from 'react';
import Suspect from "./Suspect";

const Suspects = ({ suspects }) => {
    return (
        <>
            <p>Click suspect..</p>
            {suspects.map((suspect, index) =>
                <Suspect key={index} info={suspect} />
            )}
        </>
    );
};

export default Suspects; 