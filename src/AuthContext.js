import { createContext, useEffect, useState } from "react";
import { logout, loginWithCode, whoAmI } from './pages/fcts/apiUtils.js';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext(null);

// Unified component to handle all authentication
export default function AuthProvider({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [firstName, setFirstName] = useState("");

    // Try logging in 
    // 1. Try to log in from JWT saved to cookie
    // 2. Else try to log in from code in URL bar (on login to landing page)
    // 3. Else redirect to need login page
    const login = async () => {
        // Try to log in from JWT saved to cookie
        const i_am = await whoAmI().then(data => {
            if (data != null && data['success']) {
                // success
                // console.log(data)
                setFirstName(data['first_name'])
                setIsAuthenticated(true)
                console.log("done setting")
                return true

            }
            else {
                return false
            }
        });

        if (i_am) {
            // we got an auth state from existing token, return early
            return true
        }

        // try getting & using code from url instead
        const searchParams = new URLSearchParams(window.location.search);
        let code = ""
        if (searchParams.has('code')) {
            code = searchParams.get('code');
        }
        else return false // no code found in url

        // console.log("Logging in with code:", code);
        return loginWithCode(code).then(data => {
            if (data && data['success']) {
                // success
                if (data['first_name'] && data['id']) {
                    setFirstName(data['first_name']);
                }
                else throw new Error('Missing first_name or id in login response');

                setIsAuthenticated(true);
                return true;
            } else {
                // code failed
                console.error("logging in with code failed")
                setIsAuthenticated(false);
                setFirstName("");
                return false;
            }
        });
    }

    const navigate = useNavigate()
    useEffect(() => {
        // if we are on the /needlogin page, don't even try to log in
        if (window.location.pathname === "/needlogin") return;

        const doLogin = async () => {
            try {
                const success = await login();
                if(window.location.pathname === "/"){
                    if(success){
                        navigate("/remembered")
                    }
                    else {
                        // do not go to needlogin
                        return true
                    }
                }
                else if (!success) {
                    // prompt the user to go through strava OAUTH again
                    window.location.href = "/needlogin";
                }
            }
            catch (Exception) {
                window.location.href = "/needlogin";
            }
        };

        doLogin()

    }, [navigate]);

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
