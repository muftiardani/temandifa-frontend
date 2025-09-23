module.exports = {
  preset: "jest-expo",
  transformIgnorePatterns: [
    "node_modules/(?!(jest-)?react-native|@react-native|@react-navigation|expo(nent)?|@expo(nent)?/.*)",
  ],
  moduleNameMapper: {
    "expo-asset": "<rootDir>/__mocks__/expoMock.js",
    "expo-font": "<rootDir>/__mocks__/expoMock.js",
    "@expo/vector-icons": "<rootDir>/__mocks__/vectorIconsMock.js",
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
      "<rootDir>/__mocks__/fileMock.js",
  },
};
