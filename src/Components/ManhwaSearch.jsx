import React, { useState, useEffect, useCallback } from 'react';
import './ManhwaSearch.css';

// Extended mock data with 30 manhwa titles
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
  },
  {
    id: "5e5b8e31-9a3d-4169-a57c-6c9b2c2f91eb",
    type: "Manhwa",
    attributes: {
      title: { en: "God of High School" },
      status: "ongoing",
      rating: { average: 8.5 }
    },
    mockCover: "https://via.placeholder.com/40x60?text=GOH"
  },
  {
    id: "7d818b84-0e2c-48d7-8c1f-8a5c23b9349a",
    type: "Manhwa",
    attributes: {
      title: { en: "Noblesse" },
      status: "completed",
      rating: { average: 8.6 }
    },
    mockCover: "https://via.placeholder.com/40x60?text=NB"
  },
  {
    id: "4f7de9b2-95c3-43e3-9d3c-8a23f6b9e7a8",
    type: "Manhwa",
    attributes: {
      title: { en: "Omniscient Reader's Viewpoint" },
      status: "ongoing",
      rating: { average: 9.1 }
    },
    mockCover: "https://via.placeholder.com/40x60?text=ORV"
  },
  {
    id: "2a9e5d1c-8173-4b6f-9e47-1ba9c64f5a3b",
    type: "Manhwa",
    attributes: {
      title: { en: "The Gamer" },
      status: "ongoing",
      rating: { average: 7.9 }
    },
    mockCover: "https://via.placeholder.com/40x60?text=TG"
  },
  {
    id: "6c8d9a7b-2e3f-4d5c-9a8b-7c6d5e4f3a2d",
    type: "Manhwa",
    attributes: {
      title: { en: "Hardcore Leveling Warrior" },
      status: "completed",
      rating: { average: 8.3 }
    },
    mockCover: "https://via.placeholder.com/40x60?text=HLW"
  },
  {
    id: "1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p",
    type: "Manhwa",
    attributes: {
      title: { en: "Eleceed" },
      status: "ongoing",
      rating: { average: 9.0 }
    },
    mockCover: "https://via.placeholder.com/40x60?text=EL"
  },
  {
    id: "7p8o9i-6u7y8t-5r4e3w-2q1a0z",
    type: "Manhwa",
    attributes: {
      title: { en: "Lookism" },
      status: "ongoing",
      rating: { average: 8.8 }
    },
    mockCover: "https://via.placeholder.com/40x60?text=LK"
  },
  {
    id: "9d8f7g6h-5j4k3l-2m1n0p-q9r8s7",
    type: "Manhwa",
    attributes: {
      title: { en: "Unholy Blood" },
      status: "completed",
      rating: { average: 8.4 }
    },
    mockCover: "https://via.placeholder.com/40x60?text=UB"
  },
  {
    id: "6t5y4u3i-2o1p0a-9s8d7f-6g5h4j",
    type: "Manhwa",
    attributes: {
      title: { en: "Nano Machine" },
      status: "ongoing",
      rating: { average: 8.0 }
    },
    mockCover: "https://via.placeholder.com/40x60?text=NM"
  },
  {
    id: "3k2l1z-0x9c8v-7b6n5m-4q3w2e",
    type: "Manhwa",
    attributes: {
      title: { en: "The Legend of the Northern Blade" },
      status: "ongoing",
      rating: { average: 9.3 }
    },
    mockCover: "https://via.placeholder.com/40x60?text=LNB"
  },
  {
    id: "1r2t3y-4u5i6o-7p8a9s-0d1f2g",
    type: "Manhwa",
    attributes: {
      title: { en: "Sweet Home" },
      status: "completed",
      rating: { average: 8.7 }
    },
    mockCover: "https://via.placeholder.com/40x60?text=SH"
  },
  {
    id: "3h4j5k-6l7z8x-9c0v1b-2n3m4q",
    type: "Manhwa",
    attributes: {
      title: { en: "Bastard" },
      status: "completed",
      rating: { average: 8.9 }
    },
    mockCover: "https://via.placeholder.com/40x60?text=BST"
  },
  {
    id: "5w6e7r-8t9y0u-1i2o3p-4a5s6d",
    type: "Manhwa",
    attributes: {
      title: { en: "How to Fight" },
      status: "ongoing",
      rating: { average: 8.2 }
    },
    mockCover: "https://via.placeholder.com/40x60?text=HTF"
  },
  {
    id: "7f8g9h-0j1k2l-3z4x5c-6v7b8n",
    type: "Manhwa",
    attributes: {
      title: { en: "Weak Hero" },
      status: "ongoing",
      rating: { average: 8.8 }
    },
    mockCover: "https://via.placeholder.com/40x60?text=WH"
  },
  {
    id: "9m0q1w-2e3r4t-5y6u7i-8o9p0a",
    type: "Manhwa",
    attributes: {
      title: { en: "Wind Breaker" },
      status: "ongoing",
      rating: { average: 8.6 }
    },
    mockCover: "https://via.placeholder.com/40x60?text=WB"
  },
  {
    id: "1s2d3f-4g5h6j-7k8l9z-0x1c2v",
    type: "Manhwa",
    attributes: {
      title: { en: "Overgeared" },
      status: "ongoing",
      rating: { average: 8.1 }
    },
    mockCover: "https://via.placeholder.com/40x60?text=OG"
  },
  {
    id: "3b4n5m-6q7w8e-9r0t1y-2u3i4o",
    type: "Manhwa",
    attributes: {
      title: { en: "A Returner's Magic Should Be Special" },
      status: "ongoing",
      rating: { average: 8.3 }
    },
    mockCover: "https://via.placeholder.com/40x60?text=ARMS"
  },
  {
    id: "5p6a7s-8d9f0g-1h2j3k-4l5z6x",
    type: "Manhwa",
    attributes: {
      title: { en: "Mercenary Enrollment" },
      status: "ongoing",
      rating: { average: 8.5 }
    },
    mockCover: "https://via.placeholder.com/40x60?text=ME"
  },
  {
    id: "7c8v9b-0n1m2q-3w4e5r-6t7y8u",
    type: "Manhwa",
    attributes: {
      title: { en: "Girls of the Wild's" },
      status: "completed",
      rating: { average: 7.8 }
    },
    mockCover: "https://via.placeholder.com/40x60?text=GW"
  },
  {
    id: "9i0o1p-2a3s4d-5f6g7h-8j9k0l",
    type: "Manhwa",
    attributes: {
      title: { en: "Magic Emperor" },
      status: "ongoing",
      rating: { average: 8.0 }
    },
    mockCover: "https://via.placeholder.com/40x60?text=ME"
  },
  {
    id: "1z2x3c-4v5b6n-7m8q9w-0e1r2t",
    type: "Manhwa",
    attributes: {
      title: { en: "I Am The Sorcerer King" },
      status: "completed",
      rating: { average: 7.9 }
    },
    mockCover: "https://via.placeholder.com/40x60?text=ISK"
  },
  {
    id: "3y4u5i-6o7p8a-9s0d1f-2g3h4j",
    type: "Manhwa",
    attributes: {
      title: { en: "The Boxer" },
      status: "ongoing",
      rating: { average: 9.2 }
    },
    mockCover: "https://via.placeholder.com/40x60?text=TB"
  },
  {
    id: "5k6l7z-8x9c0v-1b2n3m-4q5w6e",
    type: "Manhwa",
    attributes: {
      title: { en: "Study Group" },
      status: "ongoing",
      rating: { average: 8.4 }
    },
    mockCover: "https://via.placeholder.com/40x60?text=SG"
  },
  {
    id: "7r8t9y-0u1i2o-3p4a5s-6d7f8g",
    type: "Manhwa",
    attributes: {
      title: { en: "Dr. Frost" },
      status: "ongoing",
      rating: { average: 8.2 }
    },
    mockCover: "https://via.placeholder.com/40x60?text=DF"
  },
  {
    id: "9h0j1k-2l3z4x-5c6v7b-8n9m0q",
    type: "Manhwa",
    attributes: {
      title: { en: "Tomb Raider King" },
      status: "ongoing",
      rating: { average: 7.7 }
    },
    mockCover: "https://via.placeholder.com/40x60?text=TRK"
  },
  {
    id: "1w2e3r-4t5y6u-7i8o9p-0a1s2d",
    type: "Manhwa",
    attributes: {
      title: { en: "Kill the Hero" },
      status: "ongoing",
      rating: { average: 8.1 }
    },
    mockCover: "https://via.placeholder.com/40x60?text=KTH"
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

  // Function to paginate mock data
  const paginateMockData = (data, currentPage, itemsPerPage = 10) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return {
      items: data.slice(startIndex, endIndex),
      hasMore: endIndex < data.length
    };
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
        const paginatedData = paginateMockData(filteredMock, page);
        
        setManhwaList(paginatedData.items);
        setHasNextPage(paginatedData.hasMore);
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