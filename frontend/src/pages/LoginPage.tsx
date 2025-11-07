import { useState } from 'react'
import { useAuth } from '../auth/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function LoginPage() {
  const { login, register } = useAuth()
  const navigate = useNavigate()
  const [isRegister, setIsRegister] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      if (isRegister) {
        await register(email, password, username || email.split('@')[0])
      } else {
        await login(email, password)
      }
      navigate('/')
    } catch (e) {
      setError('Authentication failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-login-gradient flex items-center justify-center px-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl">
        <div className="card p-8">
          <h2 className="heading text-2xl mb-4">Platform Features</h2>
          <ul className="space-y-3 text-[#1F2937]">
            <li>🔐 JWT Authentication</li>
            <li>🎥 Algorithm Visualization</li>
            <li>⚡ Complexity Analysis</li>
            <li>🧠 Interactive Quiz</li>
            <li>📤 Export Reports</li>
          </ul>
        </div>

        <div className="card p-8 flex flex-col justify-center">
          <h1 className="heading text-3xl mb-2">Welcome to AlgoVision</h1>
          <p className="subtle mb-6">JWT token will be generated and stored for session management</p>
          <form onSubmit={onSubmit} className="space-y-4">
            {isRegister && (
              <div>
                <label className="block subtle mb-1">Username</label>
                <input className="w-full border border-cardBorder rounded-xl px-4 py-2" value={username} onChange={e => setUsername(e.target.value)} placeholder="jane" />
              </div>
            )}
            <div>
              <label className="block subtle mb-1">Email</label>
              <input className="w-full border border-cardBorder rounded-xl px-4 py-2" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />
            </div>
            <div>
              <label className="block subtle mb-1">Password</label>
              <input type="password" className="w-full border border-cardBorder rounded-xl px-4 py-2" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />
            </div>
            {error && <p className="text-red-600 text-sm">{error}</p>}
            <div className="flex items-center gap-3">
              <button className="btn btn-primary" disabled={loading}>
                {isRegister ? 'Register with JWT' : 'Login with JWT'}
              </button>
              <button type="button" className="btn btn-outline" onClick={() => setIsRegister(!isRegister)}>
                {isRegister ? 'Have an account? Login' : 'Create account'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}




