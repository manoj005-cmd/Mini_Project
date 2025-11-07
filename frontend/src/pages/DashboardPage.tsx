import { useAuth } from '../auth/AuthContext'
import { Link } from 'react-router-dom'

function FeatureCard({ title, desc, to, icon }: { title: string; desc: string; to: string; icon: string }) {
  return (
    <div className="card p-6 flex flex-col justify-between">
      <div>
        <div className="w-10 h-10 rounded-md bg-gradient-to-br from-blue-400 to-indigo-400 text-white flex items-center justify-center mb-4">
          <span className="text-lg">{icon}</span>
        </div>
        <h3 className="heading text-lg mb-1">{title}</h3>
        <p className="subtle text-sm">{desc}</p>
      </div>
      <div className="mt-6">
        <Link to={to} className="btn btn-outline">Open</Link>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const { user } = useAuth()
  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="heading text-2xl">Welcome back, {user?.username}! 👋</h1>
      <p className="subtle mt-2">Your JWT session is active. Choose a feature below to continue your algorithm learning journey.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
        <FeatureCard
          icon="🎥"
          title="Algorithm Visualization"
          desc="Watch sorting and searching algorithms come to life with step-by-step animations."
          to="/visualization"
        />
        <FeatureCard
          icon="⚡"
          title="Complexity Analysis"
          desc="Compare theoretical Big O notation with actual measured performance."
          to="/complexity"
        />
        <FeatureCard
          icon="🧠"
          title="Knowledge Quiz"
          desc="Test your understanding with interactive questions from our JSON database."
          to="/quiz"
        />
        {/* Export Reports card removed */}
      </div>

      {/* Footer branding removed */}
    </div>
  )
}




