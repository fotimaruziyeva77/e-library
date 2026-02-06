import type { Config } from 'tailwindcss'
import lineClamp from '@tailwindcss/line-clamp'

const config: Config = {
	content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
	theme: {
		extend: {
			fontFamily: {
				inter: ['var(--font-roboto)', 'sans-serif'],
			},
			keyframes: {
				'caret-blink': {
					'0%,70%,100%': { opacity: '1' },
					'20%,50%': { opacity: '0' },
				},
			},
			animation: {
				'caret-blink': 'caret-blink 1.25s ease-out infinite',
			},
		},
	},
	plugins: [lineClamp],
}

export default config
