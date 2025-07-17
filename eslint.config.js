import js from '@eslint/js'
import typescriptEslint from '@typescript-eslint/eslint-plugin'
import typescriptParser from '@typescript-eslint/parser'

export default [
    {
        ignores: [
            'index.js',
            'eslint.config.js',
            'jest.config.js',
            'cypress.config.ts',
            'index.map.js',
            '**/coverage/**',
            '**/assignment/**',
            '**/node_modules/**',
        ],
    },
    js.configs.recommended,
    {
        files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
        languageOptions: {
            parser: typescriptParser,
            parserOptions: {
                ecmaVersion: 'latest',
                sourceType: 'module',
            },
            globals: {
                console: 'readonly',
                process: 'readonly',
                Buffer: 'readonly',
                __dirname: 'readonly',
                __filename: 'readonly',
                exports: 'writable',
                module: 'writable',
                require: 'readonly',
                global: 'readonly',
                // Browser globals
                window: 'readonly',
                document: 'readonly',
                navigator: 'readonly',
                location: 'readonly',
                history: 'readonly',
                localStorage: 'readonly',
                sessionStorage: 'readonly',
                fetch: 'readonly',
                FormData: 'readonly',
                URLSearchParams: 'readonly',
                URL: 'readonly',
                Event: 'readonly',
                CustomEvent: 'readonly',
                // HTML Element types
                HTMLElement: 'readonly',
                HTMLFormElement: 'readonly',
                HTMLInputElement: 'readonly',
                HTMLButtonElement: 'readonly',
                HTMLSelectElement: 'readonly',
                HTMLOptionElement: 'readonly',
                HTMLSpanElement: 'readonly',
                HTMLDivElement: 'readonly',
                HTMLLabelElement: 'readonly',
                HTMLTextAreaElement: 'readonly',
                HTMLImageElement: 'readonly',
                HTMLAnchorElement: 'readonly',
                HTMLParagraphElement: 'readonly',
                HTMLHeadingElement: 'readonly',
                HTMLUListElement: 'readonly',
                HTMLLIElement: 'readonly',
                HTMLTableElement: 'readonly',
                HTMLTableRowElement: 'readonly',
                HTMLTableCellElement: 'readonly',
                Element: 'readonly',
                Node: 'readonly',
                NodeList: 'readonly',
                HTMLCollection: 'readonly',
            },
        },
        plugins: {
            '@typescript-eslint': typescriptEslint,
        },
        rules: {
            ...typescriptEslint.configs.recommended.rules,
            'indent': [
                'error',
                4,
            ],
            'linebreak-style': [
                'error',
                'windows',
            ],
            'quotes': [
                'error',
                'single',
            ],
            'semi': [
                'error',
                'never',
            ],
        },
    },
    // Cypress test files configuration
    {
        files: ['cypress/**/*.ts', 'cypress/**/*.js', '**/*.cy.ts', '**/*.cy.js'],
        languageOptions: {
            parser: typescriptParser,
            parserOptions: {
                ecmaVersion: 'latest',
                sourceType: 'module',
            },
            globals: {
                // Cypress globals
                cy: 'readonly',
                Cypress: 'readonly',
                describe: 'readonly',
                it: 'readonly',
                before: 'readonly',
                beforeEach: 'readonly',
                after: 'readonly',
                afterEach: 'readonly',
                expect: 'readonly',
                assert: 'readonly',
                // Browser globals
                window: 'readonly',
                document: 'readonly',
                navigator: 'readonly',
                location: 'readonly',
                console: 'readonly',
            },
        },
        plugins: {
            '@typescript-eslint': typescriptEslint,
        },
        rules: {
            ...typescriptEslint.configs.recommended.rules,
            'indent': [
                'error',
                4,
            ],
            'linebreak-style': [
                'error',
                'windows',
            ],
            'quotes': [
                'error',
                'single',
            ],
            'semi': [
                'error',
                'never',
            ],
        },
    },
    // Jest test files configuration
    {
        files: ['**/*.test.ts', '**/*.test.js', '**/*.spec.ts', '**/*.spec.js', 'src/test/**/*.ts'],
        languageOptions: {
            parser: typescriptParser,
            parserOptions: {
                ecmaVersion: 'latest',
                sourceType: 'module',
            },
            globals: {
                // Jest globals
                describe: 'readonly',
                it: 'readonly',
                test: 'readonly',
                expect: 'readonly',
                beforeAll: 'readonly',
                beforeEach: 'readonly',
                afterAll: 'readonly',
                afterEach: 'readonly',
                jest: 'readonly',
                // Node globals for tests
                console: 'readonly',
                process: 'readonly',
                Buffer: 'readonly',
                __dirname: 'readonly',
                __filename: 'readonly',
                global: 'readonly',
            },
        },
        plugins: {
            '@typescript-eslint': typescriptEslint,
        },
        rules: {
            ...typescriptEslint.configs.recommended.rules,
            'indent': [
                'error',
                4,
            ],
            'linebreak-style': [
                'error',
                'windows',
            ],
            'quotes': [
                'error',
                'single',
            ],
            'semi': [
                'error',
                'never',
            ],
        },
    },
] 