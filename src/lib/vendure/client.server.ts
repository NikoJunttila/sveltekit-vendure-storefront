import { Client, cacheExchange, fetchExchange } from '@urql/core';
import { dev } from '$app/environment';

export function createServerClient(fetch: typeof global.fetch) {
	return new Client({
		url: dev ? 'http://localhost:3000/shop-api' : 'https://your-prod-url/shop-api',
		exchanges: [cacheExchange, fetchExchange]
		/* fetch: async (url, init) => {
            const response = await fetch(url, init);
            (response as any).__raw = response;
            return response;
        },*/
	});
}
