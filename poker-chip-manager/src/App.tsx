import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Game from './pages/Game'
import CreateTable from './pages/CreateTable'
import JoinTable from './pages/JoinTable'
import Lobby from './pages/Lobby'

const App: React.FC = () => {
  const [theme, setTheme] = useState('light')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light')
  }

  return (
    <Router>
      <div className="min-h-screen bg-base-100 text-base-content">
        <nav className="navbar bg-base-200">
          <div className="flex-1">
            <a className="btn btn-ghost normal-case text-xl">Poker Chip Manager</a>
          </div>
          <div className="flex-none">
            <button className="btn btn-square btn-ghost" onClick={toggleTheme}>
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
          </div>
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create-table" element={<CreateTable />} />
          <Route path="/join-table" element={<JoinTable />} />
          <Route path="/lobby/:id" element={<Lobby />} />
          <Route path="/game/:id" element={<Game />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App