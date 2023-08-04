module.exports = {
	mode: 'jit',
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				color: {
					'light-blue': '#b3e3f2',
					'dark-blue': '#3a737d'
				}
			}
		}
	},
	variants: {
		extend: {}
	},
	plugins: []
};
