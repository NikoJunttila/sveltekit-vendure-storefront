import type { PageLoad } from './$types';
import { GetCollection, GetCollections, SearchProducts } from '$lib/vendure';
import { type SearchInput } from '$src/lib/gql/graphql';

export const prerender = true;

export const load = async function ({ parent, params }) {
	const { client } = await parent();
	const page = Number(params.slug);
	let skip = page * 20;
	if (skip >= 20) {
		skip -= 20;
	}
	const input: SearchInput = {
		term: '',
		groupByProduct: true,
		//facetValueIds: $filtersStore,
		take: 20,
		skip: skip
	};
	return {
		client,
		search: await client
			.query(SearchProducts, { input })
			.toPromise()
			.then((result) => result?.data?.search)
	};
} satisfies PageLoad;
