import { createClient, GetCollections, GetTopLevelCollections } from '$lib/vendure';
const client : any = createClient();

export const prerender = 'auto';

export async function load() {
	return {
		client,
		collections: await client
			.query(GetCollections, {})
			.toPromise()
			.then((result : any) => result?.data?.collections?.items),
		topCollections: await client.query(GetTopLevelCollections, {}).toPromise().then((result : any) => result?.data?.collections?.items)
		/* channel: await client.query(ActiveChannel, {}).toPromise().then((result) => result?.data?.activeChannel), */
	};
}
