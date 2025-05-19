import React from 'react'
import Home from './pages/Home'
import Interview from './pages/Interview'
import Contact from './pages/Contact'
import InterviewChat from './pages/InterviewChat'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import './App.css'
import NavBar from './components/NavBar';
import { Routes, Route } from 'react-router-dom';
import InterviewResult from './pages/InterviewResult'

function App() {
  return (
    <div className="App">
      <NavBar />
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
