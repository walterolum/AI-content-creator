import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
import { ToastProvider } from './contexts/ToastContext'
import DashboardLayout from './components/layout/DashboardLayout'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import AuthCallbackPage from './pages/AuthCallbackPage'
import DashboardPage from './pages/DashboardPage'
import GeneratorPage from './pages/GeneratorPage'
import LibraryPage from './pages/LibraryPage'
import RewritePage from './pages/RewritePage'
import CalendarPage from './pages/CalendarPage'
import AnalyticsPage from './pages/AnalyticsPage'
import SubscriptionPage from './pages/SubscriptionPage'
import SettingsPage from './pages/SettingsPage'
import AdminUsersPage from './pages/admin/AdminUsersPage'
import AdminAnalyticsPage from './pages/admin/AdminAnalyticsPage'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return user ? children : <Navigate to="/login" />
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return user ? <Navigate to="/dashboard" /> : children
}

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <Router>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
              <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
              <Route path="/forgot-password" element={<PublicRoute><ForgotPasswordPage /></PublicRoute>} />
              <Route path="/auth/callback" element={<AuthCallbackPage />} />

              {/* Protected Routes */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <DashboardLayout />
                  </ProtectedRoute>
                }
              >
                <Route path="dashboard" element={<DashboardPage />} />
                <Route path="generator" element={<GeneratorPage />} />
                <Route path="library" element={<LibraryPage />} />
                <Route path="rewrite" element={<RewritePage />} />
                <Route path="calendar" element={<CalendarPage />} />
                <Route path="analytics" element={<AnalyticsPage />} />
                <Route path="subscription" element={<SubscriptionPage />} />
                <Route path="settings" element={<SettingsPage />} />
                <Route path="admin/users" element={<AdminUsersPage />} />
                <Route path="admin/analytics" element={<AdminAnalyticsPage />} />
              </Route>

              {/* Catch all */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </Router>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  )
}

export default App
