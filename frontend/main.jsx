import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
// context
import { RegistrationProvider } from './src/driver/Context.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RegistrationProvider>
      <App />
    </RegistrationProvider>
  </StrictMode>
)
