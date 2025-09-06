// src/context/AuthContext.js
import { createContext, useState, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    // Initialize token from localStorage to stay logged in on refresh
    const [token, setToken] = useState(localStorage.getItem('token'));

    const loginAction = (newToken) => {
        setToken(newToken);
        localStorage.setItem('token', newToken);
    };

    const logoutAction = () => {
        setToken(null);
        localStorage.removeItem('token');
    };

    return (
        <AuthContext.Provider value={{ token, loginAction, logoutAction }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use the auth context
export const useAuth = () => {
    return useContext(AuthContext);
};