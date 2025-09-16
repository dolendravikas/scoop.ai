"use client";

import { useState } from "react";
import styles from "./SearchBox.module.css";

interface SearchBoxProps {
  onSearch: (query: string) => void;
  loading: boolean;
}

export default function SearchBox({ onSearch, loading }: SearchBoxProps) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.searchBox}>
      <div className={styles.searchContainer}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask anything to ScoopAI"
          className={styles.searchInput}
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !query.trim()}
          className={`${styles.searchButton} ${loading ? styles.loading : ""}`}
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>
    </form>
  );
}
