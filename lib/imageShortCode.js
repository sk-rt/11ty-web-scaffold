const path = require('path');
const Image = require('@11ty/eleventy-img');
const appEnv = process.env.APP_ENV || 'local';
const outputDir = appEnv === 'local' ? '.site' : 'dist';
const defaultImageParam = {
  alt: '',
  widths: [1800, null],
  needWebp: false,
  sizes: '100vw',
  loading: 'lazy',
  class: '',
};
/**
 * Imageを生成
 * @typedef {{alt:string, widths: (number|null)[], sizes: string, loading: 'lazy'| 'auto', class: string}} ImageParam
 * @param {string} src
 * @param {ImageParam} param
 * @returns {string} html
 */
async function imageShortCode(src, param = {}) {
  const _param = { ...defaultImageParam, ...param };
  const formats = _param.needWebp ? ['webp', null] : [null];
  const metadata = await getImageMeta(src, { widths: _param.widths, formats });

  const defaultImage = Image.generateHTML(metadata, {
    class: _param.class,
    sizes: _param.sizes,
    loading: _param.loading,
    alt: _param.alt,
  });

  return defaultImage;
}
/**
 * Responsive Imageを生成
 * @typedef {{src:string, media?: string} Source
 * @param {Source[]} sources
 * @param {string} defaultSrc
 * @param {*} param
 * @returns
 */
async function responsiveImageShortCode(sources, defaultSrc, param = {}) {
  const _param = { ...defaultImageParam, ...param };
  const formats = _param.needWebp ? ['webp', null] : [null];
  const metadata = await getImageMeta(defaultSrc, { widths: _param.widths, formats });
  const imageSources = await Promise.all(
    sources.map(async (source) => {
      const imageMeta = await getImageMeta(source.src, { widths: _param.widths, formats });
      const sourceHtml = Object.keys(imageMeta)
        .map((format) => {
          return generateHTMLSorce(imageMeta, { format: format, media: source.media || '' });
        })
        .join('\n');
      return sourceHtml;
    })
  );

  const defaultImage = Image.generateHTML(metadata, {
    class: _param.class,
    sizes: _param.sizes,
    loading: _param.loading,
    alt: _param.alt,
  });
  if (defaultImage.indexOf('<picture>') !== -1) {
    return defaultImage.replace('<picture>', `<picture>\n${imageSources.join('')}`);
  } else {
    return `<picture class="${_param.class}">
    ${imageSources.join('')}
    ${defaultImage}
    </picture>`;
  }
}

/**
 * 画像を生成
 * @param {string} src
 * @param {{ widths: (number|null)[], formats: (string|null)[] }} param1
 * @returns
 */
function getImageMeta(src, { widths, formats } = { widths: [null], formats: [null] }) {
  const _src = 'src/assets/' + src;
  const extension = path.extname(src);
  return Image(_src, {
    widths: widths,
    formats: formats,
    filenameFormat: function (id, src, width, format) {
      const name = path.basename(src, extension);
      return `${name}-${id}-${width}.${format}`;
    },
    urlPath: `${process.env.BASE_DIR}images/`,
    output: outputDir,
    outputDir: `./${outputDir}/images/`,
    sharpWebpOptions: {
      lossless: extension === '.png',
    },
  });
}
/**
 * metadataから対象のフォーマットのsourceを生成
 * @param {*} metadata
 * @param {{format:string,media: string, sizes:string}} param
 * @returns {string}
 */
function generateHTMLSorce(metadata, param = {}) {
  const defaultParam = {
    format: 'webp',
    media: '',
    sizes: '100vw',
  };
  const _param = {
    ...defaultParam,
    ...param,
  };
  let sourceHtml = '';
  const targetMeta = metadata[_param.format];
  if (targetMeta && targetMeta.length !== 0) {
    const sourceSetString = targetMeta
      .map((source) => {
        return source.srcset;
      })
      .join(',');
    const mediaAttr = _param.media ? ` media="${_param.media}"` : ``;
    const sizesAttr = _param.sizes ? ` sizes="${_param.sizes}"` : ``;
    sourceHtml = `<source srcset="${sourceSetString}" type="${targetMeta[0].sourceType}"${mediaAttr}${sizesAttr}>`;
  }
  return sourceHtml;
}

module.exports = {
  imageShortCode,
  responsiveImageShortCode,
  getImageMeta,
  generateHTMLSorce,
};
