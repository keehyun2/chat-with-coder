import tseslint from "typescript-eslint";
import js from "@eslint/js";

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      // CommonJS 구문 차단 (require, module.exports)
      "no-restricted-syntax": [
        "error",
        {
          selector: "CallExpression[callee.name='require']",
          message: "Use ESM `import` instead of `require()`.",
        },
        {
          selector:
            "AssignmentExpression[left.type='MemberExpression'][left.object.name='module'][left.property.name='exports']",
          message: "Use ESM `export` instead of `module.exports`.",
        },
        {
          selector:
            "CallExpression[callee.type='MemberExpression'][callee.object.name='require']",
          message: "Use ESM `import` instead of `require()`.",
        },
      ],
    },
  },
  {
    ignores: ["dist/"],
  }
);
