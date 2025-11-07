import { Link, NavLink } from 'react-router-dom'

const linkBase = 'relative px-3 py-2 rounded-lg transition-all hover:bg-black/5'

export default function NavBar() {
  return (
    <nav className="w-full fixed top-0 left-0 z-50">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mt-4 flex items-center justify-between glass-card px-4 py-2">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl font-['Orbitron'] title-gradient">AlgoVision</span>
          </Link>
          <div className="flex items-center gap-1 text-base text-slate-700">
            {[
              { to: '/dashboard', label: 'Dashboard' },
              { to: '/visualize', label: 'Visualize' },
              { to: '/complexity', label: 'Complexity' },
              { to: '/quiz', label: 'Quiz' },
              { to: '/export', label: 'Export' },
              { to: '/profile', label: 'Profile' },
            ].map((item) => (
              <NavLink key={item.to} to={item.to} className={({isActive})=> `${linkBase} ${isActive? 'bg-black/5' : ''}`}>
                {({ isActive }) => (
                  <>
                    <span>{item.label}</span>
                    <span className={`absolute left-1/2 -translate-x-1/2 -bottom-1 h-[2px] rounded-full transition-all ${isActive? 'w-6 bg-blue-500' : 'w-0 bg-transparent'}`}></span>
                  </>
                )}
              </NavLink>
            ))}
          </div>
          <Link to="/auth" className="neon-button text-sm">Login</Link>
        </div>
      </div>
    </nav>
  )
}


