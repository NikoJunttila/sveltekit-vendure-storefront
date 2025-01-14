import containerQueries from '@tailwindcss/container-queries';
import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';
import type { Config } from 'tailwindcss';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {
			colors: {
				primary: {
					400: '#60a5fa',
					500: '#3b82f6',
					600: '#2563eb',
					700: '#1d4ed8',
					800: '#1e40af',
					900: '#1e3a8a',
				},
				secondary: {
					400: '#f3f4f6',
					500: '#e5e7eb',
					600: '#d1d5db',
					700: '#9ca3af',
					800: '#6b7280',
					900: '#4b5563',
				}
			}
		}
	},

	plugins: [typography, forms, containerQueries]
} satisfies Config;
