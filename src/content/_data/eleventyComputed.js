/**
 *  computed data
 * @see https://www.11ty.dev/docs/data-computed/#using-javascript
 */
const { getImageMeta } = require('../../../lib/imageShortCode');

module.exports = {
  seo: {
    /**
     * Page title in <head>
     * @param {*} data global Data
     * @returns {string}
     */
    pageTitle: (data) => {
      data.site.title;
      data.title;
      data.parents;
      /**
       * @param  {...string} titles
       * @returns string
       */
      const getTitle = (...titles) => {
        return titles.join(' ‹ ');
      };
      if (!data.title) {
        return getTitle(data.site.title);
      }
      if (data.parents) {
        return getTitle(data.title, ...data.parents.map((p) => p.name), data.site.title);
      } else {
        return getTitle(data.title, data.site.title);
      }
    },
    /**
     * Page description in <head>
     * @param {*} data global Data
     * @returns {string}
     */
    description: (data) => {
      if (data.description) {
        return data.description;
      }
      if (data.page.url === data.site.baseDir) {
        return data.site.description;
      }
      // TODO: prevent same description
      return data.site.description;
    },
    /**
     * Canonical url
     * @param {*} data global Data
     * @returns {string}
     */
    canonicalUrl: (data) => {
      return data.site.siteUrl + data.page.url;
    },
    /**
     * og:image url
     * @param {*} data global Data
     * @returns {string}
     */
    ogImageUrl: async (data) => {
      const defaultImage = `${data.site.siteUrl}${data.site.baseDir}images/ogp.png`;
      if (!data.ogp) {
        return defaultImage;
      }
      const imageList = await getImageMeta(data.ogp, {
        widths: [1200],
        formats: [null],
      });
      if (!imageList || Object.values(imageList).length === 0) {
        return defaultImage;
      }
      const image = Object.values(imageList)[0][0];
      return data.site.siteUrl + image.url;
    },
  },
  breadCrumbsList: (data) => {
    if (!data.breadCrumbs) {
      return;
    }
    let list = [{ path: '/', name: 'Top' }];
    if (data.parents && data.parents.length !== 0) {
      list.push(...data.parents);
    }
    list.push({
      name: data.title,
    });
    return list;
  },
};
