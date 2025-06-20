import React from 'react'
import { Text } from 'gends'

const ConsensusForecast: React.FC = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <Text className="text-2xl font-bold text-gray-900 mb-2">
          Consensus Forecast
        </Text>
        <Text className="text-gray-600">
          View and analyze consensus forecasting data from multiple sources and stakeholders.
        </Text>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <Text className="font-semibold text-green-800">Consensus Score</Text>
            </div>
            <Text className="text-2xl font-bold text-green-800">87%</Text>
            <Text className="text-sm text-green-600">High agreement level</Text>
          </div>

          <div className="bg-orange-50 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <Text className="font-semibold text-orange-800">Contributors</Text>
            </div>
            <Text className="text-2xl font-bold text-orange-800">15</Text>
            <Text className="text-sm text-orange-600">Active participants</Text>
          </div>

          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
              </div>
              <Text className="font-semibold text-purple-800">Last Updated</Text>
            </div>
            <Text className="text-2xl font-bold text-purple-800">2h ago</Text>
            <Text className="text-sm text-purple-600">Recent collaboration</Text>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <Text className="text-lg font-semibold text-gray-900 mb-4">
            Consensus Building Features
          </Text>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <Text className="font-medium text-gray-900 mb-2">Collaborative Input</Text>
              <Text className="text-sm text-gray-600">
                Multiple stakeholders can contribute their forecasting insights and expertise.
              </Text>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <Text className="font-medium text-gray-900 mb-2">Weighted Averaging</Text>
              <Text className="text-sm text-gray-600">
                Combine different forecasts using sophisticated weighting algorithms.
              </Text>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <Text className="font-medium text-gray-900 mb-2">Disagreement Analysis</Text>
              <Text className="text-sm text-gray-600">
                Identify and analyze areas where forecasters disagree for better insights.
              </Text>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <Text className="font-medium text-gray-900 mb-2">Real-time Updates</Text>
              <Text className="text-sm text-gray-600">
                See consensus building in real-time as participants submit their inputs.
              </Text>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConsensusForecast 