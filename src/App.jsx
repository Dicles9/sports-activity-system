import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from 'antd'
import 'antd/dist/reset.css'
import './App.css'
import './styles/global.css'

import Header from './components/Header'
import AuthGuard from './components/AuthGuard'
import ErrorBoundary from './components/ErrorBoundary'
import DevTools from './components/DevTools'
import Login from './pages/Login'
import Register from './pages/Register'
import ActivityList from './pages/ActivityList'
import ActivityDetail from './pages/ActivityDetail'
import CreateActivity from './pages/CreateActivity'
import UserCenter from './pages/UserCenter'
import MyActivities from './pages/MyActivities'
import OrderManagement from './pages/OrderManagement'

const { Content } = Layout

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Layout style={{ minHeight: '100vh' }}>
          <Header />
          <Content>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/" element={<Navigate to="/activities" replace />} />
              <Route path="/activities" element={
                <AuthGuard>
                  <ActivityList />
                </AuthGuard>
              } />
              <Route path="/activities/:id" element={
                <AuthGuard>
                  <ActivityDetail />
                </AuthGuard>
              } />
              <Route path="/create-activity" element={
                <AuthGuard>
                  <CreateActivity />
                </AuthGuard>
              } />
              <Route path="/user-center" element={
                <AuthGuard>
                  <UserCenter />
                </AuthGuard>
              } />
              <Route path="/my-activities" element={
                <AuthGuard>
                  <MyActivities />
                </AuthGuard>
              } />
              <Route path="/orders" element={
                <AuthGuard>
                  <OrderManagement />
                </AuthGuard>
              } />
            </Routes>
          </Content>
        </Layout>
        <DevTools />
      </Router>
    </ErrorBoundary>
  )
}

export default App
