/**
 * @typedef Metadata
 * @type {object}
 * @property {string} url
 * @property {string} siteName
 * @property {string} title
 * @property {string} description
 * @property {string[]} keywords
 * @property {string} author
 */

const SPECIAL_CHARS_REGEXP = /[@#$%^&*_=+.,-]/g;

/**
 * Splits a string into an array of strings if special characters are present.
 * light-year => [light, year, lightyear, light-year]
 * @param {string} word - The search query string
 */
const handleSpecialChars = (word) => {
  if (!word.match(SPECIAL_CHARS_REGEXP)) return [word];

  const splittedBySpecialChars = word.split(SPECIAL_CHARS_REGEXP);
  const specialCharsRemoved = word.replace(SPECIAL_CHARS_REGEXP, "");

  return [...splittedBySpecialChars, specialCharsRemoved, word];
};

/**
 * Splits query string into an array of strings
 * @param {string} query - The search query string
 * @returns {string[]}
 */
const getQueryArray = (query) => {
  return query
    .split(" ")
    .reduce((words, currentWord) => {
      words.push(...handleSpecialChars(currentWord));
      return words;
    }, [])
    .filter((word) => word.length > 1);
};

/**
 * Combines metadata values into one string and removes special characters
 * @param {Metadata} metadata - A Metadata object
 * @returns {string}
 */
const formatMetadataValues = (metadata) => {
  return Object.values(metadata)
    .join(" ")
    .replace(SPECIAL_CHARS_REGEXP, "")
    .toLowerCase();
};

/**
 * Checks if metadata matches a query
 * @param {Metadata} metadata - A Metadata object
 * @param {string[]} query - The search query string
 * @returns {boolean}
 */
const doesMetadataMatch = (metadata, query) => {
  const values = formatMetadataValues(metadata);

  return query.some((word) => values.includes(word.toLowerCase()));
};

/**
 * Filters the given Metadata array to only include the objects that match the given search query.
 * If the search query has multiple words,
 * treat each word as a separate search term to filter by,
 * in addition to gathering results from the overall query.
 * If the search query has special characters,
 * run the query filter with the special characters removed.
 * Can return an empty array if no Metadata objects match the search query.
 * @param {Metadata[]} metadata - An array of Metadata objects
 * @param {string} query - The search query string
 * @returns {Metadata[]} - An array of Metadata objects that match the given search query
 */
export default function filterMetadata(metadata, query) {
  if (!metadata || !Array.isArray(metadata) || typeof query !== "string")
    return [];

  if (!query) return metadata;

  const queryArray = getQueryArray(query);

  return metadata.filter((m) => doesMetadataMatch(m, queryArray));
}
