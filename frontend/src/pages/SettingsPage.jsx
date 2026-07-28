import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import { useToast } from '../contexts/ToastContext'
import Card, { CardHeader, CardTitle } from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'

export default function SettingsPage() {
  const { user, updateProfile } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const { addToast } = useToast()
  const [name, setName] = useState(user?.user_metadata?.full_name || '')
  const [loading, setLoading] = useState(false)

  const handleSave = async () => {
    setLoading(true)
    try {
      await updateProfile({ full_name: name })
      addToast('Profile updated!', 'success')
    } catch (error) {
      addToast('Failed to update profile', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">Settings</h1>
        <p className="text-secondary-500 mt-1">Manage your account settings</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <div className="space-y-4">
          <Input
            label="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            label="Email"
            value={user?.email || ''}
            disabled
          />
          <Button onClick={handleSave} disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
        </CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-secondary-900 dark:text-white">Dark Mode</p>
            <p className="text-sm text-secondary-500">Toggle between light and dark themes</p>
          </div>
          <button
            onClick={toggleTheme}
            className={`relative w-12 h-6 rounded-full transition-colors ${theme === 'dark' ? 'bg-primary-600' : 'bg-secondary-300'}`}
          >
            <div
              className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${theme === 'dark' ? 'left-7' : 'left-1'}`}
            />
          </button>
        </div>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Danger Zone</CardTitle>
        </CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-secondary-900 dark:text-white">Delete Account</p>
            <p className="text-sm text-secondary-500">Permanently delete your account and data</p>
          </div>
          <Button variant="danger" size="sm">Delete Account</Button>
        </div>
      </Card>
    </div>
  )
}
