# Grain Size Mapping Dashboard

A comprehensive Next.js 15.5 dashboard for monitoring and analyzing coastal sediment grain size data across Indian beaches.

## Features

- **Interactive Dashboard**: Overview with statistics and charts
- **Map Visualization**: Interactive Indian coastal map with sample markers
- **Data Management**: Sortable, filterable data table with search
- **Reports**: PDF and CSV export functionality
- **Settings**: Dark mode, notifications, and preferences
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Framework**: Next.js 15.5 (App Router)
- **Styling**: Tailwind CSS
- **Maps**: Leaflet.js with React Leaflet
- **Charts**: Recharts
- **Icons**: Lucide React
- **Language**: JavaScript (JSX)

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/                    # Next.js 15.5 app directory
│   ├── page.js            # Overview dashboard
│   ├── map/page.js        # Interactive map
│   ├── data/page.js       # Data table
│   ├── reports/page.js    # Reports & downloads
│   ├── settings/page.js   # Settings
│   ├── layout.js          # Root layout with theme
│   └── globals.css        # Global styles
├── components/            # Reusable components
│   ├── Sidebar.js         # Navigation sidebar
│   ├── Header.js          # Top header
│   ├── Modal.js           # Modal component
│   └── LoadingSpinner.js  # Loading states
└── public/               # Static assets
    └── samples.json       # Sample grain size data
```

## Sample Data

The dashboard includes 20 dummy sample points from various Indian coastal locations:
- Marina Beach, Chennai
- Goa Beach, Panaji
- Kovalam Beach, Kerala
- Puri Beach, Odisha
- And more...

Each sample includes:
- GPS coordinates
- Grain size measurements (mm)
- Temperature and humidity
- Device ID and timestamp
- Beach type classification

## Features Overview

### Dashboard Pages

1. **Overview**: Statistics cards, grain size distribution chart, temperature/humidity averages
2. **Map**: Interactive Leaflet map with clickable markers showing sample details
3. **Data**: Sortable table with search, filter, and pagination
4. **Reports**: Download PDF reports and CSV data exports
5. **Settings**: Dark mode toggle, notifications, data retention settings

### Key Components

- **Responsive Sidebar**: Collapsible navigation with mobile support
- **Dark Mode**: System-wide theme switching
- **Loading States**: Skeleton screens and spinners
- **Modal Dialogs**: Detailed sample information
- **Interactive Charts**: Pie charts and bar graphs using Recharts

## Simulated Backend

The application simulates backend functionality through:
- JSON file data loading
- Async/await with setTimeout for API simulation
- Local storage for settings persistence
- Blob generation for file downloads

## Responsive Design

- Mobile-first approach
- Collapsible sidebar for mobile
- Responsive grid layouts
- Touch-friendly interactions
- Optimized for various screen sizes

## Browser Support

- Modern browsers with ES6+ support
- Chrome, Firefox, Safari, Edge
- Mobile browsers (iOS Safari, Chrome Mobile)

## Development

To extend the dashboard:

1. Add new pages in the `app/` directory
2. Create reusable components in `components/`
3. Update navigation in `Sidebar.js`
4. Modify sample data in `data/samples.json`

## License

This project is for educational and demonstration purposes.