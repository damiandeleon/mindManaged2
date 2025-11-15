import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./MedSearch.css";

/**
 * MedSearch Component
 *
 * This page allows users to search for medication information using the DrugBank API.
 * Users can search by drug name and view detailed information including:
 * - Drug name and prescribable name
 * - RxNorm prescribable name
 * - NDC product codes and other local product IDs
 * - Route of administration
 * - Dosage form and strength
 */
const MedSearch = () => {
  // State for search input
  const [searchTerm, setSearchTerm] = useState("");

  // State for search results from DrugBank API
  const [searchResults, setSearchResults] = useState([]);

  // Loading state during API calls
  const [loading, setLoading] = useState(false);

  // Error state for handling API errors
  const [error, setError] = useState("");

  // State to track if a search has been performed
  const [hasSearched, setHasSearched] = useState(false);

  /**
   * Handle medication search
   * Makes API call to DrugBank through our backend proxy
   */
  const handleSearch = async (e) => {
    e.preventDefault();

    // Validate search input
    if (!searchTerm.trim()) {
      setError("Please enter a medication name to search");
      return;
    }

    // Reset previous state
    setError("");
    setLoading(true);
    setHasSearched(true);

    try {
      // Make API call to our backend which will proxy to DrugBank
      const response = await axios.get(`/api/medications/search`, {
        params: { q: searchTerm.trim() },
      });

      // Console log the full API response
      console.log("Full API Response:", response);
      console.log("Response Data:", response.data);
      console.log("Search Results:", response.data.results);
      console.log("Number of results:", response.data.results?.length || 0);

      // Update results state with API response
      setSearchResults(response.data.results || []);

      if (response.data.results.length === 0) {
        setError("No medications found matching your search criteria");
      }
    } catch (err) {
      console.error("Search error:", err);
      console.error("Error response:", err.response);
      console.error("Error data:", err.response?.data);
      setError(
        err.response?.data?.message ||
          "Failed to search medications. Please try again later."
      );
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle input change for search field
   */
  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
    // Clear error when user starts typing
    if (error) setError("");
  };

  /**
   * Clear search results and reset form
   */
  const clearSearch = () => {
    setSearchTerm("");
    setSearchResults([]);
    setError("");
    setHasSearched(false);
  };

  /**
   * Format array data for display
   */
  const formatArrayData = (data) => {
    if (!data || data.length === 0) return "N/A";
    return Array.isArray(data) ? data.join(", ") : data;
  };

  return (
    <div className="medsearch-container">
      {/* Page Header */}
      <div className="medsearch-header">
        <div className="container">
          <div className="header-content">
            <Link to="/dashboard" className="back-link">
              ← Back to Dashboard
            </Link>
            <h1>Medication Lookup</h1>
            <p>Search for prescription medication information from DrugBank</p>
          </div>
        </div>
      </div>

      <div className="container">
        {/* Search Form */}
        <div className="search-section">
          <form onSubmit={handleSearch} className="search-form">
            <div className="search-input-group">
              <input
                type="text"
                value={searchTerm}
                onChange={handleInputChange}
                placeholder="Enter medication name (e.g., Aspirin, Lisinopril, Metformin)"
                className="search-input"
                disabled={loading}
              />
              <button
                type="submit"
                className="btn btn-primary search-btn"
                disabled={loading || !searchTerm.trim()}
              >
                {loading ? "Searching..." : "Search Medications"}
              </button>
            </div>
          </form>

          {/* Clear Search Button */}
          {(hasSearched || searchResults.length > 0) && (
            <button
              onClick={clearSearch}
              className="btn btn-secondary clear-btn"
            >
              Clear Search
            </button>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="alert alert-error">
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* Loading Indicator */}
        {loading && (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Searching medications...</p>
          </div>
        )}

        {/* Search Results */}
        {!loading && searchResults.length > 0 && (
          <div className="results-section">
            <h2>Search Results ({searchResults.length} found)</h2>
            <div className="results-grid">
              {searchResults.map((med, index) => (
                <div key={index} className="medication-card">
                  <div className="med-header">
                    <h3 className="med-name">
                      {med.name || "Unknown Medication"}
                    </h3>
                  </div>

                  <div className="med-details">
                    <div className="detail-row">
                      <span className="detail-label">Manufacturer Name:</span>
                      <span className="detail-value">
                        {med.manufacturer_name || "N/A"}
                      </span>
                    </div>

                    <div className="detail-row">
                      <span className="detail-label">Other Product IDs:</span>
                      <span className="detail-value">
                        {formatArrayData(med.other_local_product_ids)}
                      </span>
                    </div>

                    <div className="detail-row">
                      <span className="detail-label">Route:</span>
                      <span className="detail-value">
                        {formatArrayData(med.route)}
                      </span>
                    </div>

                    <div className="detail-row">
                      <span className="detail-label">Dosage Form:</span>
                      <span className="detail-value">
                        {med.dosage_form || "N/A"}
                      </span>
                    </div>

                    <div className="detail-row">
                      <span className="detail-label">Strength:</span>
                      <span className="detail-value">
                        {med.strength || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No Results Message */}
        {!loading && hasSearched && searchResults.length === 0 && !error && (
          <div className="no-results">
            <h3>No Results Found</h3>
            <p>
              No medications found for "{searchTerm}". Try a different search
              term.
            </p>
          </div>
        )}

        {/* Help Section */}
        <div className="help-section">
          <h3>Search Tips</h3>
          <ul>
            <li>
              Use generic or brand names (e.g., "Aspirin" or "Bayer Aspirin")
            </li>
            <li>Try different spellings or abbreviations</li>
            <li>Search for active ingredients</li>
            <li>Use partial names for broader results</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MedSearch;
