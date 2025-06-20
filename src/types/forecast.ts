export interface ForecastRecord {
  forecast_datetime: string;
  forecast_run_id: string;
  site_id: string;
  brand: string | null;
  mh_segment: string | null;
  mh_family: string | null;
  mh_class: string | null;
  mh_brick: string | null;
  product_id: string | null;
  forecast_week: string;
  actual_qty: number | null;
  predicted_qty: number;
  model_used: string | null;
  qty_group: number | null;
  forecast_week_number: number | null;
  training_data_max_date: string | null;
  forecast_horizon: number | null;
  created_at: string | null;
}

export interface ForecastQuery {
  site_id?: string;
  brand?: string;
  mh_segment?: string;
  mh_family?: string;
  mh_class?: string;
  mh_brick?: string;
  product_id?: string;
  forecast_run_id?: string;
  model_used?: string;
  start_date?: string;
  end_date?: string;
  limit?: number;
  offset?: number;
}

export interface ForecastResponse {
  data: ForecastRecord[];
  total_records: number;
  page: number;
  page_size: number;
  has_next: boolean;
}

export interface ForecastSummary {
  total_records: number;
  unique_sites: number;
  unique_brands: number;
  unique_products: number;
  avg_predicted_qty: number;
  total_predicted_qty: number;
  avg_actual_qty: number;
  total_actual_qty: number;
  date_range: {
    min_date: string;
    max_date: string;
  };
}

export interface UniqueValuesResponse {
  column_name: string;
  unique_values: string[];
  count: number;
} 