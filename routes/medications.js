const express = require("express");
const axios = require("axios");
const auth = require("../middleware/auth");

const router = express.Router();

/**
 * @route   GET /api/medications/search
 * @desc    Search medications using DrugBank API
 * @access  Private (requires authentication)
 *
 * Query Parameters:
 * - q: Search query (medication name)
 * - limit: Number of results to return (default: 20, max: 100)
 */
router.get("/search", auth, async (req, res) => {
  try {
    const { q, limit = 20 } = req.query;

    // Validate search query
    if (!q || q.trim().length === 0) {
      return res.status(400).json({
        message: "Search query is required",
      });
    }

    // Validate limit parameter
    const searchLimit = Math.min(Math.max(parseInt(limit) || 20, 1), 100);

    // FDA API configuration
    const FDA_API_URL =
      process.env.FDA_API_BASE_URL || "https://api.fda.gov/drug/drugsfda.json";

    // FDA API doesn't require an API key, so no key validation needed

    console.log(`Searching medications for: "${q}"`);

    // Make request to FDA API
    const fdaResponse = await axios.get(FDA_API_URL, {
      params: {
        search: `products.brand_name:${q.trim()}`,
        limit: searchLimit,
      },
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "MindManaged2-App/1.0",
      },
      timeout: 10000, // 10 second timeout
    });

    // Process and format the results from FDA API
    const medications = fdaResponse.data?.results || [];

    const formattedResults = medications
      .flatMap((drug) => {
        if (!drug.products || !Array.isArray(drug.products)) {
          return [];
        }

        return drug.products.map((product) => ({
          name: product.brand_name || product.generic_name || "Unknown",
          prescribable_name: product.generic_name || null,
          rx_norm_prescribable_name: null, // FDA API doesn't provide this
          ndc_product_codes: Array.isArray(product.product_ndc)
            ? product.product_ndc
            : product.product_ndc
            ? [product.product_ndc]
            : [],
          other_local_product_ids: [],
          route: Array.isArray(product.route)
            ? product.route
            : product.route
            ? [product.route]
            : [],
          dosage_form: product.dosage_form || null,
          strength: product.active_ingredients?.[0]?.strength || null,
          manufacturer_name: drug.sponsor_name || null,
          application_number: drug.application_number || null,
        }));
      })
      .slice(0, searchLimit);

    console.log(`Found ${formattedResults.length} medications`);

    res.json({
      success: true,
      query: q.trim(),
      total: formattedResults.length,
      results: formattedResults,
    });
  } catch (error) {
    console.error("FDA API Error:", error.response?.data || error.message);

    // Handle different types of errors
    if (error.code === "ECONNABORTED") {
      return res.status(408).json({
        message: "Search request timed out. Please try again.",
      });
    }

    if (error.response?.status === 401) {
      return res.status(500).json({
        message: "Medication search service authentication failed",
      });
    }

    if (error.response?.status === 403) {
      return res.status(500).json({
        message: "Medication search service access denied",
      });
    }

    if (error.response?.status === 429) {
      return res.status(429).json({
        message: "Too many requests. Please wait a moment and try again.",
      });
    }

    if (error.response?.status >= 400 && error.response?.status < 500) {
      return res.status(400).json({
        message: "Invalid search request. Please check your search terms.",
      });
    }

    // Generic server error
    res.status(500).json({
      message: "Failed to search medications. Please try again later.",
    });
  }
});

/**
 * @route   GET /api/medications/test
 * @desc    Test endpoint to verify API connectivity
 * @access  Private
 */
router.get("/test", auth, async (req, res) => {
  try {
    const FDA_API_URL =
      process.env.FDA_API_BASE_URL || "https://api.fda.gov/drug/drugsfda.json";

    // Test FDA API connection with a simple query
    const testResponse = await axios.get(FDA_API_URL, {
      params: {
        search: "products.brand_name:aspirin",
        limit: 1,
      },
      timeout: 5000,
    });

    res.json({
      status: "ok",
      message: "FDA medication search API is ready",
      configured: true,
      api_url: FDA_API_URL,
      test_results: testResponse.data?.results?.length || 0,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to test FDA medication API",
      error: error.message,
      configured: false,
    });
  }
});

module.exports = router;
