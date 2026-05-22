import js from "@eslint/js";
import tseslint from "typescript-eslint";
import reactPlugin from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import globals from "globals";
import prettierConfig from "eslint-config-prettier";

export default tseslint.config(
  // Ignore build output
  { ignores: ["dist/", "public/"] },

  // Base JS rules
  js.configs.recommended,

  // TypeScript rules
  ...tseslint.configs.recommended,

  // React rules
  {
    files: ["src/**/*.{ts,tsx}"],
    plugins: {
      react: reactPlugin,
      "react-hooks": reactHooks,
    },
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    settings: {
      react: { version: "detect" },
    },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      // React 17+ JSX transform — no need to import React in scope
      "react/react-in-jsx-scope": "off",
      // TypeScript handles prop validation; no need for runtime prop-types
      "react/prop-types": "off",
      // Allow the `css` prop used by Emotion/MUI styled components
      "react/no-unknown-property": ["error", { ignore: ["css"] }],
      // Warn on `any` usage without fully banning it
      "@typescript-eslint/no-explicit-any": "warn",
      // Warn on unused vars; prefix with _ to intentionally suppress
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      // Inferred return types are acceptable; no need to annotate every function
      "@typescript-eslint/explicit-function-return-type": "off",
      // Access modifiers (public/private/protected) are optional on class members
      "@typescript-eslint/explicit-member-accessibility": "off",
      // Exported functions/methods don't need explicit return/param types
      "@typescript-eslint/explicit-module-boundary-types": "off",
      // Successor to deprecated ban-types; allows `{}` as a valid value type
      "@typescript-eslint/no-empty-object-type": "off",
      // Require curly braces for all control-flow bodies to avoid dangling-else bugs
      curly: "error",
      // Disallow unnecessary curly braces around string literals in JSX: {"foo"} → "foo"
      "react/jsx-curly-brace-presence": ["error", { props: "never", children: "never" }],
    },
  },

  // Disable rules that conflict with Prettier (must be last)
  prettierConfig,
);
