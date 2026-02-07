/**
 * Formats the current date
 * @returns {string} - Formatted date string
 */
function builtAt() {
  const now = new Date();
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
      day: 'numeric',
        year: 'numeric',
  }).format(now);
}

/**
 * List of browsers to fetch
 */
export const browsers = [
  'chrome',
  'firefox',
  'safari',
  'edge',
];

export default {
  builtAt,
  browsers,
};
