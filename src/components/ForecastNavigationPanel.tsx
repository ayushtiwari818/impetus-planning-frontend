import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Text } from 'gends'

interface ForecastNavigationPanelProps {
  isVisible: boolean
  onClose?: () => void
}

const ForecastNavigationPanel: React.FC<ForecastNavigationPanelProps> = ({
  isVisible
}) => {
  const location = useLocation()
  const navigate = useNavigate()

  // Forecast navigation items - just the children that were removed from sidebar
  const forecastItems = [
    {
      label: 'Baseline Forecast',
      path: '/forecast/baseline',
      icon: (
        <svg 
          width="16" 
          height="16" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2"
          className="h-4 w-4"
        >
          <polyline points="22,12 18,12 15,21 9,3 6,12 2,12"/>
        </svg>
      )
    },
    {
      label: 'Consensus Forecast',
      path: '/forecast/consensus',
      icon: (
        <svg 
          width="16" 
          height="16" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2"
          className="h-4 w-4"
        >
          <circle cx="12" cy="12" r="3"/>
          <path d="M12 1v6m0 6v6"/>
          <path d="m21 12-6 0m-6 0-6 0"/>
        </svg>
      )
    }
  ]

  if (!isVisible) return null

  return (
    <div className="w-64 h-full bg-white border-r border-gray-200 shadow-lg flex flex-col">
      {/* Header - Fixed at top */}
      <div className="flex-shrink-0 p-4 border-b border-gray-200 bg-white">
        <Text variant="headingMedium" className="font-semibold text-gray-900">
          Forecast Menu
        </Text>
      </div>
      
      {/* Navigation List - Scrollable if needed */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          {forecastItems.map((item) => (
            <div
              key={item.path}
              className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors duration-200 mb-2 ${
                location.pathname === item.path 
                  ? 'bg-blue-50 border border-blue-200 text-blue-700' 
                  : 'hover:bg-gray-50 text-gray-700 border border-transparent'
              }`}
              onClick={() => navigate(item.path)}
            >
              <div className={`${location.pathname === item.path ? 'text-blue-600' : 'text-gray-500'}`}>
                {item.icon}
              </div>
              <Text variant="bodyMedium" className="font-medium">
                {item.label}
              </Text>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ForecastNavigationPanel 