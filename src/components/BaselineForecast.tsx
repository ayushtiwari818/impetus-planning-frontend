import React, { useState, useMemo } from 'react'
import {
  DataTable,
  //@ts-ignore
  useDataTable,
  Button,
  Input,
  Text,
  Dropdown,
  Pagination,
  // type ColumnDef
} from 'gends'
import ForecastDataTable from './ForecastDataTable'
import { useHealthCheck } from '../hooks/useForecastData'

interface ForecastData {
  id: string
  product: string
  store: string
  week23: number
  week24: number
  week25: number
  week26: number
  week27: number
}

const BaselineForecast: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedZone, setSelectedZone] = useState<{ id: string | number; label: string } | null>(null);
  const [selectedState, setSelectedState] = useState<{ id: string | number; label: string } | null>(null);
  const [selectedCity, setSelectedCity] = useState<{ id: string | number; label: string } | null>(null);
  const [selectedStore, setSelectedStore] = useState<{ id: string | number; label: string } | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<{ id: string | number; label: string } | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<{ id: string | number; label: string } | null>(null);
  const [paginationState, setPaginationState] = useState({ pageIndex: 0, pageSize: 10 })

  // const { data: healthData, isLoading: isHealthLoading, error: healthError } = useHealthCheck();

  // Sample data matching the image
  const forecastData: ForecastData[] = [
    {
      id: '1',
      product: 'SUNF DARK FANTASY CHOCF...',
      store: 'FreshPik Sakinaka',
      week23: 123,
      week24: 123,
      week25: 123,
      week26: 123,
      week27: 123,
    },
    {
      id: '2',
      product: 'BRIT BOURBON THE ORIGIN...',
      store: 'Merchandising Centre',
      week23: 342,
      week24: 342,
      week25: 342,
      week26: 342,
      week27: 342,
    },
    {
      id: '3',
      product: 'CAD OREO ORG CRM BSC 48...',
      store: 'Smart Sewree',
      week23: 567,
      week24: 567,
      week25: 567,
      week26: 567,
      week27: 567,
    },
    {
      id: '4',
      product: 'SUNF DARK FANTASY CHOC...',
      store: 'Smartnet Matunga',
      week23: 789,
      week24: 789,
      week25: 789,
      week26: 789,
      week27: 789,
    },
    {
      id: '5',
      product: 'BRIT BOURBON THE ORIGIN...',
      store: 'SmartNet CWC -Thurbe',
      week23: 246,
      week24: 246,
      week25: 246,
      week26: 246,
      week27: 246,
    },
    {
      id: '6',
      product: 'CAD OREO ORG CRM BSC 6...',
      store: 'Mangala Towers-CBD',
      week23: 135,
      week24: 135,
      week25: 135,
      week26: 135,
      week27: 135,
    },
    {
      id: '7',
      product: 'SUNF DARK FANTASY CHOC...',
      store: 'Smart Bazar-NAVI MUM...',
      week23: 890,
      week24: 890,
      week25: 890,
      week26: 890,
      week27: 890,
    },
    {
      id: '8',
      product: 'CAD OREO ORG CRM BSC...',
      store: 'SP Siddhi Tower Ozar',
      week23: 456,
      week24: 456,
      week25: 456,
      week26: 456,
      week27: 456,
    },
    {
      id: '9',
      product: 'CAD OREO ORG CRM BSC 4...',
      store: 'SP Siddhi Tower Ozar',
      week23: 321,
      week24: 321,
      week25: 321,
      week26: 321,
      week27: 321,
    }
  ]

  // Define columns
  const columns = useMemo(() => [
    {
      accessorKey: 'product',
      header: 'Product',
      cell: ({ getValue }: any) => (
        <div className="py-3 px-4">
          <Text variant="bodyMedium" className="font-medium text-gray-900 line-clamp-2 text-left">
            {getValue()}
          </Text>
        </div>
      ),
      enableSorting: true,
      size: 250,
      minSize: 200,
      maxSize: 300,
    },
    {
      accessorKey: 'store',
      header: 'Store',
      cell: ({ getValue }: any) => (
        <div className="py-3 px-4">
          <Text variant="bodyMedium" className="text-gray-700 text-left">
            {getValue()}
          </Text>
        </div>
      ),
      enableSorting: true,
      size: 180,
      minSize: 150,
      maxSize: 220,
    },
    {
      accessorKey: 'week23',
      header: () => (
        <div className="text-center py-2 px-3">
          <div className="font-semibold text-gray-900 text-sm mb-1">Week 23</div>
          <div className="text-xs text-gray-500 font-normal">Jun 2 - Jun 8</div>
        </div>
      ),
      cell: ({ getValue }: any) => (
        <div className="py-3 px-4 text-left">
          <Text variant="bodyMedium" className="font-medium text-gray-900">
            {getValue()}
          </Text>
        </div>
      ),
      enableSorting: true,
      size: 100,
      minSize: 80,
      maxSize: 120,
    },
    {
      accessorKey: 'week24',
      header: () => (
        <div className="text-center py-2 px-3">
          <div className="font-semibold text-gray-900 text-sm mb-1">Week 24</div>
          <div className="text-xs text-gray-500 font-normal">Jun 9 - Jun 15</div>
        </div>
      ),
      cell: ({ getValue }: any) => (
        <div className="py-3 px-4 text-left">
          <Text variant="bodyMedium" className="font-medium text-gray-900">
            {getValue()}
          </Text>
        </div>
      ),
      enableSorting: true,
      size: 100,
      minSize: 80,
      maxSize: 120,
    },
    {
      accessorKey: 'week25',
      header: () => (
        <div className="text-center py-2 px-3">
          <div className="font-semibold text-gray-900 text-sm mb-1">Week 25</div>
          <div className="text-xs text-gray-500 font-normal">Jun 16 - Jun 22</div>
        </div>
      ),
      cell: ({ getValue }: any) => (
        <div className="py-3 px-4 text-left">
          <Text variant="bodyMedium" className="font-medium text-gray-900">
            {getValue()}
          </Text>
        </div>
      ),
      enableSorting: true,
      size: 100,
      minSize: 80,
      maxSize: 120,
    },
    {
      accessorKey: 'week26',
      header: () => (
        <div className="text-center py-2 px-3">
          <div className="font-semibold text-gray-900 text-sm mb-1">Week 26</div>
          <div className="text-xs text-gray-500 font-normal">Jun 23 - Jun 29</div>
        </div>
      ),
      cell: ({ getValue }: any) => (
        <div className="py-3 px-4 text-left">
          <Text variant="bodyMedium" className="font-medium text-gray-900">
            {getValue()}
          </Text>
        </div>
      ),
      enableSorting: true,
      size: 100,
      minSize: 80,
      maxSize: 120,
    },
    {
      accessorKey: 'week27',
      header: () => (
        <div className="text-center py-2 px-3">
          <div className="font-semibold text-gray-900 text-sm mb-1">Week 27</div>
          <div className="text-xs text-gray-500 font-normal">Jun 30 - Jul 6</div>
        </div>
      ),
      cell: ({ getValue }: any) => (
        <div className="py-3 px-4 text-left">
          <Text variant="bodyMedium" className="font-medium text-gray-900">
            {getValue()}
          </Text>
        </div>
      ),
      enableSorting: true,
      size: 100,
      minSize: 80,
      maxSize: 120,
    },
  ], [])

  // Filter data based on search
  const filteredData = useMemo(() => {
    let filtered = forecastData

    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.product?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.store?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    return filtered
  }, [searchTerm])

  // Use the useDataTable hook to create a table instance
  const { table } = useDataTable<ForecastData>({
    data: filteredData,
    columns,
    enableRowSelection: false,
    pageCount: Math.ceil(filteredData.length / paginationState.pageSize),
    pagination: paginationState,
    onPaginationChange: setPaginationState,
  });

  // Filter options
  const zoneOptions = [
    { id: 'all', label: 'Zone' },
    { id: 'north', label: 'North' },
    { id: 'south', label: 'South' },
    { id: 'east', label: 'East' },
    { id: 'west', label: 'West' }
  ]

  const stateOptions = [
    { id: 'all', label: 'State' },
    { id: 'maharashtra', label: 'Maharashtra' },
    { id: 'gujarat', label: 'Gujarat' },
    { id: 'karnataka', label: 'Karnataka' }
  ]

  const cityOptions = [
    { id: 'all', label: 'City' },
    { id: 'mumbai', label: 'Mumbai' },
    { id: 'pune', label: 'Pune' },
    { id: 'bangalore', label: 'Bangalore' }
  ]

  const storeOptions = [
    { id: 'all', label: 'Store' },
    { id: 'freshpik', label: 'FreshPik' },
    { id: 'smart', label: 'Smart' },
    { id: 'reliance', label: 'Reliance' }
  ]

  const formatOptions = [
    { id: 'all', label: 'Format' },
    { id: 'supermarket', label: 'Supermarket' },
    { id: 'hypermarket', label: 'Hypermarket' },
    { id: 'convenience', label: 'Convenience' }
  ]

  const brandOptions = [
    { id: 'all', label: 'Brand' },
    { id: 'sunfeast', label: 'Sunfeast' },
    { id: 'britannia', label: 'Britannia' },
    { id: 'cadbury', label: 'Cadbury' }
  ]

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Baseline Forecast</h1>

        </div>

       

        {/* Forecast Data Table */}
        <ForecastDataTable 
          mh_brick="mh_brick"
          initialLimit={50}
        />
      </div>
    </div>
  )
}

export default BaselineForecast 