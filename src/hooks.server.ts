import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { i18n } from '$lib/i18n';
export const handleSecurity: Handle = async ({ event, resolve }) => {
	// Required for all paths
	const response = await resolve(event);

	// SECURITY HEADERS
	// CSP directives are set elsewhere in svelte.config.js and added automatically by SvelteKit.
	// CSRF mitigation in SvelteKit is handled by header-checking and is enabled by default. More secure token-based CSRF mitigation must be added manually.
	// Token-based CSRF mitigation for the most sensitive endpoints/form actions is handled by Cloudflare Turnstile.
	// The headers below provide additional security against XSS, clickjacking, MIME-type sniffing, and other attacks.
	response.headers.set('X-Frame-Options', 'DENY');
	response.headers.set('X-Content-Type-Options', 'nosniff');
	response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
	response.headers.set(
		'Permissions-Policy',
		'payment=(*), accelerometer=(), camera=(), display-capture=(), encrypted-media=(), fullscreen=(), gyroscope=(), hid=(), interest-cohort=(), magnetometer=(), microphone=(), midi=(), publickey-credentials-get=(), sync-xhr=(), usb=(), xr-spatial-tracking=(), geolocation=()'
	);

	// CONTENT SECURITY POLICY (CSP) FOR STRIPE
	//TODO https://docs.stripe.com/security/guide?csp=csp-connect

	return response;
};
const handleParaglide: Handle = i18n.handle();
export const handle: Handle = sequence(handleParaglide, handleSecurity);
