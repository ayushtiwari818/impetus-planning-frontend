import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ForecastService } from '../services/api';
import type { ForecastQuery, ForecastResponse, ForecastSummary, UniqueValuesResponse } from '../types/forecast';
import { useMemo, useCallback } from 'react';

// Query key factory for consistent cache management
export const forecastKeys = {
  all: ['forecast'] as const,
  lists: () => [...forecastKeys.all, 'list'] as const,
  list: (params: ForecastQuery) => [...forecastKeys.lists(), params] as const,
  summary: (params: ForecastQuery) => [...forecastKeys.all, 'summary', params] as const,
  uniqueValues: (column: string) => [...forecastKeys.all, 'unique-values', column] as const,
  health: () => [...forecastKeys.all, 'health'] as const,
};

/**
 * Hook to fetch forecast data with optimized pagination
 * Keeps previous data during pagination to prevent loading states
 */
export const useForecastData = (
  params: ForecastQuery = {},
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: forecastKeys.list(params),
    queryFn: () => ForecastService.getForecastData(params),
    enabled,
    staleTime: 15 * 60 * 1000, // 15 minutes cache
    gcTime: 30 * 60 * 1000, // 30 minutes garbage collection
    refetchOnWindowFocus: false, // Never refetch on window focus
    refetchOnMount: false, // Never refetch on component mount if data exists
    refetchInterval: false, // Disable automatic refetching
    refetchOnReconnect: false, // Don't refetch when network reconnects
    retry: 1, // Reduce retry attempts
    retryDelay: 2000, // Fixed 2 second delay between retries
    // Keep previous data during pagination to prevent loading states
    placeholderData: (previousData) => previousData,
  });
};

/**
 * Hook to fetch forecast data specifically for mh_brick
 * Optimized for performance with longer cache times
 */
export const useForecastDataByBrick = (
  mh_brick: string,
  additionalParams: Omit<ForecastQuery, 'mh_brick'> = {},
  enabled: boolean = true
) => {
  const params = { mh_brick, ...additionalParams };
  
  return useQuery({
    queryKey: forecastKeys.list(params),
    queryFn: () => ForecastService.getForecastDataByBrick(mh_brick, additionalParams),
    enabled: enabled,
    staleTime: 15 * 60 * 1000, // 15 minutes cache - much longer
    gcTime: 30 * 60 * 1000, // 30 minutes garbage collection
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchInterval: false,
    refetchOnReconnect: false,
    retry: 1,
    retryDelay: 2000,
    // Keep previous data while fetching new data
    placeholderData: (previousData) => previousData,
  });
};

/**
 * Hook to fetch forecast summary statistics
 * Long cache time since summary data changes infrequently
 */
export const useForecastSummary = (
  params: ForecastQuery = {},
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: forecastKeys.summary(params),
    queryFn: () => ForecastService.getForecastSummary(params),
    enabled,
    staleTime: 20 * 60 * 1000, // 20 minutes for summary data
    gcTime: 60 * 60 * 1000, // 1 hour garbage collection
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchInterval: false,
    refetchOnReconnect: false,
    retry: 1,
  });
};

/**
 * Hook to fetch unique values for a specific column
 * Very long cache time since unique values rarely change
 */
export const useUniqueValues = (
  columnName: string,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: forecastKeys.uniqueValues(columnName),
    queryFn: () => ForecastService.getUniqueValues(columnName),
    enabled: enabled && !!columnName,
    staleTime: 60 * 60 * 1000, // 1 hour for unique values (rarely change)
    gcTime: 2 * 60 * 60 * 1000, // 2 hours garbage collection
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchInterval: false,
    refetchOnReconnect: false,
    retry: 1,
  });
};

/**
 * Hook to fetch unique mh_brick values
 * Maximum cache time since these values are static
 */
export const useUniqueBricks = (
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: forecastKeys.uniqueValues('mh_brick'),
    queryFn: () => ForecastService.getUniqueBricks(),
    enabled,
    staleTime: 60 * 60 * 1000, // 1 hour - unique values rarely change
    gcTime: 2 * 60 * 60 * 1000, // 2 hours garbage collection
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchInterval: false,
    refetchOnReconnect: false,
    retry: 1,
    select: (data: string[]) => data.filter(Boolean), // Filter out null/empty values
  });
};

/**
 * Hook to fetch unique brands
 * Long cache time since brands don't change frequently
 */
export const useUniqueBrands = (
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: forecastKeys.uniqueValues('brand'),
    queryFn: () => ForecastService.getUniqueBrands(),
    enabled,
    staleTime: 60 * 60 * 1000, // 1 hour cache
    gcTime: 2 * 60 * 60 * 1000, // 2 hours garbage collection
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchInterval: false,
    refetchOnReconnect: false,
    retry: 1,
    select: (data: string[]) => data.filter(Boolean),
  });
};

