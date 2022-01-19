const path = require('path');
const Image = require('@11ty/eleventy-img');

/**
 * Env
 */
const appEnv = process.env.APP_ENV || 'local';
require('dotenv').config({ path: path.resolve(__dirname, `.env.${appEnv}`) });

/**
 * Image
 *
 * @typedef {{alt:string, widths: (number|null)[], sizes: string, loading: 'lazy'| 'auto', class: string}} ImageParam
 * @param {string} src
 * @param {ImageParam} param
 * @returns {string} html
 */
async function imageShortcode(src, param = {}) {
  const defaultParam = {
    alt: '',
    widths: [1800, null],
    sizes: '100vw',
    loading: 'lazy',
    class: '',
  };
  const _src = 'src/assets/' + src;
  const _params = { ...defaultParam, ...param };
  const metadata = await Image(_src, {
    widths: _params.widths,
    formats: [null],
    filenameFormat: function (id, src, width, format) {
      const extension = path.extname(src);
      const name = path.basename(src, extension);
      return `${name}-${width}.${format}`;
    },
    urlPath: '/images/',
    outputDir: './dist/images/',
  });

  const imageAttributes = {
    class: _params.class,
    sizes: _params.sizes,
    loading: _params.loading,
    alt: _params.alt,
  };
  return Image.generateHTML(metadata, imageAttributes);
}

/**
 * Current Class
 *
 * @param {string} navSlugRegExp - RegExp string. e.g. `^/about/.*`
 * @param {string} currentPageUrl
 * @param {string?} currentClass
 * @returns {string}
 */
function currentClass(navSlugRegExp, currentPageUrl, currentClass = 'is-current') {
  const currentPagePath = currentPageUrl.replace(process.env.BASE_DIR, '/');
  const regex = new RegExp(navSlugRegExp);
  if (currentPagePath.match(regex)) {
    return currentClass;
  }
  return '';
}
/**
 * Config
 */
module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ 'src/static': '/' });
  eleventyConfig.setUseGitIgnore(false);
  eleventyConfig.addWatchTarget('dist/css/');
  eleventyConfig.addWatchTarget('dist/js/');
  eleventyConfig.addWatchTarget('src/scss/');
  eleventyConfig.addWatchTarget('src/js/');

  eleventyConfig.addNunjucksAsyncShortcode('image', imageShortcode);
  eleventyConfig.addShortcode('currentClass', currentClass);

  return {
    dir: {
      input: 'src/content',
      output: 'dist',
      layouts: '_layouts',
    },
    pathPrefix: process.env.BASE_DIR,
  };
};
