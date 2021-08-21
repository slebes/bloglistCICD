module.exports = {
  projects: [
    {
      displayName: 'dom',
      testEnvironment: 'jsdom',
      testMatch: ['**/*.test.js?(x)']
    },
    {
      displayName: 'node',
      testEnvironment: 'node',
      testMatch: [
        '**/*.test.node.js?(x)',
      ]
    },
  ],
};