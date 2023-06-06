import React, {createContext, useState} from 'react';

export const ApiKeyContext = createContext(null);

export const ApiKeyProvider = ({children}) => {
    const [apiKey, setApiKey] = useState('');

    const updateApiKey = (newApiKey) => {
        setApiKey(newApiKey);
    };

    return (
        <ApiKeyContext.Provider value={{apiKey, updateApiKey}}>
            {children}
        </ApiKeyContext.Provider>
    );
};