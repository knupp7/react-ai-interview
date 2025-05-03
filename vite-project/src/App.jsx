import React from 'react'
import Home from './pages/Home'
import Interview from './pages/Interview'
import Contact from './pages/Contact'
import InterviewChat from './pages/InterviewChat'
import './App.css'
import NavBar from './components/NavBar';
import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/interview" element={<Interview />} />
        <Route path="/contact" element={<Contact  />} />
        <Route path="/interview/chat" element={<InterviewChat />} />  
      </Routes>
    </div>
  );
}

export default App
