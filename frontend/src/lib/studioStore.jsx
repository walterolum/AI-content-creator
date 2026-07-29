import { createContext, useContext, useReducer, useCallback, useRef } from 'react'

const StudioContext = createContext(null)

const initialState = {
  project: {
    name: 'Untitled Project',
    width: 1080,
    height: 1920,
    fps: 60,
    duration: 30,
    bitrate: 12000000,
  },
  scenes: [],
  selectedSceneId: null,
  selectedClipId: null,
  currentTime: 0,
  isPlaying: false,
  isRendering: false,
  renderProgress: 0,
  tracks: [
    { id: 'video-1', name: 'Video', type: 'video', locked: false, visible: true },
    { id: 'text-1', name: 'Text', type: 'text', locked: false, visible: true },
    { id: 'audio-1', name: 'Audio', type: 'audio', locked: false, visible: true },
  ],
  clips: [],
  mediaLibrary: [],
  brandKit: {
    colors: { primary: '#a855f7', secondary: '#06b6d4', accent: '#f97316' },
    fonts: { heading: 'Helvetica Neue', body: 'Arial' },
    logo: null,
    watermark: false,
    intro: null,
    outro: null,
  },
  undoStack: [],
  redoStack: [],
  zoom: 1,
  snapEnabled: true,
}

function reducer(state, action) {
  switch (action.type) {
    case 'SET_PROJECT': return { ...state, project: { ...state.project, ...action.payload } }
    case 'SET_SCENES': return { ...state, scenes: action.payload }
    case 'ADD_SCENE': return { ...state, scenes: [...state.scenes, action.payload] }
    case 'UPDATE_SCENE': return { ...state, scenes: state.scenes.map(s => s.id === action.payload.id ? { ...s, ...action.payload.data } : s) }
    case 'REMOVE_SCENE': return { ...state, scenes: state.scenes.filter(s => s.id !== action.payload), selectedSceneId: state.selectedSceneId === action.payload ? null : state.selectedSceneId }
    case 'REORDER_SCENES': return { ...state, scenes: action.payload }
    case 'SET_SELECTED_SCENE': return { ...state, selectedSceneId: action.payload }
    case 'SET_SELECTED_CLIP': return { ...state, selectedClipId: action.payload }
    case 'SET_CURRENT_TIME': return { ...state, currentTime: action.payload }
    case 'SET_PLAYING': return { ...state, isPlaying: action.payload }
    case 'SET_RENDERING': return { ...state, isRendering: action.payload }
    case 'SET_RENDER_PROGRESS': return { ...state, renderProgress: action.payload }
    case 'SET_TRACKS': return { ...state, tracks: action.payload }
    case 'ADD_TRACK': return { ...state, tracks: [...state.tracks, action.payload] }
    case 'UPDATE_TRACK': return { ...state, tracks: state.tracks.map(t => t.id === action.payload.id ? { ...t, ...action.payload.data } : t) }
    case 'REMOVE_TRACK': return { ...state, tracks: state.tracks.filter(t => t.id !== action.payload) }
    case 'SET_CLIPS': return { ...state, clips: action.payload }
    case 'ADD_CLIP': return { ...state, clips: [...state.clips, action.payload] }
    case 'UPDATE_CLIP': return { ...state, clips: state.clips.map(c => c.id === action.payload.id ? { ...c, ...action.payload.data } : c) }
    case 'REMOVE_CLIP': return { ...state, clips: state.clips.filter(c => c.id !== action.payload) }
    case 'REORDER_CLIPS': return { ...state, clips: action.payload }
    case 'SET_MEDIA': return { ...state, mediaLibrary: action.payload }
    case 'ADD_MEDIA': return { ...state, mediaLibrary: [...state.mediaLibrary, action.payload] }
    case 'REMOVE_MEDIA': return { ...state, mediaLibrary: state.mediaLibrary.filter(m => m.id !== action.payload) }
    case 'SET_BRAND_KIT': return { ...state, brandKit: { ...state.brandKit, ...action.payload } }
    case 'SET_ZOOM': return { ...state, zoom: Math.max(0.25, Math.min(4, action.payload)) }
    case 'SET_SNAP': return { ...state, snapEnabled: action.payload }
    case 'UNDO': return state.undoStack.length > 0 ? { ...state.undoStack[state.undoStack.length - 1], redoStack: [...state.redoStack, state], undoStack: state.undoStack.slice(0, -1) } : state
    case 'REDO': return state.redoStack.length > 0 ? { ...state.redoStack[state.redoStack.length - 1], undoStack: [...state.undoStack, state], redoStack: state.redoStack.slice(0, -1) } : state
    case 'PUSH_HISTORY': return { ...state, undoStack: [...state.undoStack.slice(-49), state], redoStack: [] }
    default: return state
  }
}

export function StudioProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  const pushTimer = useRef(null)

  const pushHistory = useCallback(() => {
    clearTimeout(pushTimer.current)
    pushTimer.current = setTimeout(() => dispatch({ type: 'PUSH_HISTORY' }), 500)
  }, [])

  return (
    <StudioContext.Provider value={{ state, dispatch, pushHistory }}>
      {children}
    </StudioContext.Provider>
  )
}

