import { useState } from 'react'
import { Menu, Bell, Search, Sun, Moon, LogOut } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useTheme } from '../../contexts/ThemeContext'
import Avatar from '../ui/Avatar'
import { useNavigate } from 'react-router-dom'

export default function Header({ onMenuClick }) {
  const { user, signOut } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-secondary-200 dark:border-secondary-800 bg-white/80 dark:bg-secondary-900/80 backdrop-blur-sm">
      <div className="flex items-center justify-between h-full px-4 lg:px-6">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-800"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="hidden md:flex items-center gap-2 bg-secondary-100 dark:bg-secondary-800 rounded-lg px-3 py-2 w-64">
            <Search className="w-4 h-4 text-secondary-400" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent text-sm w-full outline-none text-secondary-900 dark:text-secondary-100 placeholder:text-secondary-400"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-800 transition-colors"
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5 text-secondary-400" />
            ) : (
              <Moon className="w-5 h-5 text-secondary-500" />
            )}
          </button>

          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-800 transition-colors"
            >
              <Bell className="w-5 h-5 text-secondary-500" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-danger-500 rounded-full" />
            </button>

            {showNotifications && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-secondary-900 rounded-xl shadow-lg border border-secondary-200 dark:border-secondary-800 overflow-hidden">
                <div className="p-3 border-b border-secondary-200 dark:border-secondary-800">
                  <h3 className="font-semibold text-sm">Notifications</h3>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  <div className="p-3 hover:bg-secondary-50 dark:hover:bg-secondary-800 border-b border-secondary-100 dark:border-secondary-800">
                    <p className="text-sm">Welcome to ContentAI!</p>
                    <p className="text-xs text-secondary-500 mt-1">2 minutes ago</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="relative">
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center gap-2 p-1 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-800 transition-colors"
            >
              <Avatar
                src={user?.user_metadata?.avatar_url}
                name={user?.user_metadata?.full_name || user?.email}
                size="sm"
              />
            </button>

            {showProfile && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-secondary-900 rounded-xl shadow-lg border border-secondary-200 dark:border-secondary-800 overflow-hidden">
                <div className="p-3 border-b border-secondary-200 dark:border-secondary-800">
                  <p className="font-medium text-sm">{user?.user_metadata?.full_name || 'User'}</p>
                  <p className="text-xs text-secondary-500">{user?.email}</p>
                </div>
                <div className="py-1">
                  <button
                    onClick={() => { navigate('/settings'); setShowProfile(false) }}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-secondary-50 dark:hover:bg-secondary-800"
                  >
                    Settings
                  </button>
                  <button
                    onClick={handleSignOut}
                    className="w-full px-3 py-2 text-left text-sm text-danger-600 hover:bg-danger-50 dark:hover:bg-danger-950 flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
