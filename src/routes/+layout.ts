import {
	createClient,
	GetTopLevelCollections,
	ActiveChannel,
	SearchProducts,
	GetCollections
} from '$lib/vendure';
import { type SearchInput } from '$src/lib/gql/graphql';
import { browser } from '$app/environment';
import posthog from 'posthog-js';

const client = createClient();
export const prerender = 'auto';

export async function load() {
	if (browser) {
		posthog.init('phc_Dh5qlcajmyjubClhzoSUlseSv2ewxrkv5iTpDrr89Sn', {
			api_host: 'https://cworker.randomderp.org',
			person_profiles:'always',
			capture_pageview: false,
			capture_pageleave: false
		});
	}
	const input: SearchInput = {
		term: '',
		groupByProduct: true,
		//facetValueIds: $filtersStore,
		take: 8,
		skip: 0
	};

	return {
		client,
		collections: await client
			.query(GetCollections, {})
			.toPromise()
			.then((result) => result?.data?.collections?.items),
		/* channel: await client.query(ActiveChannel, {}).toPromise().then((result) => result?.data?.activeChannel), */
		topProducts: await client
			.query(SearchProducts, { input })
			.toPromise()
			.then((result) => result?.data?.search.items)
	};
}
