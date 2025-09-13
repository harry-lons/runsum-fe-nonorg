import { createContext, useEffect, useState } from "react";
import { logout, loginWithCode, whoAmI } from './pages/fcts/apiUtils.js';

export const AuthContext = createContext(null);

// Unified component to handle all authentication
export default function AuthProvider({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [firstName, setFirstName] = useState("");
    const [id, setID] = useState("");

    const login = (code) => {
        console.log("Logging in with code:", code);
        return loginWithCode(code).then(data => {
            if (data && data['success']) {
                // success
                setIsAuthenticated(true);
                if (data['first_name'] && data['id']) {
                    setFirstName(data['first_name']);
                }
                else throw new Error('Missing first_name or id in login response');
                
                return data;
            } else {
                setIsAuthenticated(false);
                setFirstName("");
                // window.location.href = '/needlogin'; // redirect to needlogin page
                return null;
            }
        });
    }

    useEffect(() => {
        // fetch auth context from JWT cookie on mount
        const i_am = whoAmI().then(data => {
            return data;
        });
    }, []);

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated: isAuthenticated,
                firstName: firstName,
                // pass the function to log in with code and log out
                login: login,
                logout: logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
