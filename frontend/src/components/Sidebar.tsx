'use client';

export default function Sidebar() {
  return (
    <div className="sidebar">
      <div className="space-y-6">
        {/* Logo */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white">Scoop</h2>
          <p className="text-sm text-gray-400">AI Intelligence</p>
        </div>

        {/* Navigation */}
        <nav className="space-y-2">
          <a href="#" className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded">
            <i className="fas fa-home mr-3"></i>
            Dashboard
          </a>
          <a href="#" className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded">
            <i className="fas fa-search mr-3"></i>
            Search
          </a>
          <a href="#" className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded">
            <i className="fas fa-chart-line mr-3"></i>
            Analytics
          </a>
          <a href="#" className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded">
            <i className="fas fa-cog mr-3"></i>
            Settings
          </a>
        </nav>

        {/* Upgrade Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-4">
          <h3 className="text-white font-medium mb-2">Upgrade Plan</h3>
          <p className="text-blue-100 text-sm mb-3">
            Get unlimited searches and advanced features
          </p>
          <button className="w-full bg-white text-blue-600 py-2 px-4 rounded font-medium hover:bg-gray-100 transition-colors">
            Upgrade Now
          </button>
        </div>

        {/* User Profile */}
        <div className="flex items-center space-x-3 pt-6 border-t border-gray-700">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <i className="fas fa-user text-white text-sm"></i>
          </div>
          <div>
            <p className="text-white text-sm font-medium">User</p>
            <p className="text-gray-400 text-xs">Free Plan</p>
          </div>
        </div>

        {/* Install Option */}
        <div className="pt-4">
          <button className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded text-sm transition-colors">
            <i className="fas fa-download mr-2"></i>
            Install App
          </button>
        </div>
      </div>
    </div>
  );
}
