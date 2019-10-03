const dev = require('./dev')
const prod = require('./prod')

module.exports = {
  env: process.env.NODE_ENV || 'development',
  api: 'https://onesource-admin.ccr3.com/api',
  locale: 'en_GB',
  fallback_locale: 'en_GB',
  title: 'onesource-eu-app',
  dev,
  prod
}
