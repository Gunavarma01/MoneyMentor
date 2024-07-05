// //DataContext.jsx

import { createContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const DataContext = createContext({});

export const DataProvider = ({ children }) => {


    const [loginUserName, setLoginUserName] = useState("");
    const [loginUserPass, setLoginUserPass] = useState("");
    const page = useNavigate();


    
    return (
        <DataContext.Provider value={{
            loginUserName,
            setLoginUserName,
            loginUserPass,
            setLoginUserPass,
            page
        }}>
            {children}
        </DataContext.Provider>
    );
}

export default DataContext;
