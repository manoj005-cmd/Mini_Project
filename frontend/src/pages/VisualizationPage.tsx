import { useEffect, useMemo, useRef, useState } from 'react'
import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis, ResponsiveContainer, LabelList } from 'recharts'
import { binarySearchSteps, bubbleSortSteps, insertionSortSteps, linearSearchSteps, mergeSortSteps, quickSortSteps, selectionSortSteps, Step, suggestAlgorithm, theoreticalComplexity } from '../lib/algorithms'
import { useAuth } from '../auth/AuthContext'
import axios from 'axios'

type BarItem = { idx: number; value: number; color: string }

function generateRandomArray(n: number = 12) {
  return Array.from({ length: n }, (_, i) => ({ idx: i, value: Math.floor(Math.random() * 90) + 10, color: '#1D4ED8' }))
}

export default function VisualizationPage() {
  const { token } = useAuth()
  const [algorithm, setAlgorithm] = useState('Bubble Sort')
  const [input, setInput] = useState('')
  const [target, setTarget] = useState('')
  const [bars, setBars] = useState<BarItem[]>(generateRandomArray(12))
  const [steps, setSteps] = useState<Step[]>([])
  const [index, setIndex] = useState(0)
  const [speed, setSpeed] = useState(500)
  const [isPlaying, setIsPlaying] = useState(false)
  const [startedAt, setStartedAt] = useState<number | null>(null)
  const timerRef = useRef<number | null>(null)
  const reportRef = useRef<HTMLDivElement | null>(null)

  function loadCustom() {
    const nums = input.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !Number.isNaN(n))
    if (nums.length) {
      setBars(nums.map((v, i) => ({ idx: i, value: v, color: '#1D4ED8' })))
      setSteps([]); setIndex(0); setIsPlaying(false)
    }
  }

  async function exportAsImage(format: 'png' | 'jpeg') {
    const container = reportRef.current
    if (!container) return
    const svg = container.querySelector('svg')
    if (!svg) return
    const serializer = new XMLSerializer()
    const svgStr = serializer.serializeToString(svg)
    const svgBlob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' })
    const url = URL.createObjectURL(svgBlob)
    const img = new Image()
    const canvas = document.createElement('canvas')
    const chartW = Math.max(900, Math.ceil(svg.getBoundingClientRect().width))
    const chartH = Math.max(420, Math.ceil(svg.getBoundingClientRect().height))
    const metaH = 200
    canvas.width = chartW + 80
    canvas.height = chartH + metaH + 80
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    await new Promise<void>((resolve) => {
      img.onload = () => resolve()
      img.src = url
    })
    // background
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    // header & meta
    ctx.fillStyle = '#111827'
    ctx.font = 'bold 24px Inter, Arial'
    ctx.fillText('AlgoVision — Analysis Report', 40, 50)
    ctx.font = '16px Inter, Arial'
    ctx.fillText(`Algorithm: ${algorithm}`, 40, 85)
    ctx.fillText(`Theoretical Complexity: ${theory}`, 40, 110)
    ctx.fillText(`Input Array: [${bars.map(b => b.value).join(', ')}]`, 40, 135)
    const est = totalSteps * speed
    ctx.fillText(`Total Steps: ${totalSteps}  •  Speed: ${speed} ms/step  •  Estimated Time: ~${Math.round(est)} ms`, 40, 160)
    // chart image
    ctx.drawImage(img, 40, 190, chartW, chartH)
    // save
    const a = document.createElement('a')
    a.download = `algovision-report.${format}`
    a.href = canvas.toDataURL(`image/${format}`)
    a.click()
    URL.revokeObjectURL(url)
  }

  function randomize() {
    setBars(generateRandomArray(12))
    setSteps([]); setIndex(0); setIsPlaying(false)
  }

  function buildSteps(kind: string) {
    const arr = bars.map(b => b.value)
    let s: Step[] = []
    if (kind === 'Bubble Sort') s = bubbleSortSteps(arr)
    else if (kind === 'Insertion Sort') s = insertionSortSteps(arr)
    else if (kind === 'Selection Sort') s = selectionSortSteps(arr)
    else if (kind === 'Merge Sort') s = mergeSortSteps(arr)
    else if (kind === 'Quick Sort') s = quickSortSteps(arr)
    else if (kind === 'Linear Search') s = linearSearchSteps(arr, parseInt(target, 10))
    else if (kind === 'Binary Search') s = binarySearchSteps(arr, parseInt(target, 10))
    else s = bubbleSortSteps(arr)
    setSteps(s); setIndex(0)
  }

  async function logToBackend() {
    if (!token || !steps.length || !startedAt) return
    try {
      const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api' })
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      const durationMs = Math.round((performance.now() - startedAt) / 1000) * 1000
      await api.post('/visualizations', {
        algorithm,
        inputSize: bars.length,
        steps: steps.length,
        durationMs,
        meta: { target: target || undefined, speed }
      })
    } catch (e) {
      console.error('Failed to log visualization', e)
    }
  }

  function applyStep(stepObj: Step) {
    const baseColor = '#1D4ED8'
    const comparing = '#F59E0B'
    const swapping = '#EF4444'
    const pivot = '#8B5CF6'
    const sorted = '#10B981'
    const found = '#10B981'
    const notfound = '#9CA3AF'
    const colors = (i: number) => {
      const st = stepObj.highlights[i]
      if (st === 'comparing') return comparing
      if (st === 'swapping') return swapping
      if (st === 'pivot') return pivot
      if (st === 'sorted') return sorted
      if (st === 'found') return found
      if (st === 'notfound') return notfound
      return baseColor
    }
    setBars(stepObj.array.map((v, i) => ({ idx: i, value: v, color: colors(i) })))
  }

  function next() {
    if (!steps.length) return
    setIndex(i => {
      const ni = Math.min(steps.length - 1, i + 1)
      applyStep(steps[ni])
      return ni
    })
  }

  function prev() {
    if (!steps.length) return
    setIndex(i => {
      const ni = Math.max(0, i - 1)
      applyStep(steps[ni])
      return ni
    })
  }

  function play() {
    if (!steps.length) buildSteps(algorithm)
    setIsPlaying(true)
    if (!startedAt) setStartedAt(performance.now())
  }

  function pause() {
    setIsPlaying(false)
  }

  function reset() {
    setIsPlaying(false)
    setIndex(0)
    setSteps([])
    setBars(generateRandomArray(bars.length))
    setStartedAt(null)
  }

  useEffect(() => {
    if (isPlaying) {
      // @ts-ignore
      timerRef.current = window.setInterval(() => {
        setIndex(i => {
          const ni = i + 1
          if (ni >= steps.length) {
            setIsPlaying(false)
            logToBackend()
            return i
          }
          applyStep(steps[ni])
          return ni
        })
      }, speed) as unknown as number
      return () => { if (timerRef.current) window.clearInterval(timerRef.current) }
    }
  }, [isPlaying, speed, steps])

  useEffect(() => {
    if (!isPlaying && steps.length > 0 && index === steps.length - 1 && startedAt) {
      logToBackend()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying, steps.length, index, startedAt])

  const chartData = useMemo(() => bars.map(b => ({ name: String(b.idx), value: b.value, fill: b.color })), [bars])
  const totalSteps = steps.length || 0
  const currentStep = index + 1
  const theory = theoreticalComplexity(algorithm)
  const suggestion = suggestAlgorithm(algorithm.includes('Search') ? 'search' : 'sort', bars.map(b => b.value))
  const estimatedMs = totalSteps * speed

  return (
    <div className="mx-auto max-w-6xl px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="space-y-6">
        <div className="card p-6">
          <h3 className="heading text-xl mb-4">Algorithm Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="block subtle mb-1">Select Algorithm</label>
              <select className="w-full border border-cardBorder rounded-xl px-4 py-2" value={algorithm} onChange={e => { setAlgorithm(e.target.value); setSteps([]); setIndex(0) }}>
                <option>Bubble Sort</option>
                <option>Selection Sort</option>
                <option>Insertion Sort</option>
                <option>Merge Sort</option>
                <option>Quick Sort</option>
                <option>Linear Search</option>
                <option>Binary Search</option>
              </select>
            </div>
            <div>
              <label className="block subtle mb-1">Input Array</label>
              <input className="w-full border border-cardBorder rounded-xl px-4 py-2" placeholder="10,3,25,7,2" value={input} onChange={e => setInput(e.target.value)} />
            </div>
            {(algorithm.includes('Search')) && (
              <div>
                <label className="block subtle mb-1">Target Value</label>
                <input className="w-full border border-cardBorder rounded-xl px-4 py-2" placeholder="25" value={target} onChange={e => setTarget(e.target.value)} />
              </div>
            )}
            <div className="flex items-center gap-3">
              <button className="btn btn-outline" onClick={loadCustom}>Load Custom</button>
              <button className="btn btn-outline" onClick={randomize}>Random Array</button>
              <button className="btn btn-primary" onClick={() => { buildSteps(algorithm); setIsPlaying(true); setStartedAt(performance.now()) }}>Run {algorithm}</button>
            </div>
            <div className="text-base subtle">
              Theoretical complexity: <span className="font-semibold text-[#1F2937]">{theory}</span>
            </div>
            <div className="text-base subtle">
              Suggestion: <span className="font-semibold text-[#1F2937]">{suggestion}</span>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="heading text-xl mb-4">Playback Controls</h3>
          <div className="flex items-center gap-3 mb-4">
            <button className="btn btn-outline" onClick={prev}>Prev</button>
            {!isPlaying ? (
              <button className="btn btn-primary" onClick={play}>Play</button>
            ) : (
              <button className="btn btn-primary" onClick={pause}>Pause</button>
            )}
            <button className="btn btn-outline" onClick={next}>Next</button>
            <button className="btn btn-outline" onClick={reset}>Reset</button>
          </div>
          <div className="mb-2 subtle">Speed: {speed}ms</div>
          <input type="range" min={100} max={1000} step={50} value={speed} onChange={e => setSpeed(parseInt(e.target.value, 10))} className="w-full" />
          <div className="mt-3 subtle">Step {currentStep} of {totalSteps || '—'}</div>
          {startedAt && !isPlaying && steps.length > 0 && index === steps.length - 1 && (
            <div className="mt-2 text-sm subtle">Measured steps: {steps.length}. Time depends on speed.</div>
          )}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <button className="btn btn-outline" onClick={() => exportAsImage('png')}>Export PNG</button>
            <button className="btn btn-outline" onClick={() => exportAsImage('jpeg')}>Export JPEG</button>
          </div>
        </div>
      </div>

      <div ref={reportRef} className="md:col-span-2 card p-6">
        <h2 className="heading text-2xl">Visualization Canvas</h2>
        <p className="subtle mb-4">Initial Array</p>
        <div style={{ height: 380 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 14 }} />
              <YAxis tick={{ fontSize: 14 }} />
              <Tooltip />
              <Bar dataKey="value">
                {chartData.map((entry, index) => (
                  // @ts-ignore recharts Cell type
                  <cell key={`cell-${index}`} fill={entry.fill} />
                ))}
                <LabelList dataKey="value" position="top" className="text-base" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-3 subtle text-base">
          Current array: [{bars.map(b => b.value).join(', ')}]
        </div>
        <div className="mt-2 subtle text-base">
          {describeStep(steps[index])}
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <div className="card p-3">
            <div className="heading">Algorithm</div>
            <div className="subtle">{algorithm}</div>
          </div>
          <div className="card p-3">
            <div className="heading">Theoretical Complexity</div>
            <div className="subtle">{theory}</div>
          </div>
          <div className="card p-3">
            <div className="heading">Total Steps</div>
            <div className="subtle">{totalSteps}</div>
          </div>
          <div className="card p-3">
            <div className="heading">Playback Speed</div>
            <div className="subtle">{speed} ms/step</div>
          </div>
          <div className="card p-3 col-span-2">
            <div className="heading">Estimated Execution Time</div>
            <div className="subtle">~ {Math.round(estimatedMs)} ms</div>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-6 gap-2 text-sm">
          <LegendItem color="#1D4ED8" label="Unsorted" />
          <LegendItem color="#F59E0B" label="Comparing" />
          <LegendItem color="#EF4444" label="Swapping" />
          <LegendItem color="#8B5CF6" label="Pivot" />
          <LegendItem color="#10B981" label="Found/Sorted" />
          <LegendItem color="#9CA3AF" label="Not found" />
        </div>
      </div>
    </div>
  )
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-3 h-3 rounded-sm" style={{ background: color }} />
      <span className="subtle">{label}</span>
    </div>
  )
}

function describeStep(step?: Step) {
  if (!step) return ''
  if (step.note) return step.note
  const indices = Object.keys(step.highlights).map(k => Number(k))
  const has = (s: string) => indices.filter(i => step.highlights[i] === (s as any))
  const parts: string[] = []
  const notfound = has('notfound')
  if (notfound.length) return 'Element not found'
  const comparing = has('comparing')
  if (comparing.length) parts.push(`Comparing ${comparing.join(', ')}`)
  const swapping = has('swapping')
  if (swapping.length) parts.push(`Swapping ${swapping.join(', ')}`)
  const pivot = has('pivot')
  if (pivot.length) parts.push(`Pivot at ${pivot.join(', ')}`)
  const found = has('found')
  if (found.length) parts.push(`Found at ${found.join(', ')}`)
  return parts.join(' • ')
}


