import { Routes, Route, Navigate, Link } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import VisualizationPage from './pages/VisualizationPage'
import ComplexityPage from './pages/ComplexityPage'
import QuizPage from './pages/QuizPage'
// Removed ReportsPage
import { AuthProvider, useAuth } from './auth/AuthContext'

function Protected({ children }: { children: JSX.Element }) {
  const { token } = useAuth()
  if (!token) return <Navigate to="/login" replace />
  return children
}

function Shell({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth()
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-cardBorder bg-white">
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
          <Link to="/" className="text-primary font-semibold">AlgoVision</Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link to="/visualization">Visualization</Link>
            <Link to="/complexity">Complexity</Link>
            <Link to="/quiz">Quiz</Link>
            {/* Reports link removed */}
            {user ? (
              <div className="flex items-center gap-3">
                <span className="subtle">{user.username}</span>
                <button className="btn btn-outline" onClick={logout}>Logout</button>
              </div>
            ) : (
              <Link to="/login" className="btn btn-primary">Login</Link>
            )}
          </nav>
        </div>
      </header>
      <main>{children}</main>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <Protected>
              <Shell>
                <DashboardPage />
              </Shell>
            </Protected>
          }
        />
        <Route
          path="/visualization"
          element={
            <Protected>
              <Shell>
                <VisualizationPage />
              </Shell>
            </Protected>
          }
        />
        <Route
          path="/complexity"
          element={
            <Protected>
              <Shell>
                <ComplexityPage />
              </Shell>
            </Protected>
          }
        />
        <Route
          path="/quiz"
          element={
            <Protected>
              <Shell>
                <QuizPage />
              </Shell>
            </Protected>
          }
        />
        {/* Reports route removed */}
      </Routes>
    </AuthProvider>
  )
}




