import { DateTime } from "luxon";

export default async function(eleventyConfig) {
  // Copy CSS and assets to output
  eleventyConfig.addPassthroughCopy("src/styles");
  eleventyConfig.addPassthroughCopy("src/assets");
  
  // Format date into readable format (e.g., "July 2, 2026")
  eleventyConfig.addFilter("readableDate", (dateString) => {
    if (!dateString) return '';
    return DateTime.fromISO(dateString).toLocaleString(DateTime.DATE_FULL);
  });
  
  // Format date to medium format (e.g., "Jul 2, 2026")
  eleventyConfig.addFilter("mediumDate", (dateString) => {
    if (!dateString) return '';
    return DateTime.fromISO(dateString).toLocaleString(DateTime.DATE_MED);
  });
  
  // Relative date (e.g., "2 months ago")
  eleventyConfig.addFilter("relativeDate", (dateString) => {
    if (!dateString) return '';
    return DateTime.fromISO(dateString).toRelative();
  });
    
    // Add global data for build time
  eleventyConfig.addGlobalData("buildTime", () => {
    return DateTime.now().toLocaleString(DateTime.DATETIME_FULL);
  });
  
  return {
    dir: {
      input: "src",
      output: "dist"
    }
  };
}