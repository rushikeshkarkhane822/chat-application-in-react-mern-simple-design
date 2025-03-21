import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import UserAutth from './components/context/UserAutth.jsx'
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserAutth>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </UserAutth>
  </StrictMode>,
)
