module.exports = {
	purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
	darkMode: false, // or 'media' or 'class'
	theme: {
		extend: {},
		fontFamily: {
			sans: ['General Sans','ui-sans-serif', 'system-ui'],
			mono: ['monospace']
		},
	},
	variants: {
		extend: {},
	},
	plugins: [],
	mode: 'jit'
	
}
