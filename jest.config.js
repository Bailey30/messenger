module.exports = {
    preset: "ts-jest",
    testEnvironment: "jsdom",
    moduleDirectories: ["node_modules", "src"],
    resolver: "<rootDir>/.jest/resolver.js",
    transformIgnorePatterns: [
        "/node_modules/(?!node-fetch)/", // Exclude all node_modules except axios
        "<rootDir>/node_modules/",
    ],
};
