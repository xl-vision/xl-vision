import unicorn from "eslint-plugin-unicorn";
import _import from "eslint-plugin-import";
import { fixupPluginRules, fixupConfigRules } from "@eslint/compat";
import globals from "globals";
import babelParser from "@babel/eslint-parser";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [{
    ignores: [
        "**/legacy",
        "**/modern",
        "**/dist",
        "**/coverage",
        "**/node_modules",
        "**/.next",
        "**/out",
        "packages/icons/src",
        "packages/icons/third",
        "packages/icons/scripts/template",
    ],
}, ...compat.extends(
    "airbnb",
    "airbnb/hooks",
    "plugin:react/jsx-runtime",
    "plugin:prettier/recommended",
    "prettier",
), {
    plugins: {
        unicorn,
        import: (_import),
    },

    languageOptions: {
        globals: {
            ...globals.node,
            ...globals.jest,
            ...globals.browser,
        },

        parser: babelParser,
        ecmaVersion: 2018,
        sourceType: "commonjs",

        parserOptions: {
            requireConfigFile: false,

            babelOptions: {
                plugins: [],
            },
        },
    },

    settings: {
        react: {
            version: "detect",
        },

        "import/parsers": {
            "@typescript-eslint/parser": [".ts", ".tsx"],
        },

        "import/resolver": {
            typescript: {
                alwaysTryTypes: true,
                project: ["packages/*/tsconfig.json", "platforms/*/tsconfig.json"],
            },
        },
    },

    rules: {
        "import/no-extraneous-dependencies": ["error", {
            devDependencies: ["scripts/**", "./.*.js"],
        }],

        "import/no-unresolved": "error",

        "import/order": ["error", {
            alphabetize: {
                order: "asc",
                caseInsensitive: true,
            },

            groups: [["builtin", "external"], "internal"],
        }],

        "no-console": ["error", {
            allow: ["warn", "error"],
        }],

        "nonblock-statement-body-position": "error",
        "no-plusplus": "off",
        "no-param-reassign": "off",

        "no-restricted-globals": [
            "error",
            "addEventListener",
            "blur",
            "close",
            "closed",
            "confirm",
            "defaultStatus",
            "defaultstatus",
            "event",
            "external",
            "find",
            "focus",
            "frameElement",
            "frames",
            "history",
            "innerHeight",
            "innerWidth",
            "length",
            "location",
            "locationbar",
            "menubar",
            "moveBy",
            "moveTo",
            "name",
            "onblur",
            "onerror",
            "onfocus",
            "onload",
            "onresize",
            "onunload",
            "open",
            "opener",
            "opera",
            "outerHeight",
            "outerWidth",
            "pageXOffset",
            "pageYOffset",
            "parent",
            "print",
            "removeEventListener",
            "resizeBy",
            "resizeTo",
            "screen",
            "screenLeft",
            "screenTop",
            "screenX",
            "screenY",
            "scroll",
            "scrollbars",
            "scrollBy",
            "scrollTo",
            "scrollX",
            "scrollY",
            "self",
            "status",
            "statusbar",
            "stop",
            "toolbar",
            "top",
        ],

        "no-underscore-dangle": "off",
        "no-nested-ternary": "off",
        "no-use-before-define": "off",
        "no-multi-assign": "off",
        "no-continue": "off",

        "consistent-return": ["off", {
            treatUndefinedAsUnspecified: true,
        }],

        "react/jsx-uses-react": "off",
        "react/react-in-jsx-scope": "off",

        "react-hooks/exhaustive-deps": ["error", {
            additionalHooks: "(useIsomorphicLayoutEffect|useEnhancedMemo)",
        }],

        "react/jsx-handler-names": ["error", {
            eventHandlerPrefix: "handle",
            eventHandlerPropPrefix: "on",
            checkLocalVariables: true,
        }],

        "react/function-component-definition": ["error", {
            namedComponents: "arrow-function",
        }],

        "react/jsx-no-useless-fragment": ["error", {
            allowExpressions: true,
        }],

        "react/forbid-prop-types": "error",
        "react/jsx-boolean-value": ["error", "always"],
        "react/display-name": "error",
        "react/jsx-props-no-spreading": "off",
        "react/require-default-props": "off",

        "react/jsx-sort-props": ["error", {
            ignoreCase: true,
            callbacksLast: true,
        }],

        "react/sort-prop-types": ["error", {
            ignoreCase: true,
            requiredFirst: true,
            sortShapeProp: true,
            callbacksLast: true,
        }],

        "prefer-destructuring": ["error", {
            VariableDeclarator: {
                object: true,
                array: false,
            },

            AssignmentExpression: {
                array: false,
                object: false,
            },
        }],

        "unicorn/filename-case": ["error", {
            cases: {
                camelCase: true,
                pascalCase: true,
            },
        }],

        "unicorn/better-regex": "error",
        "unicorn/expiring-todo-comments": "error",
        "unicorn/consistent-function-scoping": "error",
        "unicorn/import-index": "error",
        "unicorn/prefer-query-selector": "off",
        "unicorn/no-abusive-eslint-disable": "error",
    },
}, ...fixupConfigRules(compat.extends(
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "plugin:@typescript-eslint/recommended",
    "plugin:import/typescript",
)).map(config => ({
    ...config,
    files: ["**/*.ts", "**/*.tsx"],
})), {
    files: ["**/*.ts", "**/*.tsx"],

    plugins: {
        "@typescript-eslint": fixupPluginRules(typescriptEslint),
    },

    languageOptions: {
        parser: tsParser,
        ecmaVersion: 5,
        sourceType: "module",

        parserOptions: {
            project: "./tsconfig.json",
        },
    },

    rules: {
        "no-unused-vars": "off",
        "no-unused-expressions": "off",
        "no-shadow": "off",

        "react/jsx-filename-extension": ["error", {
            extensions: [".jsx", ".tsx"],
        }],

        "import/extensions": ["error", "ignorePackages", {
            js: "never",
            mjs: "never",
            jsx: "never",
            ts: "never",
            tsx: "never",
        }],

        "import/no-cycle": "off",
        "@typescript-eslint/restrict-template-expressions": "off",

        "@typescript-eslint/array-type": ["error", {
            default: "generic",
        }],

        "@typescript-eslint/no-unused-expressions": "error",
        "@typescript-eslint/no-shadow": "error",

        "@typescript-eslint/ban-types": ["error", {
            extendDefaults: true,

            types: {
                "{}": false,
            },
        }],

        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-non-null-assertion": "off",
        "@typescript-eslint/no-unused-vars": "error",
        "@typescript-eslint/no-empty-function": "error",
    },
}, {
    files: [
        "test/utils/**",
        "test/__test__/**",
        "packages/**/__test__/**",
        "packages/**/__doc__/**",
    ],

    rules: {
        "react/jsx-handler-names": "off",
        "react/display-name": "off",
        "react/button-has-type": "off",
        "import/no-unresolved": "off",
        "import/no-extraneous-dependencies": "off",
        "import/no-named-as-default": "off",
        "unicorn/consistent-function-scoping": "off",
        "import/no-relative-packages": "off",
        "react/forbid-prop-types": "off",
        "jsx-a11y/click-events-have-key-events": "off",
        "jsx-a11y/no-static-element-interactions": "off",
        "@typescript-eslint/no-unsafe-call": "off",
        "@typescript-eslint/no-floating-promises": "off",
        "@typescript-eslint/no-misused-promises": "off",
    },
}, {
    files: ["packages/**/__doc__/**"],

    rules: {
        "no-console": "off",
    },
}];
