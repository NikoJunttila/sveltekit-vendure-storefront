//+layout.ts file
import { createClient, GetCollections, GetTopLevelCollections } from '$lib/vendure';

export const prerender = 'auto';

export async function load({data}) {
	const { languageCode } = data;
	const client : any = createClient(languageCode);
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
