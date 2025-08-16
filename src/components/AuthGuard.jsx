import { useEffect, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { Spin } from 'antd'
import AuthService from '../services/authService'

const AuthGuard = ({ children }) => {
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const checkAuth = () => {
      const authResult = AuthService.getCurrentUser()
      setIsAuthenticated(authResult.success)
      setLoading(false)
    }

    checkAuth()
  }, [])

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh' 
      }}>
        <Spin size="large" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}

export default AuthGuard