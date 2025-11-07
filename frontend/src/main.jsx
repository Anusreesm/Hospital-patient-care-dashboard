import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './Context/AuthContext.jsx'
import '@fortawesome/fontawesome-free/css/all.min.css';
createRoot(document.getElementById('root')).render(
  <StrictMode>
{/* entire app is inside the AuthProvider. */}
    <AuthProvider>
      <App />
    </AuthProvider>

  </StrictMode>,
)
