import type { PageLoad } from './$types'
import { GetCollection } from '$lib/vendure'

export const prerender = true

export const load = (async function ({ parent, params }) {
	const { client } = await parent()
	return {
		client,
		collection: await client.query(GetCollection, { slug: params.slug }).toPromise().then(result => result?.data?.collection),
		products: await client.query(GetCollection, { slug: params.slug }).toPromise().then(result => result?.data?.search?.items)
	}
}) satisfies PageLoad