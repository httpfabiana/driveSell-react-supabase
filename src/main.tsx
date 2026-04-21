import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import router from './App'
import { RouterProvider } from 'react-router'
import AuthProvider from './contexts/AuthContext'
import { Toaster } from 'react-hot-toast'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
   <>
  <Toaster position="top-right" reverseOrder={false} toastOptions={{
    style:{
      background: "#020617",
      color: "#fff",
      border: "1px solid rgba(255,255,255,0.1)",
    }
  }}/>
   <AuthProvider>
     <RouterProvider router={router} />
   </AuthProvider>
  </>
  </StrictMode>,
)
