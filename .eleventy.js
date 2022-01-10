/**
 * Image
 */
const path = require('path');
const Image = require('@11ty/eleventy-img');
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
 * breadCrumbsList
 * @param {boolean|object} value
 */
const breadCrumbsList = (value) => {
  if (!value) {
    return;
  }
  let list = [{ path: '/', name: 'Top' }];
  if (value.parents) {
    list.push(...value.parents);
  }
  return list;
};
/**
 * Config
 */
module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ 'src/static': '/' });
  eleventyConfig.addNunjucksAsyncShortcode('image', imageShortcode);
  eleventyConfig.setUseGitIgnore(false);
  eleventyConfig.addWatchTarget('dist/css/');
  eleventyConfig.addWatchTarget('dist/js/');
  eleventyConfig.addWatchTarget('src/scss/');
  eleventyConfig.addNunjucksFilter('breadCrumbsList', breadCrumbsList);

  return {
    dir: {
      input: 'src/content',
      output: 'dist',
      layouts: '_layouts',
    },
  };
};
