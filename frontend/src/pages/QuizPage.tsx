import { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { useAuth } from '../auth/AuthContext'

type Question = { id: string; category?: string; question: string; options: string[]; answerIndex: number; explanation?: string }

export default function QuizPage() {
  const { token } = useAuth()
  const [questions, setQuestions] = useState<Question[]>([])
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [showModal, setShowModal] = useState(false)
  const [score, setScore] = useState(0)
  const [category, setCategory] = useState<'all' | 'sorting' | 'searching' | 'general'>('all')

  useEffect(() => {
    const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api' })
    api.get('/quiz').then(res => setQuestions(res.data.questions))
  }, [token])

  const filtered = useMemo(() => category === 'all' ? questions : questions.filter(q => q.category === category), [category, questions])

  function submit() {
    const s = filtered.reduce((acc, q) => acc + (answers[q.id] === q.answerIndex ? 1 : 0), 0)
    setScore(s)
    setShowModal(true)
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <div className="card p-6">
        <h2 className="heading text-2xl mb-4">Knowledge Quiz</h2>
        <div className="mb-4 flex items-center gap-3">
          <label className="subtle text-sm">Category</label>
          <select className="border border-cardBorder rounded-xl px-3 py-1" value={category} onChange={e => { setCategory(e.target.value as any); setAnswers({}) }}>
            <option value="all">All</option>
            <option value="sorting">Sorting</option>
            <option value="searching">Searching</option>
            <option value="general">General</option>
          </select>
        </div>
        {category !== 'all' && filtered.length < 15 && (
          <div className="mb-4 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
            This category currently has {filtered.length} questions. Target is 15+.
          </div>
        )}
        <div className="space-y-6">
          {filtered.map((q, idx) => (
            <div key={q.id}>
              <div className="heading mb-2">{idx + 1}. {q.question}</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {q.options.map((opt, i) => (
                  <label key={i} className={`card px-4 py-2 cursor-pointer ${answers[q.id] === i ? 'ring-2 ring-primary' : ''}`}>
                    <input type="radio" name={q.id} className="mr-2" checked={answers[q.id] === i} onChange={() => setAnswers(a => ({ ...a, [q.id]: i }))} />
                    {opt}
                  </label>
                ))}
              </div>
              {showModal && (
                <div className="mt-2 text-sm">
                  <div className="mb-1">
                    {answers[q.id] === q.answerIndex ? (
                      <span className="text-green-700">Correct.</span>
                    ) : (
                      <span className="text-red-600">Incorrect.</span>
                    )}
                  </div>
                  <div className="subtle">Correct answer: <span className="font-medium text-[#1F2937]">{q.options[q.answerIndex]}</span></div>
                  {q.explanation && (
                    <div className="subtle mt-1">Explanation: {q.explanation}</div>
                  )}
                </div>
              )}
            </div>
          ))}
          <div className="flex justify-end">
            <button className="btn btn-primary" onClick={submit}>Submit</button>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
          <div className="card p-6 max-w-sm w-full bg-white">
            <h3 className="heading text-xl mb-2">Score Summary</h3>
            <p className="subtle mb-4">You scored {score} / {filtered.length}</p>
            <div className="flex justify-end gap-2">
              <button className="btn btn-outline" onClick={() => setShowModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


