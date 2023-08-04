module.exports = {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	// darkMode: false, // or 'media' or 'class' => use depending on dark mode approach
	theme: {
		extend: {
			colors: {
				color: {
					'darker-modal-background': '#334155',
					'text-black': '#0F172A',
					'text-black-2': '#1E293B',
					'modal-border': '#E2E8F0',
					'grey-button-text': '#6A6A6A',
					'grey-button-bg': '#F0F0F0',
					'red-button-text': '#991B1B',
					'blue-button-bg': '#0099FF',
					'red-button-bg': '#FEE2E2',
					'grey-text': '#BBBBBB',
					'grey-text-2': '#646464',
					'grey-border': '#DADADA',
					'check-box-bg': '#E9ECEE',
					'tree-grey': '#E2E8F0',
					'url-text': '#7B7B7B',
					'bucket-item-bg': '#F8FAFB',
					'bucket-progress-bar': '#EDF8FF',
					'red-text': '#FF6666',
					'text-grey': '#64748B'
				}
			},
			dark: {
				// Dark Theme colors
			},
			light: {
				// light theme colors
			}
		}
	},
	variants: {
		extend: {}
	},
	plugins: []
};
