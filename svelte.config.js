import adapter from '@sveltejs/adapter-node'
// import adapter from '@sveltejs/adapter-vercel'
//import adapter from '@sveltejs/adapter-cloudflare'
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'
import { join } from 'path'
import 'dotenv/config'

/** @type {import('@sveltejs/kit').Config} */
const config = {
	extensions: ['.svelte', '.md'],
	preprocess: [
		vitePreprocess({
			style: {
				css: {
					postcss: join(process.cwd(), 'postcss.config.cjs')
				}
			}
		})
	],
	kit: {
		// uncomment for Cloudflare
/* 		adapter: adapter({
			routes: {
				include: ['/*'],
				exclude: [
					'/img/*', 
					'/vid/*',
					'/crossdomain.xml',
					'/favicon.ico',
					'/logo.png',
					'/logo.svg',
					'/robots.txt'
				], 
			}
		}), */
		// uncomment for Node or Vercel
		adapter: adapter(),
		alias: {
			'$src/*': 'src/*'
		},
		// csp: {
		// 	directives: {
		// 		'script-src': ['self', 'https://laroastingco.com/', 'https://challenges.cloudflare.com/', 'https://js.stripe.com/'],
		// 		'img-src': ['self', 'https://laroastingco.com/', 'data:', process.env.ORIGIN, 'https://challenges.cloudflare.com/', 'https://js.stripe.com/'],
		// 	}
		// },
		// csrf: {
		// 	checkOrigin: false,
		// }
	},
}

export default config
