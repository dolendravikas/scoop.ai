'use client';

interface ResultsSectionProps {
  results: any;
}

export default function ResultsSection({ results }: ResultsSectionProps) {
  if (results.error) {
    return (
      <div className="results-section">
        <div className="bg-red-900 border border-red-700 rounded-lg p-4">
          <h3 className="text-red-400 font-medium mb-2">Error</h3>
          <p className="text-red-300">{results.error}</p>
        </div>
      </div>
    );
  }

  if (!results.success) {
    return (
      <div className="results-section">
        <div className="bg-yellow-900 border border-yellow-700 rounded-lg p-4">
          <h3 className="text-yellow-400 font-medium mb-2">No Results</h3>
          <p className="text-yellow-300">No data found for your search query.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="results-section">
      {/* AI Analysis Summary */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
        <h3 className="text-xl font-bold text-white mb-4">
          AI Analysis Summary ({results.aiModel?.toUpperCase()})
        </h3>
        
        <div className="space-y-4">
          <div>
            <span className="text-gray-400">Query:</span>
            <span className="text-white ml-2">{results.query}</span>
          </div>
          
          <div>
            <span className="text-gray-400">Data Sources:</span>
            <span className="text-white ml-2">
              {results.platforms?.join(', ').toUpperCase()}
            </span>
          </div>
          
          <div>
            <span className="text-gray-400">Posts Analyzed:</span>
            <span className="text-white ml-2">{results.dataCount}</span>
          </div>
        </div>

        {results.analysis && (
          <div className="mt-6">
            <h4 className="text-lg font-semibold text-white mb-3">AI Analysis:</h4>
            <div className="bg-gray-900 border border-gray-600 rounded p-4">
              <pre className="text-gray-300 whitespace-pre-wrap text-sm">
                {results.analysis}
              </pre>
            </div>
          </div>
        )}
      </div>

      {/* Raw Data Sources */}
      {results.rawData && results.rawData.length > 0 && (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-white mb-4">Raw Data Sources</h4>
          
          {/* Group data by platform */}
          {Object.entries(
            results.rawData.reduce((acc: any, item: any) => {
              if (!acc[item.platform]) acc[item.platform] = [];
              acc[item.platform].push(item);
              return acc;
            }, {})
          ).map(([platform, posts]: [string, any]) => (
            <div key={platform} className="mb-6">
              <h5 className="text-md font-medium text-white mb-3 flex items-center">
                <i className={`fab fa-${platform} text-blue-400 mr-2`}></i>
                {platform.toUpperCase()} ({posts.length} posts)
              </h5>
              
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {posts.slice(0, 5).map((post: any, index: number) => (
                  <div key={index} className="post-item">
                    <div className="text-white text-sm mb-2">
                      {post.content?.substring(0, 200)}
                      {post.content?.length > 200 && '...'}
                    </div>
                    <div className="flex justify-between items-center text-xs text-gray-400">
                      <span className="font-medium">{post.author || 'Unknown'}</span>
                      <span>{new Date(post.created_at).toLocaleDateString()}</span>
                      {post.url && (
                        <a
                          href={post.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300"
                        >
                          View Original
                        </a>
                      )}
                    </div>
                  </div>
                ))}
                
                {posts.length > 5 && (
                  <div className="text-center text-gray-400 text-sm py-2">
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
