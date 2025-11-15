const axios = require("axios");

async function testFDAAPI() {
  try {
    console.log("Testing FDA API connection...");

    const FDA_API_URL = "https://api.fda.gov/drug/drugsfda.json";
    const searchTerm = "aspirin";

    console.log(`Searching for: ${searchTerm}`);
    console.log(
      `API URL: ${FDA_API_URL}?search=products.brand_name:${searchTerm}&limit=5`
    );

    const response = await axios.get(FDA_API_URL, {
      params: {
        search: `products.brand_name:${searchTerm}`,
        limit: 5,
      },
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "MindManaged2-App/1.0",
      },
      timeout: 10000,
    });

    console.log("\n✅ FDA API Response Status:", response.status);
    console.log("✅ Results found:", response.data?.results?.length || 0);

    if (response.data?.results?.length > 0) {
      const firstResult = response.data.results[0];
      console.log("\n📋 First result sample:");
      console.log("- Application Number:", firstResult.application_number);
      console.log("- Sponsor Name:", firstResult.sponsor_name);
      console.log("- Products:", firstResult.products?.length || 0);

      if (firstResult.products?.length > 0) {
        const firstProduct = firstResult.products[0];
        console.log("\n  Product Details:");
        console.log("  - Brand Name:", firstProduct.brand_name);
        console.log("  - Generic Name:", firstProduct.generic_name);
        console.log("  - Dosage Form:", firstProduct.dosage_form);
        console.log("  - Route:", firstProduct.route);
        console.log("  - Product NDC:", firstProduct.product_ndc);
      }
    }

    console.log("\n🎉 FDA API test completed successfully!");
    return true;
  } catch (error) {
    console.error("\n❌ FDA API test failed:");
    console.error("Error:", error.response?.data || error.message);
    console.error("Status:", error.response?.status);

    if (error.response?.status === 404) {
      console.log("\n💡 This might be because the search term was not found.");
      console.log("Try testing with a different medication name.");
    } else if (error.code === "ECONNABORTED") {
      console.log("\n💡 Request timed out. Check your internet connection.");
    } else if (error.code === "ENOTFOUND") {
      console.log(
        "\n💡 Could not reach FDA API. Check your internet connection."
      );
    }

    return false;
  }
}

// Run the test
if (require.main === module) {
  testFDAAPI().then((success) => {
    process.exit(success ? 0 : 1);
  });
}

module.exports = testFDAAPI;
