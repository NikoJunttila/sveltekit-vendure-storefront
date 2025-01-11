import type { PageLoad } from './$types';

export const prerender = true;

export const load = async function ({ url }) {
	const code = url.searchParams.get('token') || '';
	return {
		code
	};
} satisfies PageLoad;