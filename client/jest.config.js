module.exports = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    "^@/components/(.*)$": "<rootDir>/components/$1",
    "^@/services/(.*)$": "<rootDir>/services/$1",
    "^@/constants$": "<rootDir>/constants/index.js",
    "^@/validation/(.*)$": "<rootDir>/validation/$1"
  },
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": ["babel-jest", { presets: ["next/babel"] }]
  },
  testPathIgnorePatterns: ["/node_modules/", "/.next/"],
  moduleFileExtensions: ["js", "jsx", "ts", "tsx", "json"],
};
