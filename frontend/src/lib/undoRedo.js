import { useState, useCallback, useRef } from 'react'

const MAX_HISTORY = 50

export function useUndoRedo(initialState) {
  const [state, setState] = useState(initialState)
  const pastRef = useRef([])
  const futureRef = useRef([])
  const skipRef = useRef(false)

  const pushState = useCallback((newState) => {
    if (skipRef.current) {
      skipRef.current = false
      setState(newState)
      return
    }
    pastRef.current = [...pastRef.current.slice(-MAX_HISTORY + 1), state]
    futureRef.current = []
    setState(newState)
  }, [state])

  const undo = useCallback(() => {
    if (pastRef.current.length === 0) return false
    const prev = pastRef.current.pop()
    futureRef.current = [...futureRef.current, state]
    skipRef.current = true
    setState(prev)
    return true
  }, [state])

  const redo = useCallback(() => {
    if (futureRef.current.length === 0) return false
    const next = futureRef.current.pop()
    pastRef.current = [...pastRef.current, state]
    skipRef.current = true
    setState(next)
    return true
  }, [state])

  const canUndo = pastRef.current.length > 0
  const canRedo = futureRef.current.length > 0

  const reset = useCallback((newState) => {
    pastRef.current = []
    futureRef.current = []
    setState(newState)
  }, [])

  return { state, setState: pushState, undo, redo, canUndo, canRedo, reset }
}
