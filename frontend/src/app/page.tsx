'use client';

import { useState } from 'react';
import SearchBox from '@/components/SearchBox';
import FilterPanel from '@/components/FilterPanel';
import ResultsSection from '@/components/ResultsSection';
import Sidebar from '@/components/Sidebar';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    platforms: ['reddit'],
    aiModel: 'gemini-pro',
    timeRange: 'week',
    keywords: ''
  });
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    setLoading(true);
    
    try {
      const response = await fetch('/api/scoop', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          ...filters
        })
      });
      
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error('Search error:', error);
      setResults({ error: 'Search failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="flex">
        {/* Sidebar */}
        <Sidebar />
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <div className="w-full max-w-4xl">
            {/* Logo */}
            <div className="text-center mb-8">
              <h1 className="text-6xl font-bold text-white mb-4">Scoop</h1>
              <p className="text-xl text-gray-400">AI-Powered Social Media Intelligence</p>
            </div>
            
            {/* Search Box */}
            <SearchBox onSearch={handleSearch} loading={loading} />
            
            {/* Filter Panel */}
            <FilterPanel filters={filters} onFiltersChange={setFilters} />
            
            {/* Results */}
            {results && (
              <ResultsSection results={results} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
