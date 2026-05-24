import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'

// Import your CSS
import './App.css'  // Adjust path as needed

// Import FontAwesome CSS
import '@fortawesome/fontawesome-free/css/all.min.css'

// Import AOS CSS
import 'aos/dist/aos.css'

// Import and initialize AOS
import AOS from 'aos'
AOS.init()

const rootElement = document.getElementById('root')
if (!rootElement) {
  throw new Error('Failed to find the root element')
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
