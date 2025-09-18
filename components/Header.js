'use client'

import { Moon, Sun, Bell } from 'lucide-react'
import { useTheme } from '../app/client-layout'

export default function Header() {
  const { darkMode, toggleDarkMode } = useTheme()

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
      <div className="px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex-1 ml-12 lg:ml-0">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">
              Beach Grain Size Mapping Dashboard
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 hidden sm:block">
              Monitor and analyze coastal sediment data across Indian beaches
            </p>
          </div>
          
          <div className="flex items-center space-x-2 sm:space-x-4">
            <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors relative">
              <Bell className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
            </button>
            
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {darkMode ? (
                <Sun className="h-5 w-5 text-yellow-500" />
              ) : (
                <Moon className="h-5 w-5 text-gray-600" />
              )}
            </button>
            
            <div className="hidden sm:flex items-center space-x-2 ml-4 pl-4 border-l border-gray-200 dark:border-gray-700">
              <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-primary-600 dark:text-primary-400">U</span>
              </div>
              <div className="text-sm">
                <p className="font-medium text-gray-900 dark:text-white">User</p>
                <p className="text-gray-500 dark:text-gray-400">Researcher</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}