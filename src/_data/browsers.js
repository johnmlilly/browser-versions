import EleventyFetch from "@11ty/eleventy-fetch";
import { transformBrowserData } from "./utils/transformbrowserdata.js";
import { browsers } from "./config.js";

/**
 * Fetches and transforms data for a single browser
 * @param {string} browserKey - Browser identifier
 * @returns {Promise<Object>} - Transformed browser data
 */
async function getBrowserData(browserKey) {
  console.log(`Fetching data for ${browserKey}...`);
  
  const url = `https://raw.githubusercontent.com/mdn/browser-compat-data/main/browsers/${browserKey}.json`;
  
  // Use eleventy-fetch for caching
  const data = await EleventyFetch(url, {
    duration: "1d", // default is 1d
    type: "json",
  });
  
  const browserData = data.browsers[browserKey];
  return transformBrowserData(browserKey, browserData);
}

/**
 * Main export: fetches all browser data with caching
 * @returns {Promise<Array>} - Array of all browser data
 */
export default async function() {
  console.log('Fetching browser data...');
  
  try {
    const browserData = await Promise.all(
      browsers.map(browser => getBrowserData(browser))
    );
    
    console.log(`Successfully fetched data for ${browserData.length} browsers`);
    return browserData;
  } catch (error) {
    console.error('Error fetching browser data:', error);
    // Return empty array or throw, depending on your preference
    throw error;
  }
}