/**
 * Hook to fetch unique site IDs
 * Long cache time since site IDs are relatively static
 */
export const useUniqueSites = (
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: forecastKeys.uniqueValues('site_id'),
    queryFn: () => ForecastService.getUniqueSites(),
    enabled,
    staleTime: 60 * 60 * 1000, // 1 hour cache
    gcTime: 2 * 60 * 60 * 1000, // 2 hours garbage collection
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchInterval: false,
    refetchOnReconnect: false,
    retry: 1,
    select: (data: string[]) => data.filter(Boolean),
  });
};

/**
 * Hook to check API health
 * Minimal cache time for health checks
 */
export const useHealthCheck = (
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: forecastKeys.health(),
    queryFn: () => ForecastService.checkHealth(),
    enabled,
    staleTime: 30 * 1000, // 30 seconds for health checks
    gcTime: 2 * 60 * 1000, // 2 minutes garbage collection
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchInterval: false,
    refetchOnReconnect: true, // Only health check should refetch on reconnect
    retry: 2, // Slightly more retries for health checks
    retryDelay: 1000,
  });
};

/**
 * Hook to fetch all filter metadata (unique values for all filter fields)
 * Very long cache time since metadata rarely changes
 */
export const useForecastMetadata = (
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: [...forecastKeys.all, 'metadata'],
    queryFn: () => ForecastService.getForecastMetadata(),
    enabled,
    staleTime: 60 * 60 * 1000, // 1 hour - metadata rarely changes
    gcTime: 2 * 60 * 60 * 1000, // 2 hours garbage collection
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchInterval: false,
    refetchOnReconnect: false,
    retry: 1,
  });
};

/**
 * Hook to fetch filtered forecast data using the advanced filtering endpoint (POST)
 * Moderate cache time for filtered data
 */
export const useFilteredForecastData = (
  filters: Parameters<typeof ForecastService.getFilteredForecastData>[0],
  enabled: boolean = true
) => {
  // Check if there are actual filters beyond just pagination
  const hasRealFilters = Object.keys(filters).some(key => 
    key !== 'limit' && 
    key !== 'offset' && 
    filters[key as keyof typeof filters] !== undefined && 
    filters[key as keyof typeof filters] !== ''
  );

  return useQuery({
    queryKey: [...forecastKeys.all, 'filtered', filters],
    queryFn: () => ForecastService.getFilteredForecastData(filters),
    enabled: enabled && hasRealFilters, // Only enable if there are real filters
    staleTime: 10 * 60 * 1000, // 10 minutes for filtered data
    gcTime: 20 * 60 * 1000, // 20 minutes garbage collection
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchInterval: false,
    refetchOnReconnect: false,
    retry: 1,
    retryDelay: 2000,
    // Keep previous data while fetching new data for better UX
    placeholderData: (previousData) => previousData,
  });
};

/**
 * Hook to fetch filtered forecast data using the simple URL-based filtering endpoint (GET)
 * Moderate cache time for simple filtered data
 */
export const useSimpleFilteredForecastData = (
  filterType: Parameters<typeof ForecastService.getSimpleFilteredForecastData>[0],
  value: string,
  options?: Parameters<typeof ForecastService.getSimpleFilteredForecastData>[2],
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: [...forecastKeys.all, 'simple-filtered', filterType, value, options],
    queryFn: () => ForecastService.getSimpleFilteredForecastData(filterType, value, options),
    enabled: enabled && !!value,
    staleTime: 10 * 60 * 1000, // 10 minutes for simple filtered data
    gcTime: 20 * 60 * 1000, // 20 minutes garbage collection
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchInterval: false,
    refetchOnReconnect: false,
    retry: 1,
    retryDelay: 2000,
    placeholderData: (previousData) => previousData,
  });
};

/**
 * Smart hook that chooses the optimal filtering endpoint based on filter complexity
 * Updated to use the correct backend endpoint with optimized pagination
 */
