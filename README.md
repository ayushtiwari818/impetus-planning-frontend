# Retail Plan Visualizer

A React-based frontend application for visualizing retail forecast data from BigQuery via a FastAPI backend. This application provides an intuitive interface for exploring forecast data with filtering capabilities focused on `mh_brick` products and `forecast_week` time dimensions.

## 🚀 Features

- **Real-time Data Integration**: Connects to FastAPI backend running on `http://0.0.0.0:8000`
- **BigQuery Data Source**: Fetches retail forecast data directly from BigQuery
- **Interactive Dashboard**: Comprehensive overview with system status and quick statistics
- **Advanced Filtering**: Filter by merchandise brick (`mh_brick`), date ranges, and other dimensions
- **Responsive Design**: Modern, mobile-friendly interface built with Tailwind CSS
- **React Query Integration**: Efficient data fetching with caching, background updates, and error handling
- **TypeScript Support**: Full type safety throughout the application

## 🛠️ Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Data Fetching**: TanStack React Query (v5)
- **HTTP Client**: Axios
- **Styling**: Tailwind CSS
- **UI Components**: GENDS Design System
- **Routing**: React Router DOM
- **Build Tool**: Vite

## 📋 Prerequisites

Before running this application, ensure you have:

1. **Node.js** (v16 or higher)
2. **npm** or **yarn**
3. **FastAPI Backend** running on `http://0.0.0.0:8000`
   - Backend should be from `/Users/ayushtiwari/retail-plan-visualizer-backend`
   - Connected to BigQuery with forecast data

## 🚦 Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Start the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### 3. Ensure Backend is Running

Make sure your FastAPI backend is running:

```bash
# In your backend directory
cd /Users/ayushtiwari/retail-plan-visualizer-backend
python run.py
```

The backend should be accessible at `http://0.0.0.0:8000`

## 📊 API Integration

### Available Endpoints

The frontend integrates with the following FastAPI endpoints:

- **GET** `/api/v1/forecast/` - Main forecast data with filtering
- **GET** `/api/v1/forecast/summary` - Summary statistics
- **GET** `/api/v1/forecast/unique-values/{column}` - Unique values for filtering
- **GET** `/api/v1/forecast/health` - Health check

### Key Features

#### 1. **mh_brick Filtering**
- Default filter set to `'mh_brick'` as specified
- Dropdown selection of available brick values
- Real-time filtering of forecast data

#### 2. **Forecast Week Filtering**
- Date range selection for `forecast_week` dimension
- Interactive date pickers for start and end dates
- Automatic query updates on date changes

#### 3. **Data Visualization**
- Comprehensive data table with all forecast fields
- Summary statistics cards
- Pagination support for large datasets
- Loading states and error handling

## 🎯 Usage

### Dashboard
1. Navigate to the home page (`/`) to see the dashboard
2. Check API connection status
3. View quick statistics for mh_brick data
4. Use navigation cards to access different sections

### Baseline Forecast
1. Click "Baseline Forecast" from the dashboard or navigate to `/forecast/baseline`
2. Use the filters to:
   - Select different merchandise bricks
   - Set date ranges for forecast weeks
   - Adjust pagination limits
3. View the interactive data table with forecast records
4. Monitor summary statistics in real-time

### Data Structure

The application displays the following forecast data fields:

- **Forecast Week**: The week for which the forecast is made
- **Site ID**: Store/location identifier
- **Brand**: Product brand
- **MH Brick**: Merchandise hierarchy brick (primary filter)
- **Product ID**: Unique product identifier
- **Predicted Qty**: ML model prediction
- **Actual Qty**: Actual sales quantity (when available)
- **Model Used**: ML model identifier

## 🔧 Configuration

### API Base URL

The API base URL is configured in `src/services/api.ts`:

```typescript
const apiClient = axios.create({
  baseURL: 'http://0.0.0.0:8000/api/v1',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});
```

### Query Configuration

React Query settings are configured in `src/providers/QueryProvider.tsx`:

```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});
```

## 🏗️ Project Structure

```
src/
├── components/           # React components
│   ├── Dashboard.tsx    # Main dashboard
│   ├── BaselineForecast.tsx # Forecast data view
│   ├── ForecastDataTable.tsx # Data table component
│   └── Layout.tsx       # App layout
├── hooks/               # Custom React hooks
│   └── useForecastData.ts # Data fetching hooks
├── services/            # API services
│   └── api.ts          # Axios client and API methods
├── types/               # TypeScript type definitions
│   └── forecast.ts     # Forecast data types
├── providers/           # Context providers
│   └── QueryProvider.tsx # React Query provider
└── App.tsx             # Main application
```

## 🚀 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## 🔍 API Data Flow

1. **Health Check**: Application checks API connectivity on load
2. **Summary Data**: Fetches overview statistics for mh_brick
3. **Forecast Data**: Retrieves filtered forecast records
4. **Unique Values**: Loads filter options (bricks, brands, sites)
5. **Real-time Updates**: Background refresh and caching via React Query

## 🎨 UI/UX Features

- **Loading States**: Skeleton loaders and spinners
- **Error Handling**: User-friendly error messages with retry options
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Interactive Elements**: Hover effects, transitions, and feedback
- **Accessibility**: Proper ARIA labels and keyboard navigation

## 🛠️ Troubleshooting

### Common Issues

1. **API Connection Failed**
   - Ensure FastAPI backend is running on `http://0.0.0.0:8000`
   - Check if BigQuery credentials are properly configured
   - Verify CORS settings in the backend

2. **No Data Displayed**
   - Check if BigQuery table has data for 'mh_brick'
   - Verify date range filters aren't too restrictive
   - Check browser console for API errors

3. **Slow Loading**
   - Consider reducing the pagination limit
   - Check BigQuery query performance
   - Monitor network requests in browser dev tools

### Debug Mode

Enable debug logging by opening browser console and setting:

```javascript
localStorage.setItem('debug', 'true');
```

## 📈 Performance Optimization

- **React Query Caching**: Intelligent background updates and stale-while-revalidate
- **Memoized Components**: Optimized re-rendering with React.memo
- **Pagination**: Large datasets handled with server-side pagination
- **Debounced Filtering**: Prevents excessive API calls during user input

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **FastAPI Backend**: Integration with BigQuery-powered retail forecasting API
- **GENDS Design System**: Modern UI components
- **TanStack Query**: Powerful data synchronization
- **Tailwind CSS**: Utility-first CSS framework
