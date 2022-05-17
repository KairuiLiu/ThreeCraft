module.exports = {
	env: {
		browser: true,
		es2021: true,
	},
	extends: ['eslint:recommended', 'plugin:@typescript-eslint/eslint-recommended', 'plugin:@typescript-eslint/recommended', 'airbnb-base', 'plugin:prettier/recommended', 'prettier'],
	parserOptions: {
		ecmaVersion: 2018,
		parser: '@typescript-eslint/parser',
		sourceType: 'module',
	},
	plugins: ['@typescript-eslint', 'html', '@typescript-eslint'],
	rules: {
		'no-console': process.env.NODE_ENV === 'development' ? 'off' : 'warn',
		'no-debugger': process.env.NODE_ENV === 'development' ? 'off' : 'warn',
		'no-alert': process.env.NODE_ENV === 'development' ? 'off' : 'warn',
		'import/resolver': 'off',
		'import/extensions': 'off',
		'import/no-unresolved': 'off',
		'no-unused-expressions': 'off',
		'no-param-reassign': 'off',
		'prettier/prettier': 'error',
		'import/prefer-default-export': 'off',
	},
};
