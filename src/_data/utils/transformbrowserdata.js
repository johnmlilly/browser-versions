/**
 * Creates a release object with version number included
 * @param {string} versionNumber - Version number
 * @param {Object} releaseDetails - Release metadata
 * @returns {Object} - Release object with version
 */
function createReleaseObject(versionNumber, releaseDetails) {
  return {
    version: versionNumber,
    ...releaseDetails
  };
}

/**
 * Checks if a release is the current stable version
 * @param {Object} release - Release object
 * @returns {boolean}
 */
function isCurrentRelease(release) {
  return release.status === 'current';
}

/**
 * Checks if a release is a future/upcoming version
 * @param {Object} release - Release object
 * @returns {boolean}
 */
function isFutureRelease(release) {
  const futureStatuses = ['beta', 'nightly', 'planned', 'esr'];
  return futureStatuses.includes(release.status);
}

/**
 * Categorizes browser releases into current, previous, and upcoming versions
 * @param {Object} releases - Object where keys are version numbers and values are release details
 * @returns {Object} - Object with current, previous, and next arrays
 */
export function categorizeReleases(releases) {
  // Convert to array of release objects
  const allReleases = Object.entries(releases).map(([versionNumber, details]) =>
    createReleaseObject(versionNumber, details)
  );

  // Find the current release
  const current = allReleases.find(isCurrentRelease);

  // Categorize others
  const previous = [];
  const next = [];

  allReleases.forEach(release => {
    if (isCurrentRelease(release)) {
      return; // Skip current, we already have it
    }

    if (isFutureRelease(release)) {
      next.push(release);
    } else {
      // Retired or other statuses
      previous.push(release);
    }
  });

  // Sort for consistency
  const sortByVersion = (a, b) => parseFloat(b.version) - parseFloat(a.version);
  previous.sort(sortByVersion);
  next.sort(sortByVersion);

  return { 
    current: current || null, // Handle case where no current version exists
    previous, 
    next 
  };
}

/**
 * Transforms raw browser data into a cleaner structure
 * @param {string} browserKey - Browser identifier (e.g., 'chrome', 'firefox')
 * @param {Object} browserData - Raw browser data from MDN API
 * @returns {Object} - Transformed browser object
 */
export function transformBrowserData(browserKey, browserData) {
  const { type, name, releases } = browserData;
  const { current, previous, next } = categorizeReleases(releases);
  
  return {
    key: browserKey,
    name,
    type,
    current,
    previous,
    next,
  };
}

/**
 * Sorts releases by version number in descending order (highest first)
 * @param {Array} releases - Array of release objects
 * @returns {Array} - Sorted array (does not mutate original)
 */
export function sortReleasesByVersion(releases) {
  // Create a copy to avoid mutating the original array
  return [...releases].sort((a, b) => {
    const versionA = parseFloat(a.version);
    const versionB = parseFloat(b.version);
    return versionB - versionA;
  });
}

/**
 * Gets the N most recent releases by date
 * @param {Array} releases - Array of release objects
 * @param {number} limit - Number of releases to return
 * @returns {Array} - Most recent releases
 */
export function getMostRecentReleases(releases, limit = 5) {
  return [...releases]
    .filter(release => release.release_date) // Only releases with dates
    .sort((a, b) => new Date(b.release_date) - new Date(a.release_date))
    .slice(0, limit);
}