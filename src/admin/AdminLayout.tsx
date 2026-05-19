import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { HiOutlineHome, HiOutlineBriefcase, HiOutlineCodeBracketSquare, HiOutlineLanguage, HiOutlineCog6Tooth, HiOutlineArrowLeftOnRectangle } from 'react-icons/hi2'
import { IconType } from 'react-icons'

interface NavItem {
  to: string
  label: string
  icon: IconType
  end?: boolean
}

const NAV: NavItem[] = [
  { to: '/admin', label: 'Dashboard', icon: HiOutlineHome, end: true },
  { to: '/admin/projects', label: 'Projects', icon: HiOutlineBriefcase },
  { to: '/admin/skills', label: 'Skills', icon: HiOutlineCodeBracketSquare },
  { to: '/admin/translations', label: 'Translations', icon: HiOutlineLanguage },
  { to: '/admin/settings', label: 'Settings', icon: HiOutlineCog6Tooth },
]

export default function AdminLayout() {
  const { signOut } = useAuth()

  return (
    <div className="min-h-screen bg-bg flex">
      <aside className="w-64 bg-surface/20 border-r border-white/5 flex flex-col">
        <div className="p-5 border-b border-white/5">
          <h1 className="text-lg font-bold text-white">Portfolio CMS</h1>
          <p className="text-xs text-text/40 mt-0.5">Admin Panel</p>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {NAV.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${
                  isActive
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-text/50 hover:text-white hover:bg-surface/20'
                }`
              }
            >
              <div className="w-5 h-5 flex items-center justify-center">
                <Icon size={20} />
              </div>
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="p-3 border-t border-white/5">
          <button
            onClick={signOut}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-text/50 hover:text-red-400 hover:bg-red-500/5 transition-all w-full"
          >
            <div className="w-5 h-5 flex items-center justify-center text-current">
              <HiOutlineArrowLeftOnRectangle size={20} />
            </div>
            Logout
          </button>
        </div>
      </aside>
      <main className="flex-1 p-6 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  )
}
