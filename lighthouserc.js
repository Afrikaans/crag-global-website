export default {
  ci: {
    collect: {
      startServerCommand: 'npm run build && npm run preview',
      url: ['http://localhost:4173'], // example for Vite preview
      numberOfRuns: 3
    },
    assert: {
      preset: 'lighthouse:recommended'
    },
    upload: {
      target: 'temporary-public-storage'
    }
  }
};