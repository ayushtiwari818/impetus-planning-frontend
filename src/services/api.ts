import axios from 'axios';
import type { ForecastQuery, ForecastResponse, ForecastSummary, UniqueValuesResponse } from '../types/forecast';

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: 'http://0.0.0.0:8000/api/v1',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for error handling only
apiClient.interceptors.request.use(
  (config) => {
    // Only log in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    }
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling only
apiClient.interceptors.response.use(
  (response) => {
    // Only log in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`API Response: ${response.status} ${response.config.url}`);
    }
    return response;
  },
  (error) => {
    // Enhanced error logging for backend alignment
    const status = error.response?.status;
    const url = error.config?.url;
    const method = error.config?.method?.toUpperCase();
    
    console.error(`API Error: ${method} ${url} - Status: ${status}`, {
      status,
      data: error.response?.data,
      message: error.message,
      url,
      method
    });
    
    // Check if it's a backend connectivity issue
    if (!error.response && error.code === 'ERR_NETWORK') {
      console.error('Backend connectivity issue - ensure FastAPI server is running on http://0.0.0.0:8000');
    }
    
    return Promise.reject(error);
  }
);

export class ForecastService {
  
  /**
   * Verify API connectivity and endpoint availability
   * Based on actual FastAPI backend endpoints
   */
  static async verifyEndpoints(): Promise<{
    available: string[];
    unavailable: string[];
    backendConnected: boolean;
  }> {
    const endpoints = [
      '/forecast/',
      '/forecast/summary',
      '/forecast/unique-values/brand',
      '/forecast/unique-values/site_id',
      '/forecast/metadata',
      '/forecast/health'
    ];
    
    const results = {
      available: [] as string[],
      unavailable: [] as string[],
      backendConnected: false
    };
    
    for (const endpoint of endpoints) {
      try {
        const response = await apiClient.get(endpoint, { timeout: 5000 });
        if (response.status === 200) {
          results.available.push(endpoint);
          results.backendConnected = true;
        }
      } catch (error) {
        results.unavailable.push(endpoint);
        console.warn(`Endpoint ${endpoint} not available:`, error.response?.status || error.message);
      }
    }
    
    return results;
  }
  
  /**
   * Get forecast data with optional filtering and pagination
   * Endpoint: GET /api/v1/forecast/
   */
  static async getForecastData(params: ForecastQuery = {}): Promise<ForecastResponse> {
    try {
      const response = await apiClient.get<ForecastResponse>('/forecast/', {
        params: {
          ...params,
          // Convert dates to ISO string format if provided
          start_date: params.start_date ? params.start_date : undefined,
          end_date: params.end_date ? params.end_date : undefined,
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching forecast data:', error);
      throw new Error(`Failed to fetch forecast data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get forecast data specifically filtered by mh_brick
   * Uses the main forecast endpoint with mh_brick parameter
   */
  static async getForecastDataByBrick(mh_brick: string, additionalParams: Omit<ForecastQuery, 'mh_brick'> = {}): Promise<ForecastResponse> {
    // If mh_brick is empty string, don't include it in the query to get all data
    const params = mh_brick ? { mh_brick, ...additionalParams } : additionalParams;
    return this.getForecastData(params);
  }

  /**
   * Get forecast summary statistics
   * Endpoint: GET /api/v1/forecast/summary
   */
  static async getForecastSummary(params: ForecastQuery = {}): Promise<ForecastSummary> {
    try {
      const response = await apiClient.get<ForecastSummary>('/forecast/summary', {
        params: {
          ...params,
          start_date: params.start_date ? params.start_date : undefined,
          end_date: params.end_date ? params.end_date : undefined,
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching forecast summary:', error);
      throw new Error(`Failed to fetch forecast summary: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get unique values for a specific column
   * Endpoint: GET /api/v1/forecast/unique-values/{columnName}
   */
  static async getUniqueValues(columnName: string): Promise<UniqueValuesResponse> {
    try {
      const response = await apiClient.get<UniqueValuesResponse>(`/forecast/unique-values/${columnName}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching unique values for ${columnName}:`, error);
      throw new Error(`Failed to fetch unique values for ${columnName}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get unique mh_brick values
   * Uses: /api/v1/forecast/unique-values/mh_brick
   */
  static async getUniqueBricks(): Promise<string[]> {
    try {
      const response = await this.getUniqueValues('mh_brick');
      return response.unique_values;
    } catch (error) {
      console.error('Error fetching unique bricks:', error);
      throw error;
    }
  }

  /**
   * Get unique brands
   * Uses: /api/v1/forecast/unique-values/brand
   */
  static async getUniqueBrands(): Promise<string[]> {
    try {
      const response = await this.getUniqueValues('brand');
      return response.unique_values;
    } catch (error) {
      console.error('Error fetching unique brands:', error);
      throw error;
    }
  }

  /**
   * Get unique site IDs  
   * Uses: /api/v1/forecast/unique-values/site_id
   */
  static async getUniqueSites(): Promise<string[]> {
    try {
      const response = await this.getUniqueValues('site_id');
      return response.unique_values;
    } catch (error) {
      console.error('Error fetching unique sites:', error);
      throw error;
    }
  }

  /**
   * Check API health
   * Endpoint: GET /api/v1/forecast/health
   */
  static async checkHealth(): Promise<{ status: string; message: string; total_records_available: number }> {
    try {
      const response = await apiClient.get('/forecast/health');
      return response.data;
    } catch (error) {
      console.error('Health check failed:', error);
      throw new Error(`Health check failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get all filter metadata (unique values for all filter fields)
   * Endpoint: GET /api/v1/forecast/metadata
   */
  static async getForecastMetadata(): Promise<{
    site_ids: string[];
    mh_bricks: string[];
    zones: string[];
    states: string[];
    cities: string[];
    formats: string[];
    brands: string[];
  }> {
    try {
      const response = await apiClient.get('/forecast/metadata');
      return response.data;
    } catch (error) {
      console.error('Error fetching forecast metadata:', error);
      throw new Error(`Failed to fetch forecast metadata: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Advanced filtering endpoint with comprehensive filter support (POST)
   * Endpoint: POST /api/v1/forecast/chunked-filter
   */
  static async getFilteredForecastData(filters: {
    // Text Search
    search_term?: string;
    
    // Location Filters
    zone?: string;
    state?: string;
    city?: string;
    
    // Site & Product Filters
    site_id?: string;
    site_ids?: string[];
    format?: string;
    mh_brick?: string;
    mh_bricks?: string[];
    brand?: string;
    brands?: string[];
    
    // Product Hierarchy
    mh_segment?: string;
    mh_family?: string;
    mh_class?: string;
    product_id?: string;
    
    // Date Range
    date_range?: { start_date?: string; end_date?: string };
    start_date?: string;
    end_date?: string;
    
    // Quantity Range
    quantity_range?: { min?: number; max?: number };
    min_predicted_qty?: number;
    max_predicted_qty?: number;
    min_actual_qty?: number;
    max_actual_qty?: number;
    
    // Forecast Metadata
    forecast_run_id?: string;
    model_used?: string;
    
    // Pagination
    limit?: number;
    offset?: number;
  }): Promise<ForecastResponse> {
    try {
      // Debug logging for filter parameters
      if (process.env.NODE_ENV === 'development') {
        console.log('🔍 Filtering Request:', {
          endpoint: 'POST /api/v1/forecast/chunked-filter',
          filters: filters,
          brand: filters.brand,
          site_id: filters.site_id,
          activeFilters: Object.keys(filters).filter(key => 
            filters[key as keyof typeof filters] !== undefined && 
            filters[key as keyof typeof filters] !== ''
          )
        });
      }
      
      const response = await apiClient.post<ForecastResponse>('/forecast/chunked-filter', filters);
      
      // Debug logging for response
      if (process.env.NODE_ENV === 'development') {
        console.log('✅ Filtering Response:', {
          totalRecords: response.data.total_count,
          returnedRecords: response.data.data?.length || 0,
          hasData: !!response.data.data?.length
        });
      }
      
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching filtered forecast data:', error);
      
      // Enhanced error logging for debugging
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
        console.error('Request filters:', filters);
      }
      
      throw new Error(`Failed to fetch filtered forecast data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Simple URL-based filtering endpoint (GET) for single filter scenarios
   * Endpoint: GET /api/v1/forecast/chunked-filter/{filterType}/{value}
   */
  static async getSimpleFilteredForecastData(
    filterType: 'zone' | 'state' | 'city' | 'site_id' | 'format' | 'mh_brick' | 'brand' | 'mh_segment' | 'mh_family' | 'mh_class',
    value: string,
    options?: {
      limit?: number;
      offset?: number;
    }
  ): Promise<ForecastResponse> {
    try {
      const params = new URLSearchParams();
      if (options?.limit) params.append('limit', options.limit.toString());
      if (options?.offset) params.append('offset', options.offset.toString());
      
      const queryString = params.toString() ? `?${params.toString()}` : '';
      const response = await apiClient.get<ForecastResponse>(
        `/forecast/chunked-filter/${filterType}/${encodeURIComponent(value)}${queryString}`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching simple filtered forecast data:', error);
      throw new Error(`Failed to fetch filtered forecast data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

export default ForecastService; 