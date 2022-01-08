module.exports = function (eleventyConfig) {
    // Add a filter using the Config API
    // eleventyConfig.addTransform('htmlmin', function (content, outputPath) {})
    eleventyConfig.addPassthroughCopy({ 'src/static': "/" });

    // You can return your Config object (optional).
    return {
      dir: {
        input: 'src/content',
        output: 'dist',
        layouts: "_layouts"
      }
    }
  }