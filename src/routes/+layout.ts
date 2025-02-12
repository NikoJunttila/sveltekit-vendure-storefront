import { createClient, GetTopLevelCollections, ActiveChannel, SearchProducts } from '$lib/vendure';
import { type SearchInput } from '$src/lib/gql/graphql';
const client = createClient();

export const prerender = 'auto';

export async function load() {
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
			.query(GetTopLevelCollections, {})
			.toPromise()
			.then((result) => result?.data?.collections?.items),
		/* channel: await client.query(ActiveChannel, {}).toPromise().then((result) => result?.data?.activeChannel), */
		topProducts: await client
			.query(SearchProducts, { input })
			.toPromise()
			.then((result) => result?.data?.search.items)
	};
}
