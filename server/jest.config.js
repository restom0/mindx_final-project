module.exports = {
  testEnvironment: "node",
  collectCoverageFrom: [
    "src/app.js",
    "src/common/rateLimiters.js",
    "src/config/env.js",
    "src/routes/health.routes.js"
  ],
  coverageReporters: ["text", "lcov"],
  coverageThreshold: {
    global: {
      statements: 100,
      branches: 80,
      functions: 100,
      lines: 100
    }
  }
};
