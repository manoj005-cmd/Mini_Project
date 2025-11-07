import { Link } from 'react-router-dom'

const Card = ({ title, to, desc }: { title: string; to: string; desc: string }) => (
  <Link to={to} className="glass-card p-6 hover:bg-white/10 transition border-white/10">
    <div className="text-xl font-['Orbitron'] mb-1">{title}</div>
    <div className="opacity-70 text-sm">{desc}</div>
  </Link>
)

export default function Dashboard() {
  return (
    <div className="mx-auto max-w-6xl">
      <h2 className="text-3xl font-['Orbitron'] mb-6">Dashboard</h2>
      <div className="grid gap-4 md:grid-cols-3">
        <Card title="Visualize" to="/visualize" desc="Step-by-step animations and narration" />
        <Card title="Complexity" to="/complexity" desc="Theoretical vs measured performance" />
        <Card title="Quiz" to="/quiz" desc="Interactive MCQs with feedback" />
        <Card title="Export" to="/export" desc="Download JSON/HTML learning reports" />
        <Card title="Profile" to="/profile" desc="Progress, streaks, achievements" />
      </div>
    </div>
  )
}






