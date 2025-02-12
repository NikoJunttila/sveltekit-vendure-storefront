import { Client, cacheExchange, fetchExchange } from '@urql/svelte';

import { page } from '$app/state';
import { dev } from '$app/environment';
import {
	PUBLIC_VENDURE_LANGUAGE,
	PUBLIC_SHOPAPI_DEV_URL,
	PUBLIC_SHOPAPI_PROD_URL,
	PUBLIC_VENDURE_CHANNEL_TOKEN
} from '$env/static/public';

export * from './collection.graphql';
export * from './customer.graphql';
export * from './order.graphql';
export * from './product.graphql';
export * from './channel.graphql';

export const createClient = () => {
	let url = dev ? PUBLIC_SHOPAPI_DEV_URL : PUBLIC_SHOPAPI_PROD_URL;
	if (PUBLIC_VENDURE_LANGUAGE) {
		url.concat(`?languageCode=${PUBLIC_VENDURE_LANGUAGE}`);
	}
	const client = new Client({
		url: dev ? PUBLIC_SHOPAPI_DEV_URL : PUBLIC_SHOPAPI_PROD_URL,
		exchanges: [cacheExchange, fetchExchange],
		fetchOptions: {
			credentials: 'include',
			headers: {
				'vendure-token': PUBLIC_VENDURE_CHANNEL_TOKEN
			}
		}
	});
	return client;
};
