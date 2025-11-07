import { Line, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts'

const data = Array.from({ length: 10 }, (_, i) => {
  const n = (i + 1) * 100
  return {
    n,
    on: n, // O(n)
    onlogn: Math.round(n * Math.log2(n)), // O(n log n)
    on2: n * n // O(n^2)
  }
})

export default function ComplexityPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-10 grid grid-cols-1 gap-6">
      <div className="card p-6">
        <h2 className="heading text-xl mb-2">Compare theoretical O(n) with measured performance</h2>
        <p className="subtle mb-6">Synthetic dataset to illustrate growth rates alongside mock measurements.</p>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div style={{ height: 320 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="n" label={{ value: 'n', position: 'insideBottom', offset: -4 }} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="on" name="O(n)" stroke="#1D4ED8" />
                <Line type="monotone" dataKey="onlogn" name="O(n log n)" stroke="#F59E0B" />
                <Line type="monotone" dataKey="on2" name="O(n^2)" stroke="#EF4444" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div style={{ height: 320 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="n" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="on" name="Measured O(n)" fill="#1D4ED8" />
                <Bar dataKey="onlogn" name="Measured O(n log n)" fill="#8B5CF6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}




