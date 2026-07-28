import { useState } from 'react'
import { Users, Search, MoreVertical, Shield, Ban, Trash2 } from 'lucide-react'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Avatar from '../../components/ui/Avatar'

const mockUsers = [
  { id: 1, name: 'John Doe', email: 'john@example.com', plan: 'professional', status: 'active', generations: 142, joined: '2026-01-15' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', plan: 'starter', status: 'active', generations: 89, joined: '2026-02-20' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', plan: 'free', status: 'active', generations: 10, joined: '2026-03-10' },
  { id: 4, name: 'Alice Brown', email: 'alice@example.com', plan: 'agency', status: 'active', generations: 456, joined: '2026-01-05' },
  { id: 5, name: 'Charlie Wilson', email: 'charlie@example.com', plan: 'starter', status: 'suspended', generations: 45, joined: '2026-04-12' },
]

export default function AdminUsersPage() {
  const [search, setSearch] = useState('')

  const filteredUsers = mockUsers.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">User Management</h1>
          <p className="text-secondary-500 mt-1">Manage all registered users</p>
        </div>
        <Button variant="outline">Export Users</Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Users', value: '1,234', color: 'text-primary-600' },
          { label: 'Active', value: '1,180', color: 'text-success-600' },
          { label: 'Paid Plans', value: '456', color: 'text-warning-600' },
          { label: 'Suspended', value: '12', color: 'text-danger-600' },
        ].map(stat => (
          <Card key={stat.label}>
            <p className="text-sm text-secondary-500">{stat.label}</p>
            <p className={`text-2xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
          </Card>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400" />
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-lg border border-secondary-300 bg-white text-sm dark:border-secondary-700 dark:bg-secondary-900 dark:text-white"
        />
      </div>

      {/* Users Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-secondary-200 dark:border-secondary-700">
                <th className="text-left text-sm font-medium text-secondary-500 py-3 px-4">User</th>
                <th className="text-left text-sm font-medium text-secondary-500 py-3 px-4">Plan</th>
                <th className="text-left text-sm font-medium text-secondary-500 py-3 px-4">Status</th>
                <th className="text-left text-sm font-medium text-secondary-500 py-3 px-4">Generations</th>
                <th className="text-left text-sm font-medium text-secondary-500 py-3 px-4">Joined</th>
                <th className="text-right text-sm font-medium text-secondary-500 py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user.id} className="border-b border-secondary-100 dark:border-secondary-800 hover:bg-secondary-50 dark:hover:bg-secondary-800/50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <Avatar name={user.name} size="sm" />
                      <div>
                        <p className="font-medium text-sm text-secondary-900 dark:text-white">{user.name}</p>
                        <p className="text-xs text-secondary-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant={
                      user.plan === 'professional' ? 'primary' :
                      user.plan === 'agency' ? 'success' :
                      user.plan === 'starter' ? 'warning' : 'secondary'
                    }>
                      {user.plan}
                    </Badge>
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant={user.status === 'active' ? 'success' : 'danger'}>
                      {user.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-sm text-secondary-900 dark:text-white">{user.generations}</td>
                  <td className="py-3 px-4 text-sm text-secondary-500">{user.joined}</td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button className="p-1.5 rounded hover:bg-secondary-100 dark:hover:bg-secondary-800">
                        <Shield className="w-4 h-4 text-secondary-500" />
                      </button>
                      <button className="p-1.5 rounded hover:bg-danger-50 dark:hover:bg-danger-950">
                        <Ban className="w-4 h-4 text-danger-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
