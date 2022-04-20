const path = require('path');
const { imageShortCode, responsiveImageShortCode } = require('./lib/imageShortCode');
const { currentLinkShortCode } = require('./lib/currentLinkShortCode');

/**
 * Env
 */
const appEnv = process.env.APP_ENV || 'local';
require('dotenv').config({ path: path.resolve(__dirname, `.env.${appEnv}`) });
const outputDir = appEnv === 'local' ? '.site' : 'dist';

/**
 * Config
 */
module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ 'src/static': '/' });
  eleventyConfig.setUseGitIgnore(false);
  eleventyConfig.setBrowserSyncConfig({
    files: [`${outputDir}/**/!(*.html)`],
  });
  eleventyConfig.addNunjucksAsyncShortcode('image', imageShortCode);
  eleventyConfig.addNunjucksAsyncShortcode('responsiveImage', responsiveImageShortCode);
  eleventyConfig.addShortcode('currentLinkAttr', currentLinkShortCode);
  eleventyConfig.addFilter('formatToDate', function (value) {
    if (!value) {
      return '';
    }
    const date = new Date(value);
    return `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}`;
  });

  return {
    dir: {
      input: 'src/content',
      output: outputDir,
      layouts: '_layouts',
    },
    pathPrefix: process.env.BASE_DIR,
    markdownTemplateEngine: 'njk',
  };
};
