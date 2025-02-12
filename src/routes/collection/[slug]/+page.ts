import type { PageLoad } from './$types';
import { GetCollection, GetCollections, SearchProducts } from '$lib/vendure';
import { type SearchInput } from '$src/lib/gql/graphql';

export const ssr = false;

export const load = async function ({ parent, params }) {
	const { client } = await parent();

	const input: SearchInput = {
		collectionSlug: params.slug,
		term: '',
		groupByProduct: true,
		//facetValueIds: $filtersStore,
		take: 50,
		skip: 0
	};
	return {
		client,
		collection: await client
			.query(GetCollection, { slug: params.slug })
			.toPromise()
			.then((result) => result?.data?.collection),
		products: await client
			.query(GetCollection, { slug: params.slug })
			.toPromise()
			.then((result) => result?.data?.search?.items),
		collections: await client
			.query(GetCollections, {})
			.toPromise()
			.then((result) => result?.data?.collections?.items),
		search: await client
			.query(SearchProducts, { input })
			.toPromise()
			.then((result) => result?.data?.search)
	};
} satisfies PageLoad;
