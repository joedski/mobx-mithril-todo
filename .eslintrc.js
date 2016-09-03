module.exports = {
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended"
  ],
  "parser": "babel-eslint",
  "parserOptions": {
    "ecmaVersion": 6,
    "sourceType": "module",
    "ecmaFeatures": {
      "jsx": true,
      "impliedStrict": true,
      "modules": true
    }
  },
  "plugins": [
    "react"
  ],
  "settings": {
    "react": {
      "pragma": "m",
    }
  },
  "rules": {
    "react/jsx-uses-react": 0,
  },
  "env": {
    "browser": true,
    "node": true,
    "es6": true,
    "commonjs": true
  }
};
