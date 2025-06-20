import React from 'react'
import { useLocation, Link } from 'react-router-dom'
import { Text, IconButton, Avatar} from 'gends'
import ForecastNavigationPanel from './ForecastNavigationPanel'
// import Link from 'gends/dist/components/genesis/molecules/link'

interface LayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation()

  // Check if we're on a forecast route
  const isForecastRoute = location.pathname.startsWith('/forecast')

  const sidebarItems = [
    {
      icon: '🏠',
      label: 'Home',
      path: '/',
    },
    {
      icon: '📊',
      label: 'Assortment Review',
      path: '/assortment-review',
    },
    {
      icon: '📈',
      label: 'Dashboard',
      path: '/dashboard',
    },
    {
      icon: '📉',
      label: 'Forecast',
      path: '/forecast',
    },
  ]

  return (
    <div className="min-h-screen w-[100dvw] bg-gray-50">
      {/* Fixed Sidebar - Always visible */}
      <div className="fixed left-0 top-0 w-[100px] h-screen bg-gray-900 shadow-sm flex flex-col items-center py-4 z-50">
        {/* Top Icon */}
        <div className="mb-6 flex flex-col items-center text-white">
          <span className="text-3xl">🌿</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 flex flex-col items-center space-y-4 w-full">
          {sidebarItems.map((item) => (
            <div key={item.path} className="w-full flex flex-col items-center">
              <Link
                to={item.path}
                className={`w-full flex flex-col items-center justify-center py-2 rounded-md transition-colors ${location.pathname === item.path || (item.path === '/forecast' && location.pathname.startsWith('/forecast'))
                    ? 'bg-gray-800 text-white'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                  }`}
              >
                <span className="text-2xl select-none">{item.icon}</span>
                {/* Label container: fixed max-width and wrap */}
                <span
                  className="text-[10px] mt-1 text-center px-1 leading-tight break-words max-w-[80px] select-none"
                  title={item.label} // Tooltip for full label
                  style={{ wordBreak: 'break-word' }}
                >
                  {item.label}
                </span>
              </Link>
            </div>
          ))}
        </nav>
      </div>

      {/* Fixed Header - Always visible, positioned after sidebar */}
      <header className="fixed left-[100px] top-0 right-0 bg-gray-900 shadow-sm z-40">
        <div className="flex items-center justify-between px-6 py-3">
          <Text className='text-white text-2xl'>Granary</Text>
          <div className="flex items-center space-x-4">
            <IconButton
              icon={<span className="text-gray-300">🔔</span>}
              size="sm"
              appearance="ghost"
              aria-label="Notifications"
              className="hover:bg-gray-800"
            />
            <div className="flex items-center space-x-2">
              <Avatar className="w-8 h-8 bg-blue-600 text-white text-sm font-medium">
                KD
              </Avatar>
              <div className="text-sm">
                <Text className="font-medium text-white">Reliance Retail</Text>
                <Text className="text-gray-300 text-xs">Ketan Dhuvad</Text>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Forecast Navigation Panel - Fixed between sidebar and main content, only on forecast routes */}
      {isForecastRoute && (
        <div className="fixed left-[100px] top-[60px] w-64 h-[calc(100vh-60px)] z-30">
          <ForecastNavigationPanel isVisible={true} />
        </div>
      )}

      {/* Main Content Area - Positioned after sidebar and header, with conditional margin for forecast menu */}
      <main className={`ml-[100px] ${isForecastRoute ? 'ml-[364px]' : 'ml-[100px]'} mt-[60px] min-h-[calc(100vh-60px)] bg-white`}>
        {children}
      </main>
    </div>
  )
}

export default Layout 