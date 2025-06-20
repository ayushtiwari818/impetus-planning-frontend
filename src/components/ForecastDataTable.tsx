import React, { useState, useMemo, useCallback, useEffect } from 'react';
import {
  Button,
  Input,
  Text,
  Pagination,
  DataTable,
} from 'gends';
import { useForecastDataWithBrick, useForecastMetadata, useSmartFilteredForecastData, useUniqueBrands, useUniqueSites } from '../hooks/useForecastData';


import type { ForecastRecord } from '../types/forecast';


interface ForecastDataTableProps {
  mh_brick?: string;
  initialLimit?: number;
}


// 1. Import the required components:




// Dummy invoice data
export const invoiceData = [
  {
    id: "1",
    invoiceNumber: "INV-2024-001",
    vendorName: "Acme Corp",
    amount: 2500.0,
    dueDate: "2024-02-15",
    status: "pending",
    description: "Office supplies and equipment",
    createdAt: "2024-01-15",
    paymentMethod: "Bank Transfer",
  },
  {
    id: "2",
    invoiceNumber: "INV-2024-002",
    vendorName: "Tech Solutions Inc",
    amount: 15000.0,
    dueDate: "2024-02-20",
    status: "paid",
    description: "Software development services",
    createdAt: "2024-01-18",
    paymentMethod: "Credit Card",
  },
  {
    id: "3",
    invoiceNumber: "INV-2024-003",
    vendorName: "Global Logistics",
    amount: 850.0,
    dueDate: "2024-01-30",
    status: "overdue",
    description: "Shipping and delivery services",
    createdAt: "2024-01-10",
    paymentMethod: "Check",
  },
  {
    id: "4",
    invoiceNumber: "INV-2024-004",
    vendorName: "Design Studio",
    amount: 3200.0,
    dueDate: "2024-02-25",
    status: "draft",
    description: "Brand identity and marketing materials",
    createdAt: "2024-01-20",
  },
  {
    id: "5",
    invoiceNumber: "INV-2024-005",
    vendorName: "Cloud Services Ltd",
    amount: 1200.0,
    dueDate: "2024-02-18",
    status: "pending",
    description: "Monthly cloud hosting and storage",
    createdAt: "2024-01-16",
    paymentMethod: "Bank Transfer",
  },
  {
    id: "6",
    invoiceNumber: "INV-2024-006",
    vendorName: "Legal Associates",
    amount: 8500.0,
    dueDate: "2024-02-12",
    status: "paid",
    description: "Legal consultation and document review",
    createdAt: "2024-01-12",
    paymentMethod: "Wire Transfer",
  },
];


