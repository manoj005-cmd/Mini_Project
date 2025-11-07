export default function Visualization() {
  return (
    <div className="mx-auto max-w-6xl">
      <h2 className="text-3xl font-['Orbitron'] mb-6">Visualization</h2>
      <div className="glass-card p-6 mb-4">
        <div className="grid md:grid-cols-3 gap-3">
          <input placeholder="Enter array, e.g. 8,3,1,4" className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-cyan-400" />
          <select className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-cyan-400">
            <option>Quick Sort</option>
            <option>Merge Sort</option>
            <option>Insertion Sort</option>
            <option>Selection Sort</option>
            <option>Bubble Sort</option>
            <option>Binary Search</option>
            <option>Linear Search</option>
          </select>
          <button className="neon-button">Visualize</button>
        </div>
      </div>
      <div className="glass-card p-6 mb-4 min-h-64">Canvas area</div>
      <div className="glass-card p-6">Step-by-step narration</div>
    </div>
  )
}






