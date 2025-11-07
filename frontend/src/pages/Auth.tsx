export default function Auth() {
  return (
    <div className="mx-auto max-w-md w-full">
      <div className="glass-card p-8">
        <h2 className="text-2xl font-['Orbitron'] mb-6">Login</h2>
        <form className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Username</label>
            <input className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-cyan-400" placeholder="e.g. nova" />
          </div>
          <div>
            <label className="block text-sm mb-1">Password</label>
            <input type="password" className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-cyan-400" />
          </div>
          <button type="submit" className="neon-button w-full">Enter the Lab</button>
        </form>
      </div>
    </div>
  )
}






