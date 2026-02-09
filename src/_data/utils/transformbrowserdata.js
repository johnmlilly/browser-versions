/**
 * Creates a release object with version number included
 * @param {string} versionNumber - Engine version number
 * @param {Object} releaseDetails - Release metadata
 * @returns {Object} - Release object with version
 */
function createReleaseObject(engineVersion, releaseDetails) {
  return {
    version: engineVersion,
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
 * Categorizes browser releases into current and fallback (previous) versions
 * @param {Object} releases - Object where keys are engine version numbers and values are release details
 * @returns {Object} - Object with current and previous releases
 */
export function categorizeReleases(releases) {
  const allReleases = Object.entries(releases).map(([engineVersion, releaseData]) =>
    createReleaseObject(engineVersion, releaseData)
  );

  const currentRelease = allReleases.find(isCurrentRelease) || null;
  const previousReleases = [];
  let nextPlannedRelease = null; // single planned release

  allReleases.forEach(release => {
    if (isCurrentRelease(release)) return;

    // Only beta releases are considered for "next"
    if (release.status === 'beta' && !nextPlannedRelease) {
      nextPlannedRelease = release;
      return;
    }

    previousReleases.push(release);
  });

  return {
    current: currentRelease,
    previous: previousReleases,
    next: nextPlannedRelease
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
    next
  };
}
