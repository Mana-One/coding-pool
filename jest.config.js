const { defaults: tsJestPresets } = require("ts-jest/presets");

module.exports = {
    preset: "ts-jest",
    transform: { ...tsJestPresets.transform },
    testMatch: ["<rootDir>/test/**/*.(test|spec).ts"]
}