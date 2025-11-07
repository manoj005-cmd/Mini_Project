import { useEffect, useState } from 'react'
import axios from 'axios'
import { useAuth } from '../auth/AuthContext'

type Stats = { visualizationsRun: number; quizzesCompleted: number; algorithmsAvailable: number; daysActive: number }

export default function ReportsPage() {
  const { token } = useAuth()
  const [stats, setStats] = useState<Stats | null>(null)

  const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api' })
  api.interceptors.request.use((c) => { if (token) c.headers.Authorization = `Bearer ${token}`; return c })

  useEffect(() => {
    api.get('/reports').then(res => setStats(res.data.stats))
  }, [])

  function downloadJSON() {
    api.post('/reports/export').then(res => {
      const blob = new Blob([JSON.stringify(res.data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'algovision_report.json'
      a.click()
      URL.revokeObjectURL(url)
    })
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <div className="card p-6">
        <h2 className="heading text-xl mb-2">Export Reports</h2>
        <p className="subtle mb-6">Generate and download your learning progress</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <Stat label="Visualizations Run" value={stats?.visualizationsRun ?? 0} />
          <Stat label="Quizzes Completed" value={stats?.quizzesCompleted ?? 0} />
          <Stat label="Algorithms Available" value={stats?.algorithmsAvailable ?? 0} />
          <Stat label="Days Active" value={stats?.daysActive ?? 0} />
        </div>
        <div className="flex gap-3">
          <button className="btn btn-primary" onClick={() => window.location.reload()}>Generate Report</button>
          <button className="btn btn-outline" onClick={downloadJSON}>Download JSON / PDF</button>
        </div>
      </div>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="card p-4 text-center">
      <div className="heading text-2xl">{value}</div>
      <div className="subtle text-sm">{label}</div>
    </div>
  )
}




