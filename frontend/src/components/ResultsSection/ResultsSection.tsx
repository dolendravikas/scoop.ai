"use client";

import styles from "./ResultsSection.module.css";

interface ResultsSectionProps {
  results: any;
}

export default function ResultsSection({ results }: ResultsSectionProps) {
  if (results.error) {
    return (
      <div className={styles.resultsSection}>
        <div className={styles.errorContainer}>
          <h3 className={styles.errorTitle}>Error</h3>
          <p className={styles.errorMessage}>{results.error}</p>
        </div>
      </div>
    );
  }

  if (!results.success) {
    return (
      <div className={styles.resultsSection}>
        <div className={styles.noResultsContainer}>
          <h3 className={styles.noResultsTitle}>No Results</h3>
          <p className={styles.noResultsMessage}>
            No data found for your search query.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.resultsSection}>
      {/* AI Analysis Summary */}
      <div className={styles.analysisContainer}>
        <h3 className={styles.analysisTitle}>
          AI Analysis Summary
          <span className={styles.aiModel}>
            {results.aiModel?.toUpperCase()}
          </span>
        </h3>

        <div className={styles.analysisInfo}>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Query:</span>
            <span className={styles.infoValue}>{results.query}</span>
          </div>

          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Data Sources:</span>
            <span className={styles.infoValue}>
              {results.platforms?.join(", ").toUpperCase()}
            </span>
          </div>

          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Posts Analyzed:</span>
            <span className={styles.infoValue}>{results.dataCount}</span>
          </div>
        </div>

        {results.analysis && (
          <div className={styles.analysisContent}>
            <h4 className={styles.analysisSubtitle}>AI Analysis:</h4>
            <div className={styles.analysisText}>{results.analysis}</div>
          </div>
        )}
      </div>

      {/* Raw Data Sources */}
      {results.rawData && results.rawData.length > 0 && (
        <div className={styles.rawDataContainer}>
          <h4 className={styles.rawDataTitle}>Raw Data Sources</h4>

          {/* Group data by platform */}
          {Object.entries(
            results.rawData.reduce((acc: any, item: any) => {
              if (!acc[item.platform]) acc[item.platform] = [];
              acc[item.platform].push(item);
              return acc;
            }, {})
          ).map(([platform, posts]: [string, any]) => (
            <div key={platform} className={styles.platformSection}>
              <h5 className={styles.platformHeader}>
                <i className={`fab fa-${platform} ${styles.platformIcon}`}></i>
                {platform.toUpperCase()} ({posts.length} posts)
              </h5>

              <div className={styles.postsContainer}>
                {posts.slice(0, 5).map((post: any, index: number) => (
                  <div key={index} className={styles.postItem}>
                    <div className={styles.postContent}>
                      {post.content?.substring(0, 200)}
                      {post.content?.length > 200 && "..."}
                    </div>
                    <div className={styles.postMeta}>
                      <span className={styles.postAuthor}>
                        {post.author || "Unknown"}
                      </span>
                      <span className={styles.postDate}>
                        {new Date(post.created_at).toLocaleDateString()}
                      </span>
                      {post.url && (
                        <a
                          href={post.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.postLink}
                        >
                          View Original
                        </a>
                      )}
                    </div>
                  </div>
                ))}

                {posts.length > 5 && (
                  <div className={styles.morePosts}>
                    ... and {posts.length - 5} more posts
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
