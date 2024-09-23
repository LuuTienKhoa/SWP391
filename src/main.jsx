import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <GoogleOAuthProvider clientId="<841740393347-on6id8tmaiqg89lr9fukbpma0h9h1uk8.apps.googleusercontent.com
>">
      <App />
      </GoogleOAuthProvider>
    </BrowserRouter>   
  </StrictMode>,
)
