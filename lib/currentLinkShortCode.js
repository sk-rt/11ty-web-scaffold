/**
 * Current Link
 *
 * @param {string} navSlugRegExp - RegExp string. e.g. `^/about/.*`
 * @param {string} currentPageUrl
 * @param {string?} currentClass
 * @returns {string}
 */
function currentLinkShortCode(navSlugRegExp, currentPageUrl, attribute = 'aria-current="page"') {
  const currentPagePath = currentPageUrl.replace(process.env.BASE_DIR, '/');
  const regex = new RegExp(navSlugRegExp);
  return currentPagePath.match(regex) ? attribute : '';
}
module.exports = {
  currentLinkShortCode,
};
