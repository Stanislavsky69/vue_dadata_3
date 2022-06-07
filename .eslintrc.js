module.exports = {
  "root": true,
  "env": {
      "browser": true,
      "es2021": true,
      "node": true
  },
  "extends": [
    'eslint:recommended',
    'plugin:vue/vue3-essential',
    '@vue/eslint-config-typescript'
  ],
  "parserOptions": {
      "ecmaVersion": 2021
  },
  "plugins": [],
  "rules": {
    "no-unused-vars": "off",
    '@typescript-eslint/ban-ts-ignore': 'off',
    "@typescript-eslint/no-unused-vars": ["error"],
      "vue/multi-word-component-names": ["off"],
      "@typescript-eslint/no-empty-interface": ["off"],
      "@typescript-eslint/no-extra-semi": ["off"],
      "no-extra-semi": ["error"],
      "vue/first-attribute-linebreak": ["error", {
          "singleline": "ignore",
          "multiline": "below"
      }],
      "vue/html-closing-bracket-spacing": ["error", {
          "selfClosingTag": "always"
      }],
      "vue/require-explicit-emits": ["error"],
      "vue/component-tags-order": ["error", {
          "order": ["template", "script", "style"]
       }],
       "vue/block-lang": ["error",
          {
              "script": {
                  "lang": "ts"
              }
          }
      ],
      "vue/define-macros-order": ["error", {
          "order": ["defineProps", "defineEmits"]
      }],
      "vue/component-api-style": ["error",
          ["script-setup", 'composition'] // "script-setup", "composition", "composition-vue2", or "options"
      ],
      "vue/component-name-in-template-casing": ["error", "kebab-case", {
          "registeredComponentsOnly": true,
          "ignores": []
      }],
      "vue/html-button-has-type": ["error", {
          "button": true,
          "submit": true,
          "reset": true
      }],
      "vue/html-comment-content-newline": ["error",
          {
              "singleline": "always",
              "multiline": "always",
          },
          {
              "exceptions": []
          }
      ],
      "vue/html-comment-content-spacing": ["error",
          "always",
          {
              "exceptions": []
          }
      ],
      "vue/new-line-between-multi-line-property": ["error", {
          "minLineOfMultilineProperty": 2
      }],
      "vue/next-tick-style": ["error", "promise"],
      "vue/no-empty-component-block": ["error"],
      "vue/no-restricted-block": ["error",
          {
              "element": "style",
              "message": "Do not use <style> block in this project."
          },
      ],
      "vue/no-static-inline-styles": ["error"],
      "vue/no-unused-refs": ["error"],
      "vue/padding-line-between-blocks": ["error", "always"],
      "vue/prefer-true-attribute-shorthand": ["error"],
      "vue/v-on-function-call": ["error"]
  }
}