
// Returns true if the user is authenticated, false otherwise
function is_authenticated() {
    // send a request to the backend to check if we are authenticated
    let endpointURL = process.env.REACT_APP_BACKEND_URL + '/is-authenticated';
    return fetch(endpointURL, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },
        credentials: 'include' // include cookie
    })
}