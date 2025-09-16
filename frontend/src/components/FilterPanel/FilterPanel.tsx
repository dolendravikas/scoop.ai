"use client";

import { useState } from "react";
import styles from "./FilterPanel.module.css";

interface FilterPanelProps {
  filters: {
    platforms: string[];
    aiModel: string;
    timeRange: string;
    keywords: string;
  };
  onFiltersChange: (filters: any) => void;
}

export default function FilterPanel({
  filters,
  onFiltersChange,
}: FilterPanelProps) {
  const [activePanel, setActivePanel] = useState<string | null>(null);

  const platforms = [
    { id: "twitter", name: "Twitter", icon: "fab fa-twitter" },
    { id: "reddit", name: "Reddit", icon: "fab fa-reddit" },
    { id: "linkedin", name: "LinkedIn", icon: "fab fa-linkedin" },
    { id: "quora", name: "Quora", icon: "fas fa-question-circle" },
  ];

  const aiModels = [
    {
      id: "gemini-1.5-flash",
      name: "Gemini 1.5 Flash",
      desc: "Fast & Efficient",
    },
    { id: "gemini-pro", name: "Gemini Pro", desc: "High Quality" },
    {
      id: "gemini-1.5-pro",
      name: "Gemini 1.5 Pro",
      desc: "Latest & Most Powerful",
    },
  ];

  const timeRanges = [
    { id: "day", name: "Past Day" },
    { id: "week", name: "Past Week" },
    { id: "month", name: "Past Month" },
    { id: "year", name: "Past Year" },
  ];

  const togglePlatform = (platformId: string) => {
    const newPlatforms = filters.platforms.includes(platformId)
      ? filters.platforms.filter((p) => p !== platformId)
      : [...filters.platforms, platformId];

    onFiltersChange({ ...filters, platforms: newPlatforms });
  };

  const togglePanel = (panelId: string) => {
    setActivePanel(activePanel === panelId ? null : panelId);
  };

  return (
    <div className={styles.filterContainer}>
      {/* Platforms Filter */}
      <div className={styles.relative}>
        <button
          onClick={() => togglePanel("platforms")}
          className={styles.filterButton}
          title="Select Platforms"
        >
          <i className="fas fa-globe"></i>
        </button>
        {activePanel === "platforms" && (
          <div className={styles.filterPanel}>
            <h3 className={styles.panelTitle}>Social Media Platforms</h3>
            <div className={styles.optionList}>
              {platforms.map((platform) => (
                <label key={platform.id} className={styles.optionItem}>
                  <input
                    type="checkbox"
                    checked={filters.platforms.includes(platform.id)}
                    onChange={() => togglePlatform(platform.id)}
                    className={styles.checkbox}
                  />
                  <i className={`${platform.icon} ${styles.optionIcon}`}></i>
                  <span className={styles.optionLabel}>{platform.name}</span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* AI Model Filter */}
      <div className={styles.relative}>
        <button
          onClick={() => togglePanel("aiModel")}
          className={styles.filterButton}
          title="Select AI Model"
        >
          <i className="fas fa-robot"></i>
        </button>
        {activePanel === "aiModel" && (
          <div className={styles.filterPanel}>
            <h3 className={styles.panelTitle}>AI Model</h3>
            <div className={styles.optionList}>
              {aiModels.map((model) => (
                <label key={model.id} className={styles.optionItem}>
                  <input
                    type="radio"
                    name="aiModel"
                    value={model.id}
                    checked={filters.aiModel === model.id}
                    onChange={(e) =>
                      onFiltersChange({ ...filters, aiModel: e.target.value })
                    }
                    className={styles.radio}
                  />
                  <div>
                    <div className={styles.optionLabel}>{model.name}</div>
                    <div className={styles.optionDescription}>{model.desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Time Range Filter */}
      <div className={styles.relative}>
        <button
          onClick={() => togglePanel("timeRange")}
          className={styles.filterButton}
          title="Select Time Range"
        >
          <i className="fas fa-clock"></i>
        </button>
        {activePanel === "timeRange" && (
          <div className={styles.filterPanel}>
            <h3 className={styles.panelTitle}>Time Range</h3>
            <div className={styles.optionList}>
              {timeRanges.map((range) => (
                <label key={range.id} className={styles.optionItem}>
                  <input
                    type="radio"
                    name="timeRange"
                    value={range.id}
                    checked={filters.timeRange === range.id}
                    onChange={(e) =>
                      onFiltersChange({ ...filters, timeRange: e.target.value })
                    }
                    className={styles.radio}
                  />
                  <span className={styles.optionLabel}>{range.name}</span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Keywords Filter */}
      <div className={styles.relative}>
        <button
          onClick={() => togglePanel("keywords")}
          className={styles.filterButton}
          title="Add Keywords"
        >
          <i className="fas fa-tags"></i>
        </button>
        {activePanel === "keywords" && (
          <div className={styles.filterPanel}>
            <h3 className={styles.panelTitle}>Keywords</h3>
            <input
              type="text"
              value={filters.keywords}
              onChange={(e) =>
                onFiltersChange({ ...filters, keywords: e.target.value })
              }
              placeholder="Enter keywords (comma separated)"
              className={styles.keywordsInput}
            />
          </div>
        )}
      </div>
    </div>
  );
}
