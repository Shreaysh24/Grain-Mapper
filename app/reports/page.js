'use client'

import { useState, useEffect } from 'react'
import { Download, FileText, Table, Calendar, MapPin, BarChart3 } from 'lucide-react'
import Sidebar from '../../components/Sidebar'
import Header from '../../components/Header'
import LoadingSpinner from '../../components/LoadingSpinner'

export default function ReportsPage() {
  const [samples, setSamples] = useState([])
  const [loading, setLoading] = useState(true)
  const [downloading, setDownloading] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      try {
        const response = await fetch('/samples.json')
        const data = await response.json()
        setSamples(data)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
      setLoading(false)
    }

    fetchData()
  }, [])

  const handleDownload = async (type) => {
    setDownloading(type)
    
    // Simulate download process
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    if (type === 'pdf') {
      // Simulate PDF download
      const blob = new Blob(['Sample PDF Report Content'], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `grain-size-report-${new Date().toISOString().split('T')[0]}.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } else if (type === 'csv') {
      // Generate CSV content
      const headers = ['Location', 'Date', 'Grain Size (mm)', 'Temperature (°C)', 'Humidity (%)', 'Device ID', 'Beach Type']
      const csvContent = [
        headers.join(','),
        ...samples.map(sample => [
          `"${sample.location}"`,
          new Date(sample.timestamp).toLocaleDateString(),
          sample.grainSize,
          sample.temperature,
          sample.humidity,
          sample.deviceId,
          `"${sample.beachType}"`
        ].join(','))
      ].join('\n')
      
      const blob = new Blob([csvContent], { type: 'text/csv' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `grain-size-data-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
    
    setDownloading(null)
  }

  const generateSummaryStats = () => {
    if (samples.length === 0) return null

    const avgGrainSize = (samples.reduce((sum, s) => sum + s.grainSize, 0) / samples.length).toFixed(3)
    const avgTemp = (samples.reduce((sum, s) => sum + s.temperature, 0) / samples.length).toFixed(1)
    const avgHumidity = (samples.reduce((sum, s) => sum + s.humidity, 0) / samples.length).toFixed(1)
    
    const beachTypes = samples.reduce((acc, sample) => {
      acc[sample.beachType] = (acc[sample.beachType] || 0) + 1
      return acc
    }, {})

    return {
      totalSamples: samples.length,
      avgGrainSize,
      avgTemp,
      avgHumidity,
      beachTypes,
      dateRange: {
        start: new Date(Math.min(...samples.map(s => new Date(s.timestamp)))).toLocaleDateString(),
        end: new Date(Math.max(...samples.map(s => new Date(s.timestamp)))).toLocaleDateString()
      }
    }
  }

  const stats = generateSummaryStats()

  if (loading) {
    return (
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 lg:ml-64">
          <Header />
          <div className="flex items-center justify-center h-96">
            <LoadingSpinner size="lg" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      
      <div className="flex-1 lg:ml-64">
        <Header />
        
        <main className="p-4 sm:p-6">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Header */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Reports & Downloads</h2>
              <p className="text-gray-600 dark:text-gray-400">
                Generate and download comprehensive reports of your grain size mapping data
              </p>
            </div>

            {/* Download Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center mb-6">
                  <div className="p-3 bg-red-50 dark:bg-red-900/50 rounded-xl">
                    <FileText className="h-6 w-6 text-red-600 dark:text-red-400" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">PDF Report</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Comprehensive analysis report</p>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Download a detailed PDF report including charts, statistics, and sample analysis with visual representations.
                </p>
                <button
                  onClick={() => handleDownload('pdf')}
                  disabled={downloading === 'pdf'}
                  className="w-full flex items-center justify-center px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  {downloading === 'pdf' ? (
                    <>
                      <LoadingSpinner size="sm" />
                      <span className="ml-2">Generating...</span>
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4 mr-2" />
                      Download PDF Report
                    </>
                  )}
                </button>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center mb-6">
                  <div className="p-3 bg-green-50 dark:bg-green-900/50 rounded-xl">
                    <Table className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">CSV Data Export</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Raw data for analysis</p>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Export all sample data in CSV format for further analysis in Excel, R, Python, or other data analysis tools.
                </p>
                <button
                  onClick={() => handleDownload('csv')}
                  disabled={downloading === 'csv'}
                  className="w-full flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  {downloading === 'csv' ? (
                    <>
                      <LoadingSpinner size="sm" />
                      <span className="ml-2">Exporting...</span>
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4 mr-2" />
                      Export CSV Data
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Report Preview */}
            {stats && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Report Preview</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <div className="text-center">
                    <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg inline-block mb-2">
                      <BarChart3 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalSamples}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Samples</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-lg inline-block mb-2">
                      <div className="h-6 w-6 bg-yellow-600 dark:bg-yellow-400 rounded-full"></div>
                    </div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.avgGrainSize}mm</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Avg Grain Size</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="p-3 bg-red-100 dark:bg-red-900 rounded-lg inline-block mb-2">
                      <div className="h-6 w-6 bg-red-600 dark:bg-red-400 rounded-full"></div>
                    </div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.avgTemp}°C</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Avg Temperature</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg inline-block mb-2">
                      <div className="h-6 w-6 bg-purple-600 dark:bg-purple-400 rounded-full"></div>
                    </div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.avgHumidity}%</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Avg Humidity</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Beach Type Distribution</h4>
                    <div className="space-y-3">
                      {Object.entries(stats.beachTypes).map(([type, count]) => (
                        <div key={type} className="flex items-center justify-between">
                          <span className="text-gray-700 dark:text-gray-300">{type}</span>
                          <div className="flex items-center">
                            <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-3">
                              <div 
                                className="bg-primary-600 h-2 rounded-full" 
                                style={{ width: `${(count / stats.totalSamples) * 100}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">{count}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Collection Period</h4>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <Calendar className="h-5 w-5 text-gray-500 mr-3" />
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Start Date</p>
                          <p className="font-medium text-gray-900 dark:text-white">{stats.dateRange.start}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-5 w-5 text-gray-500 mr-3" />
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">End Date</p>
                          <p className="font-medium text-gray-900 dark:text-white">{stats.dateRange.end}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-5 w-5 text-gray-500 mr-3" />
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Locations Covered</p>
                          <p className="font-medium text-gray-900 dark:text-white">{samples.length} Beach Sites</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}