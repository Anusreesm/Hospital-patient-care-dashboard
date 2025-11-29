import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './Context/AuthContext.jsx'
import '@fortawesome/fontawesome-free/css/all.min.css';
import { ThemeProvider } from './Context/ThemeContext.jsx'
createRoot(document.getElementById('root')).render(
  <StrictMode>
    
{/* entire app is inside the AuthProvider. */}
    <AuthProvider>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </AuthProvider>

  </StrictMode>,
)
