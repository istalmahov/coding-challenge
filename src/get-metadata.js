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

const NODES_REG_EXPS = {
  head: /<head>(.*?)<\/head>/i,
  title: /<title>(.*?)<\/title>/i,
  url: /<meta\s*property="og:url"\s*content="(.*?)"\s*\/?>/i,
  siteName: /<meta\s*property="og:site_name"\s*content="(.*?)"\s*\/?>/i,
  description: /<meta\s*property="og:description"\s*content="(.*?)"\s*\/?>/i,
  description2: /<meta\s*name="description"\s*content="(.*?)"\s*\/?>/i,
  keywords: /<meta\s*name="keywords"\s*content="(.*?)"\s*\/?>/i,
  author: /<meta\s*name="author"\s*content="(.*?)"\s*\/?>/i,
};

const NEWLINE_REGEXP = /\r?\n|\r/g;

/**
 * Executes regular expression and returns a catch group
 * @param {string} html The complete HTML document text
 * @param {RegExp} node The node to search for. Examples: '<title>', '<meta property="og:url"'
 * @returns {string} A string, representing a node, or an empty string.
 */
const getNodeValue = (html, node) => {
  const result = node.exec(html);

  return result ? result[1] : null;
};

/**
 * Gets the URL, site name, title, description, keywords, and author info out of the <head> meta tags from a given html string.
 * 1. Get the URL from the <meta property="og:url"> tag.
 * 2. Get the site name from the <meta property="og:site_name"> tag.
 * 3. Get the title from the the <title> tag.
 * 4. Get the description from the <meta property="og:description"> tag or the <meta name="description"> tag.
 * 5. Get the keywords from the <meta name="keywords"> tag and split them into an array.
 * 6. Get the author from the <meta name="author"> tag.
 * If any of the above tags are missing or if the values are empty, then the corresponding value will be null.
 * @param {string} html The complete HTML document text to parse
 * @returns {Metadata} A Metadata object with data from the HTML <head>
 */
export default function getMetadata(html) {
  if (!html || typeof html !== "string")
    return {
      url: null,
      siteName: null,
      title: null,
      description: null,
      keywords: null,
      author: null,
    };

  const flatHtml = html.replace(NEWLINE_REGEXP, " ");

  const head = getNodeValue(flatHtml, NODES_REG_EXPS.head);

  return {
    url: getNodeValue(head, NODES_REG_EXPS.url),
    siteName: getNodeValue(head, NODES_REG_EXPS.siteName),
    title: getNodeValue(head, NODES_REG_EXPS.title),
    description:
      getNodeValue(head, NODES_REG_EXPS.description) ||
      getNodeValue(head, NODES_REG_EXPS.description2),
    keywords:
      getNodeValue(head, NODES_REG_EXPS.keywords)
        ?.split(",")
        .filter((keyword) => !!keyword) || null,
    author: getNodeValue(head, NODES_REG_EXPS.author),
  };
}
