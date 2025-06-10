import { Client, cacheExchange, fetchExchange } from '@urql/svelte';
import { dev } from '$app/environment';
import {
	PUBLIC_VENDURE_LANGUAGE,
	PUBLIC_SHOPAPI_DEV_URL,
	PUBLIC_SHOPAPI_PROD_URL,
	PUBLIC_VENDURE_CHANNEL_TOKEN,
	PUBLIC_VENDURE_SUPPORT_MULTI_LANGUAGE
} from '$env/static/public';

export * from './collection.graphql';
export * from './customer.graphql';
export * from './order.graphql';
export * from './product.graphql';
export * from './channel.graphql';

export const createClient = (languageCode : string = "") => {
	let url = dev ? PUBLIC_SHOPAPI_DEV_URL : PUBLIC_SHOPAPI_PROD_URL;
	if (PUBLIC_VENDURE_SUPPORT_MULTI_LANGUAGE == "true"){
		if (languageCode != ""){
			url += `?languageCode=${languageCode}`;
		} else if (PUBLIC_VENDURE_LANGUAGE) {
			url += `?languageCode=${PUBLIC_VENDURE_LANGUAGE}`;
		}
	}
	console.log(url)
	const client = new Client({
		url: url,
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
