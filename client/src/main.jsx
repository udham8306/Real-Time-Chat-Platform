import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Toaster } from 'sonner'
import  useAppStore  from './store/index'
import { Navigate } from 'react-router-dom'
import { SocketProvider } from './context/socketContext.jsx'


createRoot(document.getElementById('root')).render(
  <SocketProvider>
    <App />
    <Toaster closeButton />
  </SocketProvider>
)