export const useSmartFilteredForecastData = (
  filters: Parameters<typeof ForecastService.getFilteredForecastData>[0],
  enabled: boolean = true
) => {
  // Convert the filters to the format expected by the basic forecast endpoint
  const forecastParams = useMemo(() => {
    const params: any = {};
    
    // Map filters to the correct parameter names for /forecast/ endpoint
    if (filters.search_term) params.search_term = filters.search_term;
    if (filters.zone) params.zone = filters.zone;
    if (filters.state) params.state = filters.state;
    if (filters.city) params.city = filters.city;
    if (filters.site_id) params.site_id = filters.site_id;
    if (filters.format) params.format = filters.format;
    if (filters.mh_brick) params.mh_brick = filters.mh_brick;
    if (filters.brand) params.brand = filters.brand;
    if (filters.start_date) params.start_date = filters.start_date;
    if (filters.end_date) params.end_date = filters.end_date;
    if (filters.min_predicted_qty !== undefined) params.min_predicted_qty = filters.min_predicted_qty;
    if (filters.max_predicted_qty !== undefined) params.max_predicted_qty = filters.max_predicted_qty;
    if (filters.limit) params.limit = filters.limit;
    if (filters.offset !== undefined) params.offset = filters.offset;
    
    return params;
  }, [filters]);

  // Use the basic forecast data endpoint with query parameters
  const basicQuery = useQuery({
    queryKey: forecastKeys.list(forecastParams),
    queryFn: () => ForecastService.getForecastData(forecastParams),
    enabled,
    staleTime: 15 * 60 * 1000, // 15 minutes cache
    gcTime: 30 * 60 * 1000, // 30 minutes garbage collection
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchInterval: false,
    refetchOnReconnect: false,
    retry: 1,
    retryDelay: 2000,
    // Keep previous data during pagination to prevent loading states
    placeholderData: (previousData) => previousData,
  });
  
  // Return the query result with method indicator
  return {
    ...basicQuery,
    filteringMethod: 'basic' as const,
  };
};

/**
 * Hook to fetch ALL data in background for filtering (no pagination)
 */
export const useAllForecastData = (
  mh_brick: string = 'mh_brick',
  dateRange?: { start_date?: string; end_date?: string },
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ['forecast-all-data', mh_brick, dateRange],
    queryFn: () => ForecastService.getForecastDataByBrick(mh_brick, {
      ...dateRange,
      // No limit/offset to get all data
    }),
    enabled,
    staleTime: 10 * 60 * 1000, // 10 minutes cache for all data
    gcTime: 30 * 60 * 1000, // 30 minutes garbage collection
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 1,
  });
};

/**
 * Comprehensive hook with forecast data, summary, and available bricks
 * Optimized for pagination with smooth transitions
 */
export const useForecastDataWithBrick = (
  mh_brick: string = 'mh_brick', 
  dateRange?: { start_date?: string; end_date?: string },
  limit: number = 50, 
  page: number = 1,
  enabled: boolean = true
) => {
  const offset = (page - 1) * limit;
  
  // Main forecast data query with pagination optimization
  const forecastQuery = useForecastData(
    { 
      mh_brick, 
      ...dateRange, 
      limit, 
      offset 
    }, 
    enabled
  );
  
  // Summary data query (independent of pagination)
  const summaryQuery = useForecastSummary(
    { mh_brick, ...dateRange }, 
    enabled
  );
  
  // Available bricks query (static data)
  const bricksQuery = useUniqueBricks(enabled);

  // Calculate pagination info
  const totalPages = forecastQuery.data?.total_pages || 1;
  const hasNextPage = page < totalPages;
  const hasPreviousPage = page > 1;

  // Prefetch next page for smooth pagination
  const queryClient = useQueryClient();
  const prefetchNextPage = useCallback(() => {
    if (hasNextPage && enabled) {
      const nextOffset = page * limit;
      queryClient.prefetchQuery({
        queryKey: forecastKeys.list({ 
          mh_brick, 
          ...dateRange, 
          limit, 
          offset: nextOffset 
        }),
        queryFn: () => ForecastService.getForecastData({ 
          mh_brick, 
          ...dateRange, 
          limit, 
          offset: nextOffset 
        }),
        staleTime: 15 * 60 * 1000,
      });
    }
  }, [hasNextPage, enabled, page, limit, mh_brick, dateRange, queryClient]);

  return {
    // Main data
    forecastData: forecastQuery.data,
    summaryData: summaryQuery.data,
    availableBricks: bricksQuery.data,
    
    // Loading states - don't show loading during pagination
    isLoading: forecastQuery.isLoading && !forecastQuery.isPreviousData,
    isSummaryLoading: summaryQuery.isLoading,
    isBricksLoading: bricksQuery.isLoading,
    
    // Error states
    hasError: forecastQuery.isError || summaryQuery.isError || bricksQuery.isError,
    forecastError: forecastQuery.error,
    summaryError: summaryQuery.error,
    bricksError: bricksQuery.error,
    
    // Actions
    refetchAll: () => {
      forecastQuery.refetch();
      summaryQuery.refetch();
      bricksQuery.refetch();
    },
    
    // Pagination info
    currentPage: page,
    pageSize: limit,
    totalPages,
    hasNextPage,
    hasPreviousPage,
    prefetchNextPage,
    
    // Background loading indicator
    isBackgroundLoading: forecastQuery.isFetching && forecastQuery.isPreviousData,
  };
}; 