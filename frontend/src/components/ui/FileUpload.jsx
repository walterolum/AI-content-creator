import { useState, useRef } from 'react'
import { Upload, X, Image, Film, FileText } from 'lucide-react'
import Button from '../ui/Button'

export default function FileUpload({ onFilesChange, maxFiles = 5 }) {
  const [files, setFiles] = useState([])
  const [dragActive, setDragActive] = useState(false)
  const inputRef = useRef(null)

  const handleFiles = (newFiles) => {
    const fileArray = Array.from(newFiles).slice(0, maxFiles - files.length)
    const processedFiles = fileArray.map(file => ({
      id: Math.random().toString(36).substring(7),
      file,
      name: file.name,
      size: file.size,
      type: file.type,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null,
    }))
    const updated = [...files, ...processedFiles]
    setFiles(updated)
    onFilesChange?.(updated)
  }

  const removeFile = (id) => {
    const updated = files.filter(f => f.id !== id)
    setFiles(updated)
    onFilesChange?.(updated)
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files)
    }
  }

  const formatSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  const getFileIcon = (type) => {
    if (type.startsWith('image/')) return <Image className="w-8 h-8 text-pink-500" />
    if (type.startsWith('video/')) return <Film className="w-8 h-8 text-purple-500" />
    return <FileText className="w-8 h-8 text-blue-500" />
  }

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300">
        Business Images / Media
      </label>

      {/* Drop Zone */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
          dragActive
            ? 'border-primary-500 bg-primary-50 dark:bg-primary-950'
            : 'border-secondary-300 dark:border-secondary-700 hover:border-primary-400 hover:bg-secondary-50 dark:hover:bg-secondary-800'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/*,video/*"
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />
        <Upload className={`w-10 h-10 mx-auto mb-3 ${dragActive ? 'text-primary-500' : 'text-secondary-400'}`} />
        <p className="text-sm text-secondary-600 dark:text-secondary-400">
          <span className="font-medium text-primary-600">Click to upload</span> or drag and drop
        </p>
        <p className="text-xs text-secondary-400 mt-1">
          Images (JPG, PNG, GIF) or Videos (MP4) - Max {maxFiles} files
        </p>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file) => (
            <div
              key={file.id}
              className="flex items-center gap-3 p-3 bg-secondary-50 dark:bg-secondary-800 rounded-lg"
            >
              {file.preview ? (
                <img
                  src={file.preview}
                  alt={file.name}
                  className="w-12 h-12 object-cover rounded-lg"
                />
              ) : (
                <div className="w-12 h-12 bg-secondary-200 dark:bg-secondary-700 rounded-lg flex items-center justify-center">
                  {getFileIcon(file.type)}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-secondary-900 dark:text-white truncate">
                  {file.name}
                </p>
                <p className="text-xs text-secondary-500">{formatSize(file.size)}</p>
              </div>
              <button
                onClick={() => removeFile(file.id)}
                className="p-1.5 rounded-lg hover:bg-secondary-200 dark:hover:bg-secondary-700"
              >
                <X className="w-4 h-4 text-secondary-500" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
