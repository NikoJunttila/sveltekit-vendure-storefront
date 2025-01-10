
import type { PageLoad } from './$types'
import { VerifyCustomerAccount } from '$lib/vendure'

export const prerender = true

export const load = (async function ({ url, parent}) {
	const { client } = await parent()
    const code = url.searchParams.get("token") || ""
    let success = ""
    if (code) success = await client.mutation(VerifyCustomerAccount, {token:code}).toPromise().then((result : any) => result.data)
	return {
		client,
        code,
        success,
	}
}) satisfies PageLoad
/*export const load: PageServerLoad = async ({ url, locals, cookies }) => {
	// vendure token renamed to code so as to not conflict with cf token if used
	const code = url.searchParams.get('token') || '' 
	const success = await verifyEmail(locals, cookies, code)
	return {
		success,
		code
	}
}*/