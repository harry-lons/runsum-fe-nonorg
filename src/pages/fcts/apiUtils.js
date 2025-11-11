// Get API base URL - use relative path for same-origin deployment
// Falls back to REACT_APP_BACKEND_URL for backward compatibility
const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || '';

// Returns true if the user is authenticated, false otherwise
// used when a user returns and has token in cookie, even if state/context is lost
export function is_authenticated() {
    // send a request to the backend to check if we are authenticated
    let endpointURL = API_BASE_URL + '/api/is-authenticated';
    return fetch(endpointURL, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },
        credentials: 'include' // include cookie
    })
}

// Handle logout by sending an empty request to the logout endpoint which will clear the cookie for us
export const logout = () => {
    window.location.href = '/';
    let payload = {};
    let endpointURL = API_BASE_URL + '/api/auth/logout';
    return fetch(endpointURL, {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },
        credentials: 'include' // include cookie
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
        })
        .catch(error => {
            // Handle errors
            console.error('Error during logout:', error);
        });
};

export async function loginWithCode(codeValue) {
    let payload = {
        code: codeValue,
    };
    let endpointURL = API_BASE_URL + '/api/auth/login';
    try {
        const response = await fetch(endpointURL, {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            credentials: 'include' // include cookie so it can be set
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.error('Error during token exchange:', error);
        return null;
    }
}

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

export async function whoAmI() {
    let endpointURL = API_BASE_URL + '/api/auth/whoami';
    try {
        const response = await fetch(endpointURL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'X-CSRF-TOKEN': getCookie('csrf_access_token'),
            },
            credentials: 'include' // include cookie so it can be sent
        });
        if (!response.ok) {
            // user not authenticated
            return null
        }
        const data = await response.json();
        return data;
    }
    catch (error) {
        console.error('Error during whoami:', error);
        return null;
    }
}