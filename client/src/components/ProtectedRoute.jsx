import React from 'react'
import { Navigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { useContext } from 'react'

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, authChecked } = useContext(AppContext)

  if (!authChecked) {
    return null
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute



