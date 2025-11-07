export type BarState = 'unsorted' | 'comparing' | 'swapping' | 'pivot' | 'sorted' | 'found' | 'notfound'
export type Step = { array: number[]; highlights: Record<number, BarState>; note?: string }

function snapshot(arr: number[], highlights: Record<number, BarState> = {}, note?: string): Step {
  return { array: [...arr], highlights: { ...highlights }, note }
}

export function bubbleSortSteps(input: number[]): Step[] {
  const arr = [...input]
  const steps: Step[] = [snapshot(arr)]
  const n = arr.length
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      steps.push(snapshot(arr, { [j]: 'comparing', [j + 1]: 'comparing' }))
      if (arr[j] > arr[j + 1]) {
        ;[arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]
        steps.push(snapshot(arr, { [j]: 'swapping', [j + 1]: 'swapping' }))
      }
    }
    steps.push(snapshot(arr, { [n - i - 1]: 'sorted' }))
  }
  return steps
}

export function insertionSortSteps(input: number[]): Step[] {
  const arr = [...input]
  const steps: Step[] = [snapshot(arr)]
  for (let i = 1; i < arr.length; i++) {
    let key = arr[i]
    let j = i - 1
    steps.push(snapshot(arr, { [i]: 'pivot' }))
    while (j >= 0 && arr[j] > key) {
      steps.push(snapshot(arr, { [j]: 'comparing', [j + 1]: 'comparing' }))
      arr[j + 1] = arr[j]
      steps.push(snapshot(arr, { [j]: 'swapping', [j + 1]: 'swapping' }))
      j--
    }
    arr[j + 1] = key
    steps.push(snapshot(arr, { [j + 1]: 'sorted' }))
  }
  return steps
}

export function selectionSortSteps(input: number[]): Step[] {
  const arr = [...input]
  const steps: Step[] = [snapshot(arr)]
  for (let i = 0; i < arr.length; i++) {
    let min = i
    for (let j = i + 1; j < arr.length; j++) {
      steps.push(snapshot(arr, { [min]: 'pivot', [j]: 'comparing' }))
      if (arr[j] < arr[min]) min = j
    }
    if (min !== i) {
      ;[arr[i], arr[min]] = [arr[min], arr[i]]
      steps.push(snapshot(arr, { [i]: 'swapping', [min]: 'swapping' }))
    }
    steps.push(snapshot(arr, { [i]: 'sorted' }))
  }
  return steps
}

export function mergeSortSteps(input: number[]): Step[] {
  const arr = [...input]
  const steps: Step[] = [snapshot(arr)]
  
  function merge(low: number, mid: number, high: number) {
    const left = arr.slice(low, mid + 1)
    const right = arr.slice(mid + 1, high + 1)
    let i = 0, j = 0, k = low
    while (i < left.length && j < right.length) {
      const highlights: Record<number, BarState> = {}
      for (let x = low; x <= high; x++) highlights[x] = 'comparing'
      highlights[low + i] = 'pivot'
      highlights[mid + 1 + j] = 'pivot'
      steps.push(snapshot(arr, highlights))
      if (left[i] <= right[j]) {
        arr[k] = left[i]
        i++
      } else {
        arr[k] = right[j]
        j++
      }
      steps.push(snapshot(arr, { [k]: 'swapping' }))
      k++
    }
    while (i < left.length) {
      arr[k] = left[i]
      steps.push(snapshot(arr, { [k]: 'swapping' }))
      i++
      k++
    }
    while (j < right.length) {
      arr[k] = right[j]
      steps.push(snapshot(arr, { [k]: 'swapping' }))
      j++
      k++
    }
    for (let x = low; x <= high; x++) {
      steps.push(snapshot(arr, { [x]: 'sorted' }))
    }
  }
  
  function sort(low: number, high: number) {
    if (low < high) {
      const mid = Math.floor((low + high) / 2)
      sort(low, mid)
      sort(mid + 1, high)
      merge(low, mid, high)
    }
  }
  
  sort(0, arr.length - 1)
  return steps
}

export function quickSortSteps(input: number[]): Step[] {
  const arr = [...input]
  const steps: Step[] = [snapshot(arr)]
  
  function partition(low: number, high: number): number {
    const pivot = arr[high]
    steps.push(snapshot(arr, { [high]: 'pivot' }))
    let i = low - 1
    for (let j = low; j < high; j++) {
      steps.push(snapshot(arr, { [j]: 'comparing', [high]: 'pivot' }))
      if (arr[j] < pivot) {
        i++
        if (i !== j) {
          ;[arr[i], arr[j]] = [arr[j], arr[i]]
          steps.push(snapshot(arr, { [i]: 'swapping', [j]: 'swapping', [high]: 'pivot' }))
        }
      }
    }
    ;[arr[i + 1], arr[high]] = [arr[high], arr[i + 1]]
    steps.push(snapshot(arr, { [i + 1]: 'swapping', [high]: 'swapping' }))
    steps.push(snapshot(arr, { [i + 1]: 'sorted' }))
    return i + 1
  }
  
  function sort(low: number, high: number) {
    if (low < high) {
      const pi = partition(low, high)
      sort(low, pi - 1)
      sort(pi + 1, high)
    }
  }
  
  sort(0, arr.length - 1)
  for (let i = 0; i < arr.length; i++) {
    steps.push(snapshot(arr, { [i]: 'sorted' }))
  }
  return steps
}

export function linearSearchSteps(input: number[], target: number): Step[] {
  const arr = [...input]
  const steps: Step[] = [snapshot(arr)]
  for (let i = 0; i < arr.length; i++) {
    steps.push(snapshot(arr, { [i]: 'comparing' }))
    if (arr[i] === target) {
      steps.push(snapshot(arr, { [i]: 'found' }))
      return steps
    }
  }
  // Mark all indices as notfound and include a note for the UI
  const highlights: Record<number, BarState> = {}
  for (let i = 0; i < arr.length; i++) highlights[i] = 'notfound'
  steps.push(snapshot(arr, highlights, 'Element not found'))
  return steps
}

export function binarySearchSteps(input: number[], target: number): Step[] {
  const arr = [...input].sort((a, b) => a - b)
  const steps: Step[] = [snapshot(arr)]
  let l = 0, r = arr.length - 1
  while (l <= r) {
    const m = Math.floor((l + r) / 2)
    steps.push(snapshot(arr, { [m]: 'pivot' }))
    if (arr[m] === target) {
      steps.push(snapshot(arr, { [m]: 'found' }))
      return steps
    }
    if (arr[m] < target) {
      for (let i = l; i <= m; i++) steps.push(snapshot(arr, { [i]: 'notfound' }))
      l = m + 1
    } else {
      for (let i = m; i <= r; i++) steps.push(snapshot(arr, { [i]: 'notfound' }))
      r = m - 1
    }
  }
  const nf: Record<number, BarState> = {}
  for (let i = 0; i < arr.length; i++) nf[i] = 'notfound'
  steps.push(snapshot(arr, nf, 'Element not found'))
  return steps
}

export function suggestAlgorithm(kind: 'sort' | 'search', input: number[], target?: number): string {
  if (kind === 'search') {
    const isSorted = input.every((v, i, a) => i === 0 || a[i - 1] <= v)
    return isSorted ? 'Binary Search' : 'Linear Search'
  }
  const n = input.length
  if (n <= 16) return 'Insertion Sort'
  return 'Quick Sort or Merge Sort'
}

export function theoreticalComplexity(name: string): string {
  const map: Record<string, string> = {
    'Bubble Sort': 'O(n^2)',
    'Insertion Sort': 'O(n^2)',
    'Selection Sort': 'O(n^2)',
    'Merge Sort': 'O(n log n)',
    'Quick Sort': 'O(n log n) average, O(n^2) worst',
    'Linear Search': 'O(n)',
    'Binary Search': 'O(log n)'
  }
  return map[name] || '—'
}


