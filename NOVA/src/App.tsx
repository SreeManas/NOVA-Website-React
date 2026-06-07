import React from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import './App.css'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ParticlesBackground from './components/ParticlesBackground'
import Home from './pages/Home'
import AdminPanel from './admin/AdminPanel'
import Register from './pages/Register'
import Sprints from './pages/Sprints'
import IdeasprintPage from './pages/IdeasprintPage'
import Launchpad from './pages/Launchpad'
import Community from './pages/Community'
import VerifyId from './pages/VerifyId'
import { AuthProvider } from './context/AuthContext'

const Rules: React.FC = (): React.JSX.Element => <div>Rules Page</div>

// Helper component to access location and conditionally render particles
const AppContent: React.FC = (): React.JSX.Element => {
  const location = useLocation()
  const isIdeaSprint = location.pathname === '/ideasprint'
  const isLaunchpad = location.pathname === '/launchpad'
  const isCommunity = location.pathname === '/community'

  return (
    <div className="App">
      <Navbar />
      
      {/* Conditionally hide global particles on IdeaSprint page */}
      {!isIdeaSprint && !isLaunchpad && !isCommunity && <ParticlesBackground />}

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sprints" element={<Sprints />} />
          <Route path="/ideasprint" element={<IdeasprintPage />} />
          <Route path="/launchpad" element={<Launchpad />} />
          <Route path="/community" element={<Community />} />
          <Route path="/verify/:id" element={<VerifyId />} />
          <Route path="/rules" element={<Rules />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </main>

      <Footer />
    </div>
  )
}

function App(): React.JSX.Element {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  )
}

export default App
