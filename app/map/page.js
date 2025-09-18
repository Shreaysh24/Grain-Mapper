'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import Sidebar from '../../components/Sidebar'
import Header from '../../components/Header'
import Modal from '../../components/Modal'
import LoadingSpinner from '../../components/LoadingSpinner'
import { MapPin, Thermometer, Droplets, Camera, Calendar, Navigation } from 'lucide-react'

const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false })
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false })
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false })
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false })
const CircleMarker = dynamic(() => import('react-leaflet').then(mod => mod.CircleMarker), { ssr: false })

export default function MapPage() {
  const [samples, setSamples] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedSample, setSelectedSample] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)

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

  const handleMarkerClick = (sample) => {
    setSelectedSample(sample)
    setModalOpen(true)
  }

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

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
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 h-[calc(100vh-12rem)]">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Interactive Beach Sample Map</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Click on markers to view detailed sample information
              </p>
            </div>
            
            <div className="h-[calc(100%-5rem)] relative">
              <MapContainer
                center={[20.5937, 78.9629]}
                zoom={5}
                style={{ height: '100%', width: '100%' }}
                className="rounded-b-xl"
                scrollWheelZoom={true}
                zoomControl={true}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                
                {samples.map((sample) => {
                  // Color coding based on grain size
                  const getMarkerColor = (grainSize) => {
                    if (grainSize < 0.3) return '#10b981' // Green for very fine
                    if (grainSize < 0.4) return '#3b82f6' // Blue for fine
                    if (grainSize < 0.5) return '#f59e0b' // Yellow for medium
                    return '#ef4444' // Red for coarse
                  }
                  
                  return (
                    <CircleMarker
                      key={sample.id}
                      center={[sample.latitude, sample.longitude]}
                      radius={8}
                      pathOptions={{
                        color: getMarkerColor(sample.grainSize),
                        fillColor: getMarkerColor(sample.grainSize),
                        fillOpacity: 0.8,
                        weight: 2
                      }}
                      eventHandlers={{
                        click: () => handleMarkerClick(sample)
                      }}
                    >
                      <Popup>
                        <div className="p-3 min-w-[250px]">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="font-bold text-gray-900 text-base">{sample.location}</h3>
                              <p className="text-sm text-gray-600">{sample.state}</p>
                            </div>
                            <div className={`w-4 h-4 rounded-full`} style={{ backgroundColor: getMarkerColor(sample.grainSize) }}></div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-3 mb-3 text-sm">
                            <div className="bg-gray-50 rounded-lg p-2">
                              <p className="font-medium text-gray-700">Grain Size</p>
                              <p className="text-lg font-bold text-gray-900">{sample.grainSize}mm</p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-2">
                              <p className="font-medium text-gray-700">Beach Type</p>
                              <p className="text-sm font-semibold text-gray-900">{sample.beachType}</p>
                            </div>
                          </div>
                          
                          <div className="flex justify-between text-sm text-gray-600 mb-3">
                            <span><strong>Temp:</strong> {sample.temperature}°C</span>
                            <span><strong>Humidity:</strong> {sample.humidity}%</span>
                          </div>
                          
                          <button
                            onClick={() => handleMarkerClick(sample)}
                            className="w-full px-3 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors font-medium"
                          >
                            View Full Details
                          </button>
                        </div>
                      </Popup>
                    </CircleMarker>
                  )
                })}
              </MapContainer>
              
              {/* Legend */}
              <div className="absolute bottom-4 left-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 border border-gray-200 dark:border-gray-700">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3 text-sm">Grain Size Legend</h4>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-gray-700 dark:text-gray-300">Very Fine (&lt;0.3mm)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span className="text-gray-700 dark:text-gray-300">Fine (0.3-0.4mm)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <span className="text-gray-700 dark:text-gray-300">Medium (0.4-0.5mm)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <span className="text-gray-700 dark:text-gray-300">Coarse (&gt;0.5mm)</span>
                  </div>
                </div>
              </div>
              
              {/* Sample Count */}
              <div className="absolute top-4 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-2">
                  <Navigation className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{samples.length} Sample Points</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Sample Details"
      >
        {selectedSample && (
          <div className="space-y-6">
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-blue-50 dark:bg-blue-900/50 rounded-lg">
                <MapPin className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 dark:text-white text-lg">{selectedSample.location}</h4>
                <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">{selectedSample.state}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  <span className="font-medium">Coordinates:</span> {selectedSample.latitude.toFixed(4)}, {selectedSample.longitude.toFixed(4)}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                    <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Grain Size</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">{selectedSample.grainSize}mm</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                    <Thermometer className="h-4 w-4 text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Temperature</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">{selectedSample.temperature}°C</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                    <Droplets className="h-4 w-4 text-yellow-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Humidity</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">{selectedSample.humidity}%</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                    <Camera className="h-4 w-4 text-purple-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Device ID</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">{selectedSample.deviceId}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Collection Date</p>
                  <p className="text-base font-semibold text-gray-900 dark:text-white">{formatDate(selectedSample.timestamp)}</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
              <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Beach Classification</p>
              <p className="text-lg font-bold text-blue-900 dark:text-blue-100">{selectedSample.beachType}</p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}