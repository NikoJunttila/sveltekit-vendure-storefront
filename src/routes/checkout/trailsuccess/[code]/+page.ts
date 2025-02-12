import type { PageLoad } from './$types';

export const prerender = false;

export const load = async function ({ params, url }) {
	const paramVals = {
		code: params.code,
		hmacCode: url.searchParams.get('signature'),
		transActionCode: url.searchParams.get('checkout-transaction-id')
	};
	return {
		paramVals
	};
} satisfies PageLoad;
