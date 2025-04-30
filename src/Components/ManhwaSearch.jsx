import React, { useState, useEffect, useCallback } from 'react';
import './ManhwaSearch.css';

// Mock data to use when API fails
const MOCK_MANHWA_DATA = [
  {
    id: "32d76d19-8a05-4db0-9fc2-e0b0648fe9d0",
    type: "Manhwa",
    attributes: {
      title: { en: "Solo Leveling" },
      status: "completed",
      rating: { average: 9.2 }
    },
    mockCover: "https://via.placeholder.com/40x60?text=SL"
  },
  {
    id: "a1c7c817-4e59-43b7-9365-09675a149a6f",
    type: "Manhwa",
    attributes: {
      title: { en: "The Beginning After The End" },
      status: "ongoing",
      rating: { average: 8.9 }
    },
    mockCover: "https://via.placeholder.com/40x60?text=TBATE"
  },
  {
    id: "3c9ff16a-4f87-4fdc-a5b0-8d97ef0e126c",
    type: "Manhwa",
    attributes: {
      title: { en: "Tower of God" },
      status: "ongoing",
      rating: { average: 8.7 }
    },
    mockCover: "https://via.placeholder.com/40x60?text=TOG"
  }
];

function ManhwaSearch() {
  const [searchInput, setSearchInput] = useState('');
  const [query, setQuery] = useState('Solo Leveling');
  const [manhwaList, setManhwaList] = useState([]);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [useMockData, setUseMockData] = useState(false);

  const [uploadTitle, setUploadTitle] = useState('');
  const [previewImage, setPreviewImage] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');

  // Function to filter mock data based on search query
  const filterMockData = (query) => {
    return MOCK_MANHWA_DATA.filter(item => 
      item.attributes.title.en.toLowerCase().includes(query.toLowerCase())
    );
  };

  // Memoize the fetchManhwas function
  const fetchManhwas = useCallback(async () => {
    if (!query) return;

    setLoading(true);
    setError('');

    try {
      // First attempt to fetch from the real API
      const url = `https://api.mangadex.org/manga?title=${encodeURIComponent(query)}&limit=10&offset=${(page - 1) * 10}&includes[]=cover_art`;
      
      let response;
      let data;
      
      try {
        response = await fetch(url, {
          headers: {
            'Accept': 'application/json',
          },
          signal: AbortSignal.timeout(8000) // 8 second timeout
        });
        
        if (!response.ok) {
          throw new Error(`API responded with status: ${response.status}`);
        }
        
        data = await response.json();
        
        if (data.result === 'ok') {
          setManhwaList(data.data || []);
          setHasNextPage(data.total > page * 10 && page < 5);
          setUseMockData(false);
        } else {
          throw new Error('API request failed');
        }
      } catch (apiError) {
        console.error('API fetch failed, using mock data:', apiError);
        
        // Fallback to mock data
        const filteredMock = filterMockData(query);
        setManhwaList(filteredMock);
        setHasNextPage(false);
        setUseMockData(true);
        
        // Only show error if no mock data matches
        if (filteredMock.length === 0) {
          setError('Failed to fetch from API. No matching results in local data.');
        }
      }
    } catch (err) {
      console.error('Failed to fetch manhwas:', err);
      setError('Failed to fetch manhwas. Please try again later.');
      setManhwaList([]);
    } finally {
      setLoading(false);
    }
  }, [query, page]);

  useEffect(() => {
    fetchManhwas();
  }, [fetchManhwas]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    setQuery(searchInput.trim());
    setPage(1);
  };

  const getFormattedManhwaData = (manhwa) => {
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
    // Check if using mock data with predefined cover
    if (useMockData && manhwa.mockCover) {
      return manhwa.mockCover;
    }
    
    if (!manhwa || !manhwa.relationships) return null;
    
    const coverRel = manhwa.relationships.find((rel) => rel.type === 'cover_art');
    if (!coverRel || !coverRel.attributes || !coverRel.attributes.fileName) return null;
    
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
      {useMockData && manhwaList.length > 0 && (
        <div className="notice-message">Using local data. API connection failed.</div>
      )}

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
              disabled={page === 1 || useMockData}
              className="pagination-button"
            >
              Previous
            </button>
            <span className="page-info">Page {page}</span>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={!hasNextPage || useMockData}
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