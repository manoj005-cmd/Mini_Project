import NavBar from './NavBar'
import { AnimatePresence, motion } from 'framer-motion'
import { Outlet, useLocation } from 'react-router-dom'
export default function Layout() {
  const location = useLocation()
  return (
    <div className="min-h-screen">
      {/* Light, subtle blue gradients */}
      <div className="pointer-events-none fixed inset-0 opacity-60" style={{background:"radial-gradient(1000px 500px at 60% -10%, rgba(59,130,246,0.08), transparent), radial-gradient(700px 350px at 10% 120%, rgba(139,92,246,0.06), transparent)"}} />
      <NavBar />
      <main className="pt-24 px-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  )
}


