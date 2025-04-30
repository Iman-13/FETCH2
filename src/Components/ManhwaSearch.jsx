import React, { useState, useEffect } from 'react';
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

  const fetchManhwas = async () => {
    if (!query) return;

    setLoading(true);
    setError('');

    try {
      const url = `https://api.mangadex.org/manga?title=${encodeURIComponent(query)}&limit=10&offset=${(page - 1) * 10}&includes[]=cover_art`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.result === 'ok') {
        setManhwaList(data.data || []);
        // Only allow max 5 pages
        setHasNextPage(data.total > page * 10 && page < 5);
      } else {
        throw new Error('API request failed');
      }
    } catch (err) {
      console.error('Failed to fetch manhwas:', err);
      setError('Failed to fetch manhwas. Please try again later.');
      setManhwaList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchManhwas();
  }, [query, page]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    setQuery(searchInput.trim());
    setPage(1);
  };

  const getFormattedManhwaData = (manhwa) => {
    const title = manhwa.attributes?.title?.en || manhwa.attributes?.title?.['ja-ro'] || 'N/A';
    const type = manhwa.type || 'Manga';
    const status = manhwa.attributes?.status || 'N/A';
    const score = manhwa.attributes?.rating?.average || 'N/A';

    return {
      title,
      type,
      status,
      score
    };
  };

  const getCoverUrl = (manhwa) => {
    const coverRel = manhwa.relationships?.find((rel) => rel.type === 'cover_art');
    if (!coverRel) return null;
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
                    <tr key={manhwa.id}>
                      <td>{(page - 1) * 10 + index + 1}</td>
                      <td>
                        {coverUrl ? (
                          <img src={coverUrl} alt="cover" className="manhwa-thumbnail" />
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
                const file = e.target.files[0];
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
