import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  Wand2,
  BookOpen,
  Calendar,
  BarChart3,
  Settings,
  CreditCard,
  Users,
  Sparkles,
  FileText,
  Film,
  X,
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import Avatar from '../ui/Avatar'

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/generator', icon: Wand2, label: 'AI Generator' },
  { to: '/studio', icon: Film, label: 'Video Studio' },
  { to: '/library', icon: BookOpen, label: 'Content Library' },
  { to: '/calendar', icon: Calendar, label: 'Content Calendar' },
  { to: '/rewrite', icon: FileText, label: 'Rewrite Tools' },
  { to: '/analytics', icon: BarChart3, label: 'Analytics' },
  { to: '/subscription', icon: CreditCard, label: 'Subscription' },
]

const adminItems = [
  { to: '/admin/users', icon: Users, label: 'User Management' },
  { to: '/admin/analytics', icon: BarChart3, label: 'Admin Analytics' },
  { to: '/admin/prompts', icon: Sparkles, label: 'Prompt Manager' },
]

export default function Sidebar({ isOpen, onClose }) {
  const { user } = useAuth()
  const isAdmin = user?.user_metadata?.role === 'admin'

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-50 h-full w-64 bg-white dark:bg-secondary-900 border-r border-secondary-200 dark:border-secondary-800 transform transition-transform duration-200 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-secondary-200 dark:border-secondary-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-secondary-900 dark:text-white">ContentAI</span>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="p-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary-50 text-primary-600 dark:bg-primary-950 dark:text-primary-400'
                    : 'text-secondary-600 hover:bg-secondary-50 dark:text-secondary-400 dark:hover:bg-secondary-800'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </NavLink>
          ))}

          {isAdmin && (
            <>
              <div className="pt-4 pb-2">
                <p className="px-3 text-xs font-semibold text-secondary-400 uppercase tracking-wider">
                  Admin
                </p>
              </div>
              {adminItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-primary-50 text-primary-600 dark:bg-primary-950 dark:text-primary-400'
                        : 'text-secondary-600 hover:bg-secondary-50 dark:text-secondary-400 dark:hover:bg-secondary-800'
                    }`
                  }
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </NavLink>
              ))}
            </>
          )}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-secondary-200 dark:border-secondary-800">
          <NavLink
            to="/settings"
            onClick={onClose}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-secondary-600 hover:bg-secondary-50 dark:text-secondary-400 dark:hover:bg-secondary-800 transition-colors"
          >
            <Settings className="w-5 h-5" />
            Settings
          </NavLink>
          <div className="flex items-center gap-3 px-3 py-2 mt-1">
            <Avatar name={user?.user_metadata?.full_name || user?.email} size="sm" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-secondary-900 dark:text-white truncate">
                {user?.user_metadata?.full_name || 'User'}
              </p>
              <p className="text-xs text-secondary-500 truncate">{user?.email}</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
