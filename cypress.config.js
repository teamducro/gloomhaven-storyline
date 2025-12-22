const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://gloomhaven-storyline.test/',
    chromeWebSecurity: false,
  },
})
