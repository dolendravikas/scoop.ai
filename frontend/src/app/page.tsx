"use client";

import { useState } from "react";
import SearchBox from "@/components/SearchBox";
import FilterPanel from "@/components/FilterPanel";
import ResultsSection from "@/components/ResultsSection";
import Sidebar from "@/components/Sidebar";
import { appConfig } from "@/config/app.config";
import { searchScoop } from "@/utils/api";
import styles from "./page.module.css";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    platforms: appConfig.defaults.platforms,
    aiModel: appConfig.defaults.aiModel,
    timeRange: appConfig.defaults.timeRange,
    keywords: "",
  });
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    setLoading(true);

    try {
      const data = await searchScoop({
        query,
        ...filters,
      });
      setResults(data);
    } catch (error) {
      console.error("Search error:", error);
      setResults({ error: "Search failed. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className={styles.mainContent}>
        <div className={styles.contentWrapper}>
          {/* Logo */}
          <div className={styles.logoSection}>
            <h1 className={styles.logoTitle}>Scoop</h1>
            <p className={styles.logoSubtitle}>
              AI-Powered Social Media Intelligence
            </p>
          </div>

          {/* Search Box */}
          <div className={styles.searchSection}>
            <SearchBox onSearch={handleSearch} loading={loading} />
          </div>

          {/* Filter Panel */}
          <div className={styles.filterSection}>
            <FilterPanel filters={filters} onFiltersChange={setFilters} />
          </div>

          {/* Results */}
          {results && (
            <div className={styles.resultsSection}>
              <ResultsSection results={results} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
