import React, { useState, useEffect, useCallback } from 'react';
import './ManhwaSearch.css';

function ManhwaSearch() {
  const [searchInput, setSearchInput] = useState('');
  const [query, setQuery] = useState('Solo Leveling');
  const [manhwaList, setManhwaList] = useState([]);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [uploadTitle, setUploadTitle] = useState('');
  const [previewImage, setPreviewImage] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');

  // Memoize the fetchManhwas function to prevent unnecessary re-creations
  const fetchManhwas = useCallback(async () => {
    if (!query) return;

    setLoading(true);
    setError('');

    try {
      // Add proxy URL if needed to avoid CORS issues
      const url = `https://api.mangadex.org/manga?title=${encodeURIComponent(query)}&limit=10&offset=${(page - 1) * 10}&includes[]=cover_art`;
      
      const response = await fetch(url, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        // Add error handling for fetch timeouts
        signal: AbortSignal.timeout(10000) // 10 second timeout
      });
      
      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }
      
      const data = await response.json();

      if (data.result === 'ok') {
        setManhwaList(data.data || []);
        // Only allow max 5 pages
        setHasNextPage(data.total > page * 10 && page < 5);
      } else {
        throw new Error('API request failed: ' + (data.errors?.[0]?.detail || 'Unknown error'));
      }
    } catch (err) {
      console.error('Failed to fetch manhwas:', err);
      setError('Failed to fetch manhwas. Please try again later.');
      setManhwaList([]);
    } finally {
      setLoading(false);
    }
  }, [query, page]); // This ensures fetchManhwas is updated when query or page changes

  useEffect(() => {
    fetchManhwas();
    
    // Add cleanup function to abort fetch on unmount
    return () => {
      // If using AbortController, you would abort here
    };
  }, [fetchManhwas]);  // Add fetchManhwas to the dependency array

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    setQuery(searchInput.trim());
    setPage(1);
  };

  const getFormattedManhwaData = (manhwa) => {
    // Defensive coding to handle unexpected API response formats
    if (!manhwa || !manhwa.attributes) {
      return {
        title: 'N/A',
        type: 'N/A',
        status: 'N/A',
        score: 'N/A'
      };
    }
    
    // Safely access nested properties
    const title = 
      manhwa.attributes.title?.en || 
      manhwa.attributes.title?.['ja-ro'] || 
      Object.values(manhwa.attributes.title || {})[0] || 
      'N/A';
      
    const type = manhwa.type || 'Manga';
    const status = manhwa.attributes.status || 'N/A';
    const score = manhwa.attributes.rating?.average || 'N/A';

    return {
      title,
      type,
      status,
      score
    };
  };

  const getCoverUrl = (manhwa) => {
    if (!manhwa || !manhwa.relationships) return null;
    
    const coverRel = manhwa.relationships.find((rel) => rel.type === 'cover_art');
    if (!coverRel || !coverRel.attributes || !coverRel.attributes.fileName) return null;
    
    // Using https explicitly
    return `https://uploads.mangadex.org/covers/${manhwa.id}/${coverRel.attributes.fileName}.256.jpg`;
  };

  return (
    <div className="manhwa-search-container">
      <h2>KaUmay Scan</h2>

      <form onSubmit={handleSubmit} className="search-form">
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search for a manhwa..."
          className="search-input"
        />
        <button type="submit" className="search-button">Search</button>
      </form>

      {loading && <div className="loading-indicator">Loading...</div>}
      {error && <div className="error-message">{error}</div>}

      {!loading && manhwaList.length > 0 ? (
        <>
          <div className="table-container">
            <table className="manhwa-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Cover</th>
                  <th>Title</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Score</th>
                </tr>
              </thead>
              <tbody>
                {manhwaList.map((manhwa, index) => {
                  const formattedData = getFormattedManhwaData(manhwa);
                  const coverUrl = getCoverUrl(manhwa);
                  return (
                    <tr key={manhwa.id || index}>
                      <td>{(page - 1) * 10 + index + 1}</td>
                      <td>
                        {coverUrl ? (
                          <img 
                            src={coverUrl} 
                            alt="cover" 
                            className="manhwa-thumbnail" 
                            onError={(e) => {
                              // Fallback for failed image loads
                              e.target.onerror = null;
                              e.target.src = "https://via.placeholder.com/40x40?text=N/A";
                            }} 
                          />
                        ) : 'N/A'}
                      </td>
                      <td>{formattedData.title}</td>
                      <td>{formattedData.type}</td>
                      <td>{formattedData.status}</td>
                      <td>{formattedData.score}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="pagination">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="pagination-button"
            >
              Previous
            </button>
            <span className="page-info">Page {page}</span>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={!hasNextPage}
              className="pagination-button"
            >
              Next
            </button>
          </div>
        </>
      ) : !loading && query ? (
        <div className="no-results">No results found for "{query}".</div>
      ) : null}

      {/* Upload Section */}
      <div className="upload-section">
        <h3>Optional: Upload Your Own Manhwa</h3>
        <form className="upload-form" onSubmit={(e) => {
          e.preventDefault();
          setUploadStatus('Uploading...');
          setTimeout(() => {
            setUploadStatus('Upload successful!');
          }, 1500);
        }}>
          <div className="upload-input-group">
            <input
              type="file"
              accept="image/*"
              className="file-input"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setPreviewImage(reader.result);
                  };
                  reader.readAsDataURL(file);
                }
              }}
            />
            <input
              type="text"
              placeholder="Enter manhwa title"
              className="title-input"
              value={uploadTitle}
              onChange={(e) => setUploadTitle(e.target.value)}
            />
          </div>

          {previewImage && (
            <div className="preview-container">
              <img src={previewImage} alt="Preview" className="image-preview" />
              <div>{uploadTitle}</div>
            </div>
          )}

          <button type="submit" className="upload-button" disabled={!previewImage || !uploadTitle}>
            Upload
          </button>
          {uploadStatus && (
            <div className={`upload-status ${uploadStatus === 'Upload successful!' ? 'success' : ''}`}>
              {uploadStatus}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default ManhwaSearch;