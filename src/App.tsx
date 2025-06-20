import { BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom'
import './App.css'
import Layout from './components/Layout'
import BaselineForecast from './components/BaselineForecast'
import ConsensusForecast from './components/ConsensusForecast'
import Dashboard from './components/Dashboard'

function AppContent() {
  return (
    <Layout>
      <div className="flex">
        {/* Main content area */}
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/forecast" element={<Navigate to="/forecast/baseline" replace />} />
            <Route path="/forecast/baseline" element={<BaselineForecast />} />
            <Route path="/forecast/consensus" element={<ConsensusForecast />} />
            <Route path="/assortment-review" element={<Dashboard />} />
          </Routes>
        </div>
      </div>
    </Layout>
  )
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App
