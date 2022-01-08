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
 * Config
 */
module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ 'src/static': '/' });
  eleventyConfig.addNunjucksAsyncShortcode('image', imageShortcode);
  eleventyConfig.setUseGitIgnore(false);

  return {
    dir: {
      input: 'src/content',
      output: 'dist',
      layouts: '_layouts',
    },
  };
};
