// //DataContext.jsx

import { createContext, useState } from 'react';

const DataContext = createContext({});

export const DataProvider = ({ children }) => {
    const [loginUserName, setLoginUserName] = useState("");
    const [loginUserPass, setLoginUserPass] = useState("");

    return (
        <DataContext.Provider value={{
            loginUserName,
            setLoginUserName,
            loginUserPass,
            setLoginUserPass
        }}>
            {children}
        </DataContext.Provider>
    );
}

export default DataContext;
