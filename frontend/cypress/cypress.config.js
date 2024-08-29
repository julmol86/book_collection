const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://books-frontend:5173', 
    specPattern: 'e2e/**/*.cy.{js,jsx,ts,tsx}', 
    supportFile: false, 
  },
});
