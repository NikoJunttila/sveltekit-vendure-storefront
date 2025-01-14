import { createClient, GetTopLevelCollections, ActiveChannel } from '$lib/vendure';

const client = createClient();

export const prerender = true;

export async function load() {
	return {
		client,
		collections: await client
			.query(GetTopLevelCollections, {})
			.toPromise()
			.then((result) => result?.data?.collections?.items),
		channel: await client.query(ActiveChannel, {}).toPromise().then((result) => result?.data?.activeChannel),
	};
}
