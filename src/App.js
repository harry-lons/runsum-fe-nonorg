import React, { Component } from 'react';
import './App.scss';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Footer from './pages/std/footer';
import Landing from './pages/Landing';
import NeedLogin from './pages/needLogin';
import Results from './pages/Results';
import FAQ from './pages/FAQ';

class App extends Component {
  state = {
    accessToken: "",
  };
  setAccessToken = (newToken) => {
    console.log("setting access token");
    this.setState({ accessToken: newToken });
  };
  getAccessToken = () => {
    return this.state.accessToken;
  }
  // Handle logout by sending an empty request to the logout endpoint which will clear the cookie for us
  logout = () => {
    console.log('logging out');
    window.location.href = '/';
    let payload = {};
    let endpointURL = process.env.REACT_APP_BACKEND_URL + '/logout';
    return fetch(endpointURL, {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
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

  render() {
    const { accessToken } = this.state;
    return (
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route
            path="/landing"
            element={<Landing logout={this.logout} setAccessToken={this.setAccessToken} getAccessToken={this.getAccessToken} />}
          />
          <Route path="/needlogin" element={<NeedLogin />} />
          <Route
            path="/results"
            element={<Results logout={this.logout} getAccessToken={this.getAccessToken} />}
          />
          <Route
            path="/FAQ"
            element={<FAQ />}
          />
        </Routes>
        <Footer /> {/* Place Footer outside of Routes to appear on every page */}
      </div>
    );
  }
}

export default App;
