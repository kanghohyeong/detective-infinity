import React, {createContext, useState} from 'react';

export const ScenarioContext = createContext(null);

export const ScenarioProvider = ({children}) => {
    const [scenario, setScenario] = useState(null);

    const updateScenario = (scenarioJson) => {
        setScenario(scenarioJson);
    };

    return (
        <ScenarioContext.Provider value={{scenario, updateScenario}}>
            {children}
        </ScenarioContext.Provider>
    );
};