const ForecastDataTable: React.FC<ForecastDataTableProps> = () => {
  // Server-side pagination state
  const [dateRange, setDateRange] = useState<{ start_date?: string; end_date?: string }>({});
  const [limit, setLimit] = useState(50); // Start with 50 records for optimal performance
  const [page, setPage] = useState(1);

  // Enhanced filter states with advanced features
  const [zoneFilter, setZoneFilter] = useState('');
  const [stateFilter, setStateFilter] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [storeFilter, setStoreFilter] = useState('');
  const [formatFilter, setFormatFilter] = useState('');
  const [brandFilter, setBrandFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Advanced filters
  const [dateRangeFilter, setDateRangeFilter] = useState<{ start?: string; end?: string }>({});
  const [quantityRangeFilter, setQuantityRangeFilter] = useState<{ min?: number; max?: number }>({});
  const [searchFields, setSearchFields] = useState<string[]>(['mh_brick', 'site_id']);

  // Filter presets
  const [savedFilters, setSavedFilters] = useState<Array<{
    name: string;
    filters: any;
  }>>([]);

  // Advanced search mode
  const [advancedSearchMode, setAdvancedSearchMode] = useState(false);

  // Check if any filters are active (defined early for hooks)
  const hasActiveFilters = Boolean(
    searchTerm ||
    zoneFilter ||
    stateFilter ||
    cityFilter ||
    storeFilter ||
    formatFilter ||
    brandFilter ||
    dateRangeFilter.start ||
    dateRangeFilter.end ||
    quantityRangeFilter.min ||
    quantityRangeFilter.max
  );

  // Pagination handlers for server-side pagination
  const handlePageSizeChange = useCallback((newSize: number) => {
    setLimit(newSize);
    setPage(1); // Reset to first page when page size changes
  }, []);

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  // Fetch metadata for all filter dropdowns
  const {
    data: metadata,
    isLoading: isLoadingMetadata,
    error: metadataError
  } = useForecastMetadata();

  // Fetch unique brands and sites directly using the unique-values endpoint
  const {
    data: uniqueBrandsData,
    isLoading: isLoadingBrands,
    error: brandsError
  } = useUniqueBrands();

  const {
    data: uniqueSitesData,
    isLoading: isLoadingSites,
    error: sitesError
  } = useUniqueSites();

  // Prepare filters for the advanced filtering endpoint
  const activeFilters = useMemo(() => {
    const filters: any = {
      limit,
      offset: (page - 1) * limit,
    };

    // Add active filters
    if (searchTerm) filters.search_term = searchTerm;
    if (zoneFilter) filters.zone = zoneFilter;
    if (stateFilter) filters.state = stateFilter;
    if (cityFilter) filters.city = cityFilter;
    if (storeFilter) filters.site_id = storeFilter;
    if (formatFilter) filters.format = formatFilter;
    if (brandFilter) filters.brand = brandFilter;
    if (dateRangeFilter.start) filters.start_date = dateRangeFilter.start;
    if (dateRangeFilter.end) filters.end_date = dateRangeFilter.end;
    if (quantityRangeFilter.min !== undefined) filters.min_predicted_qty = quantityRangeFilter.min;
    if (quantityRangeFilter.max !== undefined) filters.max_predicted_qty = quantityRangeFilter.max;

    return filters;
  }, [
    searchTerm, zoneFilter, stateFilter, cityFilter, storeFilter, formatFilter, brandFilter,
    dateRangeFilter, quantityRangeFilter, limit, page
  ]);

  // Use smart filtered data when filters are active, otherwise use regular data
  const {
    data: filteredData,
    isLoading: isLoadingFiltered,
    error: filteredError,
    filteringMethod
  } = useSmartFilteredForecastData(activeFilters, hasActiveFilters);

  // Debug logging for filter state
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('🎯 Filter State Update:', {
        hasActiveFilters,
        brandFilter,
        storeFilter,
        activeFilters,
        isLoadingFiltered,
        hasFilteredData: !!filteredData?.data?.length
      });
    }
  }, [hasActiveFilters, brandFilter, storeFilter, activeFilters, isLoadingFiltered, filteredData]);

  // Fallback to regular data when no filters are active
  const {
    forecastData,
    summaryData,
    availableBricks,
    isLoading: isLoadingRegular,
    hasError,
    forecastError,
    summaryError,
    bricksError,
    refetchAll,
    currentPage,
    pageSize,
    hasNextPage,
    prefetchNextPage,
  } = useForecastDataWithBrick(
    '', // Empty string to get all data regardless of mh_brick
    dateRange,
    limit,
    page,
    !hasActiveFilters // Only enabled when no filters are active
  );

  // Always use backend filtering - no client-side filtering
  const currentData = hasActiveFilters ? filteredData : forecastData;
  const isLoading = hasActiveFilters ? isLoadingFiltered : isLoadingRegular;
  const currentError = hasActiveFilters ? filteredError : forecastError;

  // Prefetch next page for better UX
  useEffect(() => {
    if (hasNextPage && !isLoading) {
      const prefetchTimer = setTimeout(() => {
        prefetchNextPage();
      }, 500); // Faster prefetch for better performance

      return () => clearTimeout(prefetchTimer);
    }
  }, [page, hasNextPage, isLoading, prefetchNextPage]);

  // Performance monitoring removed for faster loading

  // Logging removed for maximum performance

  // Helper function to get week number from date
  const getWeekNumber = (date: Date) => {
    const startOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date.getTime() - startOfYear.getTime()) / 86400000;
    return Math.ceil((pastDaysOfYear + startOfYear.getDay() + 1) / 7);
  };

  // Helper function to get date range for a week
  const getWeekDateRange = (weekNumber: number, year: number = new Date().getFullYear()) => {
    const startDay = 1 + (weekNumber - 1) * 7;
    const endDay = startDay + 6;

    const weekStart = new Date(year, 0, startDay);
    const weekEnd = new Date(year, 0, endDay);

    const formatDate = (date: Date) => {
      const day = date.getDate();
      const month = date.toLocaleDateString('en-US', { month: 'short' });
      return `${day} ${month}`;
    };

    return `${formatDate(weekStart)}-${formatDate(weekEnd)}`;
  };

  // Get unique values from both metadata and direct API calls for better reliability
  const uniqueSiteIds = uniqueSitesData || metadata?.site_ids || [];
  const uniqueZones = metadata?.zones || [];
  const uniqueStates = metadata?.states || [];
  const uniqueCities = metadata?.cities || [];
  const uniqueFormats = metadata?.formats || [];
  const uniqueBrands = uniqueBrandsData || metadata?.brands || [];

  // OPTIMIZED - Week-based pivot table with backend-filtered data only
  const pivotData = useMemo(() => {
    // Use backend-filtered data directly - no client-side filtering
    const sourceData = currentData?.data;

    if (!sourceData) {
      return { rows: [], weeks: [] };
    }

    // Backend handles all filtering - use data as-is
    const data = sourceData;
    const currentYear = new Date().getFullYear();

    // Get current week and calculate last 5 weeks
    const currentDate = new Date();
    const currentWeek = getWeekNumber(currentDate);

    // Generate last 5 weeks from current week (current week and 4 weeks before)
    const last5Weeks: number[] = [];
    for (let i = 4; i >= 0; i--) {
      last5Weeks.push(currentWeek - i);
    }

    const last5WeeksSet = new Set(last5Weeks);

    // Group data by mh_brick and site_id
    const rowsMap = new Map<string, any>();

    data.forEach(record => {
      const weekDate = new Date(record.forecast_week);
      const weekNumber = getWeekNumber(weekDate);

      // Only process records for the last 5 weeks
      if (!last5WeeksSet.has(weekNumber)) {
        return;
      }

      const key = `${record.mh_brick || 'Unknown'}-${record.site_id}`;
      const weekLabel = `Week ${weekNumber}`;

      if (!rowsMap.has(key)) {
        // Initialize with all last 5 weeks set to 0 by default
        const initialWeeks: Record<string, number> = {};
        last5Weeks.forEach((weekNum: number) => {
          initialWeeks[`Week ${weekNum}`] = 0;
        });

        rowsMap.set(key, {
          mh_brick: record.mh_brick || 'Unknown',
          site_id: record.site_id,
          weeks: initialWeeks,
          _pageId: `${page}-${key}`
        });
      }

      const row = rowsMap.get(key);
      row.weeks[weekLabel] = record.predicted_qty || 0;
    });

    // Create weeks array with date ranges for last 5 weeks
    const weeksWithDates = last5Weeks.map((weekNum: number) => ({
      week: `Week ${weekNum}`,
      dateRange: getWeekDateRange(weekNum, currentYear)
    }));

    // Ensure all rows have all 5 weeks (fill missing weeks with 0)
    const rows = Array.from(rowsMap.values()).map(row => {
      const completeWeeks: Record<string, number> = {};
      last5Weeks.forEach((weekNum: number) => {
        const weekLabel = `Week ${weekNum}`;
        completeWeeks[weekLabel] = row.weeks[weekLabel] || 0;
      });

      return {
        ...row,
        weeks: completeWeeks
      };
    });

    return {
      rows,
      weeks: weeksWithDates
    };
  }, [currentData, page]); // Simplified dependencies - backend handles filtering

  // Calculate total pages for pagination using backend response
  const totalPages = useMemo(() => {
    const totalRecords = currentData?.total_records || 0;
    return Math.ceil(totalRecords / limit);
  }, [currentData?.total_records, limit]);

  // Note: Using HTML select instead of GENDS Dropdown to avoid complexity

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <Text variant="headingMedium" className="ml-3">Loading forecast data...</Text>
      </div>
    );
  }

  // Error state - moved after hooks to follow Rules of Hooks
  if (hasError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <Text variant="headingMedium" className="text-red-800 mb-2">Error Loading Data</Text>
        <div className="space-y-2">
          {forecastError && <Text variant="bodySmall" className="text-red-700">Forecast Error: {forecastError.message}</Text>}
          {summaryError && <Text variant="bodySmall" className="text-red-700">Summary Error: {summaryError.message}</Text>}
          {bricksError && <Text variant="bodySmall" className="text-red-700">Bricks Error: {bricksError.message}</Text>}
        </div>
        <Button
          onClick={() => refetchAll()}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">



        {/* Enhanced Search and Filter System */}
        <div className="mb-6">
          {/* Advanced Search Bar */}
          <div className="mb-4">
            <div className="flex items-center gap-3">
              <div className="flex-1 max-w-md">
                <Input
                  placeholder={`Search in ${searchFields.join(', ')}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>


              {/* Clear All Filters */}
              {hasActiveFilters && (
                <Button
                  onClick={() => {
                    setSearchTerm('');
                    setZoneFilter('');
                    setStateFilter('');
                    setCityFilter('');
                    setStoreFilter('');
                    setFormatFilter('');
                    setBrandFilter('');
                    setDateRangeFilter({});
                    setQuantityRangeFilter({});
                    setPage(1);
                  }}
                  size="sm"
                  className='bg-blue-500 text-white'
                >
                  Clear All
                </Button>
              )}
            </div>
          </div>

          {/* Advanced Search Options */}
          {advancedSearchMode && (
            <div className="mb-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Search Fields Selector */}
                <div>
                  <Text variant="bodySmall" className="mb-2 text-gray-600 font-medium">Search in fields:</Text>
                  <div className="flex gap-3">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={searchFields.includes('mh_brick')}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSearchFields(prev => [...prev, 'mh_brick']);
                          } else {
                            setSearchFields(prev => prev.filter(f => f !== 'mh_brick'));
                          }
                        }}
                        className="mr-2 rounded"
                      />
                      <Text variant="bodySmall">MH Brick</Text>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={searchFields.includes('site_id')}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSearchFields(prev => [...prev, 'site_id']);
                          } else {
                            setSearchFields(prev => prev.filter(f => f !== 'site_id'));
                          }
                        }}
                        className="mr-2 rounded"
                      />
                      <Text variant="bodySmall">Site ID</Text>
                    </label>
                  </div>
                </div>

                {/* Date Range Filter */}
                <div>
                  <Text variant="bodySmall" className="mb-2 text-gray-600 font-medium">Date Range:</Text>
                  <div className="flex gap-2">
                    <Input
                      type="date"
                      placeholder="Start Date"
                      value={dateRangeFilter.start || ''}
                      onValueChange={(value: string) => setDateRangeFilter(prev => ({ ...prev, start: value }))}
                      size="s"
                    />
                    <Input
                      type="date"
                      placeholder="End Date"
                      value={dateRangeFilter.end || ''}
                      onValueChange={(value: string) => setDateRangeFilter(prev => ({ ...prev, end: value }))}
                      size="s"
                    />
                  </div>
                </div>

                {/* Quantity Range Filter */}
                <div>
                  <Text variant="bodySmall" className="mb-2 text-gray-600 font-medium">Quantity Range:</Text>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="Min"
                      value={quantityRangeFilter.min?.toString() || ''}
                      onValueChange={(value: string) => setQuantityRangeFilter(prev => ({
                        ...prev,
                        min: value ? parseInt(value) : undefined
                      }))}
                      size="s"
                    />
                    <Input
                      type="number"
                      placeholder="Max"
                      value={quantityRangeFilter.max?.toString() || ''}
                      onValueChange={(value: string) => setQuantityRangeFilter(prev => ({
                        ...prev,
                        max: value ? parseInt(value) : undefined
                      }))}
                      size="s"
                    />
                  </div>
                </div>

                {/* Filter Presets */}
                <div>
                  <Text variant="bodySmall" className="mb-2 text-gray-600 font-medium">Filter Presets:</Text>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => {
                        const currentFilters = {
                          searchTerm, zoneFilter, stateFilter, cityFilter,
                          storeFilter, formatFilter, brandFilter,
                          dateRangeFilter, quantityRangeFilter, searchFields
                        };
                        const name = prompt('Save filter preset as:');
                        if (name) {
                          setSavedFilters(prev => [...prev, { name, filters: currentFilters }]);
                        }
                      }}
                      appearance="secondary"
                      disabled={!hasActiveFilters}
                    >
                      Save Preset
                    </Button>

                    {savedFilters.length > 0 && (
                      <select
                        onChange={(e) => {
                          if (e.target.value) {
                            const preset = savedFilters.find(p => p.name === e.target.value);
                            if (preset) {
                              const filters = preset.filters;
                              setSearchTerm(filters.searchTerm || '');
                              setZoneFilter(filters.zoneFilter || '');
                              setStateFilter(filters.stateFilter || '');
                              setCityFilter(filters.cityFilter || '');
                              setStoreFilter(filters.storeFilter || '');
                              setFormatFilter(filters.formatFilter || '');
                              setBrandFilter(filters.brandFilter || '');
                              setDateRangeFilter(filters.dateRangeFilter || {});
                              setQuantityRangeFilter(filters.quantityRangeFilter || {});
                              setSearchFields(filters.searchFields || ['mh_brick', 'site_id']);
                              setPage(1);
                            }
                          }
                        }}
                        className="px-3 py-1 border border-gray-300 rounded text-sm"
                      >
                        <option value="">Load Preset...</option>
                        {savedFilters.map((preset, index) => (
                          <option key={index} value={preset.name}>{preset.name}</option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="mb-4 flex flex-wrap gap-2">
              <Text variant="bodySmall" className="text-gray-600 mr-2">Active filters:</Text>
              {searchTerm && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                  Search: "{searchTerm}"
                  <button onClick={() => setSearchTerm('')} className="ml-1 text-blue-600 hover:text-blue-800">×</button>
                </span>
              )}
              {zoneFilter && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                  Zone: {zoneFilter}
                  <button onClick={() => setZoneFilter('')} className="ml-1 text-green-600 hover:text-green-800">×</button>
                </span>
              )}
              {stateFilter && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
                  State: {stateFilter}
                  <button onClick={() => setStateFilter('')} className="ml-1 text-purple-600 hover:text-purple-800">×</button>
                </span>
              )}
              {cityFilter && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
                  City: {cityFilter}
                  <button onClick={() => setCityFilter('')} className="ml-1 text-yellow-600 hover:text-yellow-800">×</button>
                </span>
              )}
              {storeFilter && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-indigo-100 text-indigo-800">
                  Store: {storeFilter}
                  <button onClick={() => setStoreFilter('')} className="ml-1 text-indigo-600 hover:text-indigo-800">×</button>
                </span>
              )}
              {formatFilter && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-pink-100 text-pink-800">
                  Format: {formatFilter}
                  <button onClick={() => setFormatFilter('')} className="ml-1 text-pink-600 hover:text-pink-800">×</button>
                </span>
              )}
              {brandFilter && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">
                  Brand: {brandFilter}
                  <button onClick={() => setBrandFilter('')} className="ml-1 text-red-600 hover:text-red-800">×</button>
                </span>
              )}
              {(dateRangeFilter.start || dateRangeFilter.end) && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
                  Date: {dateRangeFilter.start || '∞'} - {dateRangeFilter.end || '∞'}
                  <button onClick={() => setDateRangeFilter({})} className="ml-1 text-gray-600 hover:text-gray-800">×</button>
                </span>
              )}
              {(quantityRangeFilter.min || quantityRangeFilter.max) && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-orange-100 text-orange-800">
                  Qty: {quantityRangeFilter.min || '0'} - {quantityRangeFilter.max || '∞'}
                  <button onClick={() => setQuantityRangeFilter({})} className="ml-1 text-orange-600 hover:text-orange-800">×</button>
                </span>
              )}
            </div>
          )}
        </div>

        {/* Filter Dropdowns Row */}
        <div className="flex gap-3 flex-wrap">
          {/* Zone Filter */}
          <div className="relative">
            <select
              disabled={true}
              value={zoneFilter}
              onChange={(e) => {
                setZoneFilter(e.target.value);
                setPage(1);
              }}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-[120px]"
            >
              <option value="">Zone</option>
              {uniqueZones.map((zone) => (
                <option key={zone} value={zone}>
                  {zone}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* State Filter */}
          <div className="relative">
            <select
              disabled={true}
              value={stateFilter}
              onChange={(e) => {
                setStateFilter(e.target.value);
                setPage(1);
              }}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-[120px]"
            >
              <option value="">State</option>
              <option value="Maharashtra">Maharashtra</option>
              <option value="Karnataka">Karnataka</option>
              <option value="Tamil Nadu">Tamil Nadu</option>
              <option value="Gujarat">Gujarat</option>
              <option value="Rajasthan">Rajasthan</option>
              <option value="Uttar Pradesh">Uttar Pradesh</option>
              <option value="West Bengal">West Bengal</option>
              <option value="Andhra Pradesh">Andhra Pradesh</option>
              <option value="Telangana">Telangana</option>
              <option value="Kerala">Kerala</option>
              <option value="Punjab">Punjab</option>
              <option value="Haryana">Haryana</option>
              <option value="Delhi">Delhi</option>
              <option value="Madhya Pradesh">Madhya Pradesh</option>
              <option value="Odisha">Odisha</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* City Filter */}
          <div className="relative">
            <select
              disabled={true}
              value={cityFilter}
              onChange={(e) => {
                setCityFilter(e.target.value);
                setPage(1);
              }}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-[120px]"
            >
              <option value="">City</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Delhi">Delhi</option>
              <option value="Bangalore">Bangalore</option>
              <option value="Chennai">Chennai</option>
              <option value="Kolkata">Kolkata</option>
              <option value="Hyderabad">Hyderabad</option>
              <option value="Pune">Pune</option>
              <option value="Ahmedabad">Ahmedabad</option>
              <option value="Jaipur">Jaipur</option>
              <option value="Lucknow">Lucknow</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>



          {/* Format Filter */}
          <div className="relative">
            <select
              disabled={true}
              value={formatFilter}
              onChange={(e) => {
                setFormatFilter(e.target.value);
                setPage(1);
              }}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-[120px]"
            >
              <option value="">Format</option>
              <option value="Hypermarket">Hypermarket</option>
              <option value="Supermarket">Supermarket</option>
              <option value="Express">Express</option>
              <option value="Convenience">Convenience</option>
              <option value="Online">Online</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* Store Filter */}
          <div className="relative">
            <select
              value={storeFilter}
              onChange={(e) => {
                setStoreFilter(e.target.value);
                setPage(1);
              }}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-[120px]"
            >
              <option value="">Store</option>
              {uniqueSiteIds.map((siteId) => (
                <option key={siteId} value={siteId}>
                  {siteId}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>


          {/* Brand Filter */}
          <div className="relative">
            <select
              value={brandFilter}
              onChange={(e) => {
                setBrandFilter(e.target.value);
                setPage(1);
              }}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-[120px]"
            >
              <option value="">Brand</option>
              {uniqueBrands.map((brand) => (
                <option key={brand} value={brand}>
                  {brand}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>


      {/* Data Table - keeping original structure but using GENDS Text components */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        ) : pivotData.rows.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <Text variant="headingMedium" className="text-lg">No data available</Text>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-0 bg-gray-50 z-10">
                    MH Brick
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-32 bg-gray-50 z-10">
                    Site ID
                  </th>
                  {pivotData.weeks.map((weekObj: any) => (
                    <th key={weekObj.week} className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider min-w-32">
                      <div>
                        <div>{weekObj.week}</div>
                        <div className="text-xs text-gray-400 normal-case">
                          {weekObj.dateRange}
                        </div>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pivotData.rows.map((row: any, index: number) => (
                  <tr key={row._pageId || `${row.mh_brick}-${row.site_id}-${index}`} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap sticky left-0 bg-white z-10">
                      <Text variant="bodyMedium" className="text-sm text-gray-900 font-medium">
                        {row.mh_brick}
                      </Text>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap sticky left-32 bg-white z-10">
                      <Text variant="bodyMedium" className="text-sm text-gray-900">
                        {row.site_id}
                      </Text>
                    </td>
                    {pivotData.weeks.map((weekObj: any) => (
                      <td key={`${row.mh_brick}-${row.site_id}-${weekObj.week}`} className="px-6 py-4 whitespace-nowrap text-center">
                        <Text variant="bodyMedium" className="text-sm text-gray-900">
                          {row.weeks[weekObj.week] !== undefined && row.weeks[weekObj.week] !== null
                            ? row.weeks[weekObj.week].toLocaleString()
                            : '0'}
                        </Text>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Clean GENDS Pagination */}
        {forecastData && (
          <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
            <div className="flex items-center justify-center">
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                pageSize={limit}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
                pageSizeOptions={[25, 50, 100, 200]}
              />
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

export default ForecastDataTable; 