export function useStudio() {
  const ctx = useContext(StudioContext)
  if (!ctx) throw new Error('useStudio must be used within StudioProvider')
  return ctx
}

export function useStudioActions() {
  const { state, dispatch, pushHistory } = useStudio()

  const setProject = useCallback((data) => {
    dispatch({ type: 'PUSH_HISTORY' })
    dispatch({ type: 'SET_PROJECT', payload: data })
  }, [dispatch])

  const setScenes = useCallback((scenes) => {
    dispatch({ type: 'PUSH_HISTORY' })
    dispatch({ type: 'SET_SCENES', payload: scenes })
  }, [dispatch])

  const addScene = useCallback((scene) => {
    dispatch({ type: 'PUSH_HISTORY' })
    dispatch({ type: 'ADD_SCENE', payload: { id: `scene-${Date.now()}`, duration: 5, ...scene } })
  }, [dispatch])

  const updateScene = useCallback((id, data) => {
    dispatch({ type: 'UPDATE_SCENE', payload: { id, data } })
    pushHistory()
  }, [dispatch, pushHistory])

  const removeScene = useCallback((id) => {
    dispatch({ type: 'PUSH_HISTORY' })
    dispatch({ type: 'REMOVE_SCENE', payload: id })
  }, [dispatch])

  const reorderScenes = useCallback((scenes) => {
    dispatch({ type: 'REORDER_SCENES', payload: scenes })
  }, [dispatch])

  const selectScene = useCallback((id) => {
    dispatch({ type: 'SET_SELECTED_SCENE', payload: id })
  }, [dispatch])

  const selectClip = useCallback((id) => {
    dispatch({ type: 'SET_SELECTED_CLIP', payload: id })
  }, [dispatch])

  const setCurrentTime = useCallback((t) => {
    dispatch({ type: 'SET_CURRENT_TIME', payload: t })
  }, [dispatch])

  const setPlaying = useCallback((v) => {
    dispatch({ type: 'SET_PLAYING', payload: v })
  }, [dispatch])

  const setRendering = useCallback((v) => {
    dispatch({ type: 'SET_RENDERING', payload: v })
  }, [dispatch])

  const setRenderProgress = useCallback((v) => {
    dispatch({ type: 'SET_RENDER_PROGRESS', payload: v })
  }, [dispatch])

  const addTrack = useCallback((track) => {
    dispatch({ type: 'ADD_TRACK', payload: { id: `track-${Date.now()}`, ...track } })
  }, [dispatch])

  const updateTrack = useCallback((id, data) => {
    dispatch({ type: 'UPDATE_TRACK', payload: { id, data } })
  }, [dispatch])

  const removeTrack = useCallback((id) => {
    dispatch({ type: 'REMOVE_TRACK', payload: id })
  }, [dispatch])

  const addClip = useCallback((clip) => {
    dispatch({ type: 'PUSH_HISTORY' })
    dispatch({ type: 'ADD_CLIP', payload: { id: `clip-${Date.now()}`, startTime: 0, duration: 5, ...clip } })
  }, [dispatch])

  const updateClip = useCallback((id, data) => {
    dispatch({ type: 'UPDATE_CLIP', payload: { id, data } })
    pushHistory()
  }, [dispatch, pushHistory])

  const removeClip = useCallback((id) => {
    dispatch({ type: 'PUSH_HISTORY' })
    dispatch({ type: 'REMOVE_CLIP', payload: id })
  }, [dispatch])

  const addMedia = useCallback((media) => {
    dispatch({ type: 'ADD_MEDIA', payload: { id: `media-${Date.now()}`, ...media } })
  }, [dispatch])

  const removeMedia = useCallback((id) => {
    dispatch({ type: 'REMOVE_MEDIA', payload: id })
  }, [dispatch])

  const setBrandKit = useCallback((data) => {
    dispatch({ type: 'SET_BRAND_KIT', payload: data })
  }, [dispatch])

  const setZoom = useCallback((z) => {
    dispatch({ type: 'SET_ZOOM', payload: z })
  }, [dispatch])

  const setSnap = useCallback((v) => {
    dispatch({ type: 'SET_SNAP', payload: v })
  }, [dispatch])

  const undo = useCallback(() => dispatch({ type: 'UNDO' }), [dispatch])
  const redo = useCallback(() => dispatch({ type: 'REDO' }), [dispatch])

  return {
    state, dispatch,
    setProject, setScenes, addScene, updateScene, removeScene, reorderScenes,
    selectScene, selectClip, setCurrentTime, setPlaying, setRendering, setRenderProgress,
    addTrack, updateTrack, removeTrack, addClip, updateClip, removeClip,
    addMedia, removeMedia, setBrandKit, setZoom, setSnap, undo, redo,
  }
}

export function formatTime(seconds) {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  const ms = Math.floor((seconds % 1) * 100)
  return `${m}:${s.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`
}
