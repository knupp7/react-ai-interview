import React from 'react'
import { Routes, Route, useLocation } from "react-router-dom";
import Home from './pages/Home'
import Interview from './pages/Interview'
import Contact from './pages/Contact'
import InterviewChat from './pages/InterviewChat'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import './App.css'
import NavBar from './components/NavBar';
import InterviewResult from './pages/InterviewResult'

function App() {
  const location = useLocation();
  const showNav = location.pathname !== "/";

  return (
    <div className="App">
      {showNav && <NavBar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/interview" element={<Interview />} />
        <Route path="/contact" element={<Contact  />} />
        <Route path="/interview/chat" element={<InterviewChat />} /> 
        <Route path="/login" element={<Login />} /> 
        <Route path="/signup" element={<SignUp />} />
        <Route path="/interview/result" element={<InterviewResult />} />
      </Routes>
    </div>
  );
}

export default App
