
import Button from '@mui/material/Button';
import StravaButtonIcon from './std/StravaButtonIcon.svg';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from "react";

function Home(props) {
    const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
    const CALLBACK_DOMAIN = process.env.REACT_APP_CALLBACK_DOMAIN;
    const navigate = useNavigate();
    if (!CLIENT_ID || !CALLBACK_DOMAIN) {
        console.log("Missing or misconfigured .env file!");
    }
    let to = "https://www.strava.com/oauth/authorize?client_id=" + CLIENT_ID + "&redirect_uri=" + CALLBACK_DOMAIN + "/landing&response_type=code&scope=activity:read_all";
    console.log(to);

    const validateRefreshToken = async () => {
        let payload = {}
        let endpointURL = process.env.REACT_APP_BACKEND_URL + '/refresh-token';

        try {
            const response = await fetch(endpointURL, {
                method: 'POST',
                body: JSON.stringify(payload),
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                credentials: 'include' // include cookie
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            if (data?.access_token) { // Optional chaining to avoid undefined errors
                console.log("Successfully refreshed token.");
                return data;
                // Do something with the token, like saving it to state or context
            } else {
                console.error("No access token in response (weird)");
                return "";
            }
        } catch (error) {
            console.error('Error during getting new token:', error);
            return "";
        }
    };

    useEffect(() => {
        // validate refresh token if exists
        const fetchToken = async () => {
            const resp = await validateRefreshToken();
            if (resp !== "") {
                props.setAccessToken(resp.access_token);
                props.setFirstName(resp.first_name);
                navigate('/remembered'); 
            }
        };
    
        fetchToken();
    }, [navigate, props]);

    return (
        <div className='home-page'>
            { }
            <Button component={Link} to={to}>
                <img src={StravaButtonIcon} alt="Connect with Strava" />
            </Button>
            <a href='/about'>What is this?</a>
        </div>
    );
}

export default Home;
