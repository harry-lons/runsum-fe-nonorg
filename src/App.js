import React, { Component } from 'react';
import './App.scss';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Footer from './pages/std/footer';
import Landing from './pages/Landing';
import NeedLogin from './pages/needLogin';
import Results from './pages/Results';
import Remembered from './pages/Remembered'
import FAQ from './pages/FAQ';
import AuthContext from './AuthContext';

class App extends Component {
  render() {
    return (
      <AuthContext>
        <div className="App">
          <Routes>
            <Route path="/" element={<Home />
            } />
            <Route path="/about" element={<About />} />
            <Route
              path="/landing"
              element={<Landing/>}
            />
            <Route path="/needlogin" element={<NeedLogin />} />
            <Route
              path="/results"
              element={<Results/>}
            />
            <Route
              path="/remembered"
              element={<Remembered />}
            />
            <Route
              path="/FAQ"
              element={<FAQ />}
            />
          </Routes>
          <Footer /> {/* Place Footer outside of Routes to appear on every page */}
        </div>
      </AuthContext>
    );
  }
}

export default App;
