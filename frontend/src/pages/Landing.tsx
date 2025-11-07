import { Link } from 'react-router-dom'
import { useState } from 'react'

export default function Landing() {
  const [mode, setMode] = useState<'login' | 'register'>('login')

  return (
    <div className="mx-auto max-w-6xl">
      <div className="grid md:grid-cols-2 gap-8 items-start">
        {/* Left: Headline + Features */}
        <div>
          <h1 className="text-4xl md:text-5xl font-['Orbitron'] title-gradient mb-3">AlgoVision</h1>
          <p className="opacity-80 text-base mb-6">Master Data Structures & Algorithms Through Interactive Visualization</p>

          <div className="glass-card p-5">
            <div className="text-sm font-semibold mb-3">Platform Features:</div>
            <ul className="space-y-3 text-sm">
              <li className="flex gap-3">
                <span>🔐</span>
                <p><strong>JWT Authentication:</strong> Secure login with token-based session management</p>
              </li>
              <li className="flex gap-3">
                <span>🎞️</span>
                <p><strong>Algorithm Visualization:</strong> Watch Quick Sort, Merge Sort, and Binary Search in action</p>
              </li>
              <li className="flex gap-3">
                <span>⚡</span>
                <p><strong>Complexity Analysis:</strong> Compare theoretical O(n) with measured performance</p>
              </li>
              <li className="flex gap-3">
                <span>🧠</span>
                <p><strong>Interactive Quiz:</strong> JSON‑sourced questions with instant feedback</p>
              </li>
              <li className="flex gap-3">
                <span>📤</span>
                <p><strong>Export Reports:</strong> Download your learning progress and results</p>
              </li>
            </ul>
            <div className="mt-4 flex gap-3">
              <Link to="/visualize" className="neon-button">Open Visualization</Link>
              <Link to="/dashboard" className="px-5 py-2 rounded-lg border border-black/10 hover:bg-black/5 transition">Go to Dashboard</Link>
            </div>
          </div>
        </div>

        {/* Right: Auth Card with Tabs */}
        <div>
          <div className="glass-card p-6">
            <h3 className="text-xl font-semibold mb-1">Welcome to AlgoVision</h3>
            <p className="text-sm opacity-70 mb-4">Sign in to start your algorithm learning journey</p>

            <div className="grid grid-cols-2 gap-2 mb-3">
              <button
                onClick={()=>setMode('login')}
                className={`px-3 py-2 rounded-lg ${mode==='login' ? 'bg-black/5' : 'bg-black/0 hover:bg-black/5'}`}
              >
                Login
              </button>
              <button
                onClick={()=>setMode('register')}
                className={`px-3 py-2 rounded-lg ${mode==='register' ? 'bg-black/5' : 'bg-black/0 hover:bg-black/5'}`}
              >
                Register
              </button>
            </div>

            <form className="space-y-3" onSubmit={(e)=>e.preventDefault()}>
              {mode==='register' && (
                <div>
                  <label className="block text-sm mb-1">Username</label>
                  <input className="w-full rounded-lg bg-black/0 border border-black/10 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-400" placeholder="nova" />
                </div>
              )}
              <div>
                <label className="block text-sm mb-1">Email</label>
                <input className="w-full rounded-lg bg-black/0 border border-black/10 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-400" placeholder="student@university.edu" />
              </div>
              <div>
                <label className="block text-sm mb-1">Password</label>
                <input type="password" className="w-full rounded-lg bg-black/0 border border-black/10 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-400" placeholder="••••••••" />
              </div>
              <button type="submit" className="neon-button w-full">{mode==='login' ? 'Login with JWT' : 'Create Account'}</button>
            </form>

            <p className="text-xs opacity-60 mt-3">JWT token will be generated and stored for session management</p>
          </div>
        </div>
      </div>
    </div>
  )
}


