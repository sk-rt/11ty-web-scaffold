module.exports = function () {
  return {
    env: process.env.APP_ENV || 'local',
    title: process.env.TITLE || '',
    language: process.env.LANGUAGE || '',
    description: process.env.DESCRIPTION || '',
    siteUrl: process.env.SITE_URL || '',
    baseDir: process.env.BASE_DIR || '/',
    noIndex: process.env.NO_INDEX === 'true',
    gaMeasurementId: process.env.GA_MEASUREMENT_ID || '',
  };
};
