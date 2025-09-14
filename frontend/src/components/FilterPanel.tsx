'use client';

import { useState } from 'react';

interface FilterPanelProps {
  filters: {
    platforms: string[];
    aiModel: string;
    timeRange: string;
    keywords: string;
  };
  onFiltersChange: (filters: any) => void;
}

export default function FilterPanel({ filters, onFiltersChange }: FilterPanelProps) {
  const [activePanel, setActivePanel] = useState<string | null>(null);

  const platforms = [
    { id: 'twitter', name: 'Twitter', icon: 'fab fa-twitter' },
    { id: 'reddit', name: 'Reddit', icon: 'fab fa-reddit' },
    { id: 'linkedin', name: 'LinkedIn', icon: 'fab fa-linkedin' },
    { id: 'quora', name: 'Quora', icon: 'fas fa-question-circle' },
  ];

  const aiModels = [
    { id: 'gpt-4', name: 'GPT-4', desc: 'Most Advanced' },
    { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', desc: 'Fast' },
    { id: 'claude-3', name: 'Claude 3', desc: 'Anthropic' },
    { id: 'gemini-pro', name: 'Gemini 1.5 Flash', desc: 'Google (Free)' },
  ];

  const timeRanges = [
    { id: 'day', name: 'Past Day' },
    { id: 'week', name: 'Past Week' },
    { id: 'month', name: 'Past Month' },
    { id: 'year', name: 'Past Year' },
  ];

  const togglePlatform = (platformId: string) => {
    const newPlatforms = filters.platforms.includes(platformId)
      ? filters.platforms.filter(p => p !== platformId)
      : [...filters.platforms, platformId];
    
    onFiltersChange({ ...filters, platforms: newPlatforms });
  };

  const togglePanel = (panelId: string) => {
    setActivePanel(activePanel === panelId ? null : panelId);
  };

  return (
    <div className="flex justify-center mt-6 space-x-2">
      {/* Platforms Filter */}
      <div className="relative">
        <button
          onClick={() => togglePanel('platforms')}
          className="filter-icon"
          title="Select Platforms"
        >
          <i className="fas fa-globe"></i>
        </button>
        {activePanel === 'platforms' && (
          <div className="filter-panel">
            <h3 className="text-white font-medium mb-3">Social Media Platforms</h3>
            <div className="space-y-2">
              {platforms.map(platform => (
                <label key={platform.id} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.platforms.includes(platform.id)}
                    onChange={() => togglePlatform(platform.id)}
                    className="rounded border-gray-600 text-blue-600 focus:ring-blue-500"
                  />
                  <i className={`${platform.icon} text-blue-400`}></i>
                  <span className="text-white">{platform.name}</span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* AI Model Filter */}
      <div className="relative">
        <button
          onClick={() => togglePanel('aiModel')}
          className="filter-icon"
          title="Select AI Model"
        >
          <i className="fas fa-robot"></i>
        </button>
        {activePanel === 'aiModel' && (
          <div className="filter-panel">
            <h3 className="text-white font-medium mb-3">AI Model</h3>
            <div className="space-y-2">
              {aiModels.map(model => (
                <label key={model.id} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="aiModel"
                    value={model.id}
                    checked={filters.aiModel === model.id}
                    onChange={(e) => onFiltersChange({ ...filters, aiModel: e.target.value })}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <div className="text-white font-medium">{model.name}</div>
                    <div className="text-gray-400 text-sm">{model.desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Time Range Filter */}
      <div className="relative">
        <button
          onClick={() => togglePanel('timeRange')}
          className="filter-icon"
          title="Select Time Range"
        >
          <i className="fas fa-clock"></i>
        </button>
        {activePanel === 'timeRange' && (
          <div className="filter-panel">
            <h3 className="text-white font-medium mb-3">Time Range</h3>
            <div className="space-y-2">
              {timeRanges.map(range => (
                <label key={range.id} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="timeRange"
                    value={range.id}
                    checked={filters.timeRange === range.id}
                    onChange={(e) => onFiltersChange({ ...filters, timeRange: e.target.value })}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-white">{range.name}</span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Keywords Filter */}
      <div className="relative">
        <button
          onClick={() => togglePanel('keywords')}
          className="filter-icon"
          title="Add Keywords"
        >
          <i className="fas fa-tags"></i>
        </button>
        {activePanel === 'keywords' && (
          <div className="filter-panel">
            <h3 className="text-white font-medium mb-3">Keywords</h3>
            <input
              type="text"
              value={filters.keywords}
              onChange={(e) => onFiltersChange({ ...filters, keywords: e.target.value })}
              placeholder="Enter keywords (comma separated)"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400"
            />
          </div>
        )}
      </div>
    </div>
  );
}
