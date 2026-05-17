import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { paraglideMiddleware } from '$lib/paraglide/server';

const handleParaglide: Handle = ({ event, resolve }) =>
	paraglideMiddleware(event.request, ({ request, locale }) => {
		event.request = request;
		return resolve(event, {
			transformPageChunk: ({ html }) => html.replace('%paraglide.lang%', locale)
		});
	});

export const handleSecurity: Handle = async ({ event, resolve }) => {
	// Required for all paths
	const response = await resolve(event);
	// SECURITY HEADERS
	response.headers.set('X-Frame-Options', 'DENY');
	response.headers.set('X-Content-Type-Options', 'nosniff');
	response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
	response.headers.set(
		'Permissions-Policy',
		'payment=(*), accelerometer=(), camera=(), display-capture=(), encrypted-media=(), fullscreen=(), gyroscope=(), hid=(), interest-cohort=(), magnetometer=(), microphone=(), midi=(), publickey-credentials-get=(), sync-xhr=(), usb=(), xr-spatial-tracking=(), geolocation=()'
	);
	return response;
};

export const handle: Handle = sequence(handleParaglide, handleSecurity);
