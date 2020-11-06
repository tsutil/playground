module.exports = {
    "env": {
        "es6": true,
        "node": true,
        "commonjs": true,
        "browser": false
    },
    "plugins": [
        "@typescript-eslint",
    ],
    "extends": [
        'plugin:@typescript-eslint/recommended',
    ],
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
      "ecmaVersion": 2018,
      "sourceType": "module"
    },
    "rules": {
        "@typescript-eslint/ban-ts-ignore": "off",
        "@typescript-eslint/camelcase": "off",
        "@typescript-eslint/explicit-function-return-type": "off",
        "@typescript-eslint/explicit-module-boundary-types": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-unused-vars": "off",
        "@typescript-eslint/no-use-before-define": "off",
        "@typescript-eslint/no-var-requires": "warn",
        "@typescript-eslint/no-empty-interface": "off",
        "@typescript-eslint/no-inferrable-types": "off",
        "@typescript-eslint/interface-name-prefix": "off",
        "@typescript-eslint/no-var-requires": "off",
        "@typescript-eslint/ban-ts-comment": "off",
        "prefer-const": "off",
        "no-console": "off",
        "quotes": [1, "single", { "avoidEscape": true, "allowTemplateLiterals": true }],
        "no-unused-vars": "off",
        "indent": ["warn", 4, { "SwitchCase": 1 }],
        "semi": "warn",
        "no-extra-semi": "warn",
        "no-unreachable": "warn"
    }
};
