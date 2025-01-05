<script lang="ts">
/**
 * 
 * This is adapted from svead (https://github.com/spences10/svead)
 * by Scott Spence, which was inspired by Rodney Lab (https://rodneylab.com/)
 * and Kazuma Oe (oekazuma) (https://github.com/oekazuma/svelte-meta-tags)
 * 
 **/
 	import { 
		PUBLIC_SITE_NAME,
		PUBLIC_SITE_SHORT_NAME, 
		PUBLIC_SITE_DESCRIPTION, 
		PUBLIC_SITE_URL, 
		PUBLIC_SITE_IMAGE
	} from '$env/static/public'
	import { page } from '$app/state'

	interface MetaConfig {
		/**
		 * The title of the web page.
		 * Used in the <title> tag, og:title, and twitter:title properties.
		 *
		 * @type {string}
		 */
		title?: string;

		/**
		 * The description of the web page.
		 * Used in the description meta tag, og:description, and 
		 * twitter:description properties.
		 * 
		 * Best practices suggest keeping the description between 50-160 characters.
		 * Search engines may truncate descriptions longer than 155-160 characters.
		 * 
		 * Note: The Head component does not enforce these limits,
		 * it's up to the developer to ensure appropriate length.
		 *
		 * @type {string}
		 */
		description?: string;

		/**
		 * The URL of the web page.
		 * Used as the og:url property and twitter:url.
		 *
		 * @type {string}
		 */
		url?: string;

		/**
		 * The website to which the web page belongs.
		 * Used as twitter:domain.
		 *
		 * @type {string}
		 */
		website?: string;

		/**
		 * The language of the web page.
		 * Used as the og:locale property.
		 * Defaults to 'en'.
		 *
		 * @type {string}
		 * @default 'en'
		 */
		language?: string;

		/**
		 * The URL of the Open Graph image for the web page.
		 * Used as the og:image and twitter:image properties.
		 *
		 * @type {string}
		 */
		open_graph_image?: string;

		/**
		 * The payment pointer for Web Monetization.
		 * Used in the monetization meta tag.
		 *
		 * @type {string}
		 */
		payment_pointer?: string;

		/**
		 * The name of the author of the web page.
		 * Used in the author meta tag.
		 *
		 * @type {string}
		 */
		author_name?: string;

		/**
		 * The name of the site.
		 * Used as the og:site_name property.
		 *
		 * @type {string}
		 */
		site_name?: string;

		/**
		 * The Twitter handle of the content creator or site.
		 * Used as the twitter:creator property.
		 * Should include the @ symbol.
		 *
		 * @type {string}
		 */
		twitter_handle?: string;

		/**
		 * The type of Twitter card to use.
		 * Used as the twitter:card property.
		 * Defaults to 'summary_large_image'.
		 *
		 * @type {'summary' | 'summary_large_image' | 'app' | 'player'}
		 * @default 'summary_large_image'
		 */
		twitter_card_type?:
			| 'summary'
			| 'summary_large_image'
			| 'app'
			| 'player';

		/**
		 * Alternative text for the Open Graph image.
		 * Used as the og:image:alt property.
		 *
		 * @type {string}
		 */
		open_graph_image_alt?: string;
	}

	interface Props {
		config?: MetaConfig;
	}

	let { config = $bindable({}) }: Props = $props();

	if (config.title === undefined) config.title = PUBLIC_SITE_NAME
	if (config.description === undefined) config.description = PUBLIC_SITE_DESCRIPTION
	if (!config.url) config.url = page.url.href
	if (!config.website) config.website = PUBLIC_SITE_URL
	if (!config.language) config.language = 'en'
	if (!config.open_graph_image) config.open_graph_image = PUBLIC_SITE_IMAGE
	if (!config.site_name) config.site_name = PUBLIC_SITE_SHORT_NAME

	if (page.route.id !== '/') config.title += ' | ' + PUBLIC_SITE_SHORT_NAME
</script>

<svelte:head>
	<link rel="canonical" href={config.url} />

	<!-- Basic Meta Tags -->
	<title>{config.title}</title>
	<meta name="title" content={config.title} />
	<meta name="description" content={config.description} />

	{#if config.author_name}
		<meta name="author" content={config.author_name} />
	{/if}

	<!-- Open Graph / Facebook Meta Tags -->
	<meta property="og:url" content={config.url} />
	<meta property="og:type" content="website" />
	<meta property="og:title" content={config.title} />
	<meta property="og:description" content={config.description} />
	{#if config.open_graph_image}
		<meta property="og:image" content={config.open_graph_image} />
		<meta property="og:image:alt" content={config.open_graph_image_alt || config.title} />
	{/if}
	{#if config.site_name}
		<meta property="og:site_name" content={config.site_name} />
	{/if}

	<!-- Twitter Meta Tags -->
	<meta name="twitter:card" content={config.twitter_card_type || "summary_large_image"} />
	<meta name="twitter:title" content={config.title} />
	<meta name="twitter:description" content={config.description} />
	{#if config.open_graph_image}
		<meta name="twitter:image" content={config.open_graph_image} />
	{/if}
	{#if config.twitter_handle}
		<meta name="twitter:creator" content={config.twitter_handle} />
	{/if}
	{#if config.website}
		<meta property="twitter:domain" content={config.website} />
		<meta property="twitter:url" content={config.url} />
	{/if}

	<!-- Additional Structured Data -->
	<meta itemprop="name" content={config.title} />
	<meta itemprop="description" content={config.description} />
	{#if config.open_graph_image}
		<meta itemprop="image" content={config.open_graph_image} />
	{/if}

	<!-- Monetisation -->
	{#if config.payment_pointer}
		<meta name="monetization" content={config.payment_pointer} />
	{/if}

	<!-- Language -->
	{#if config.language}
		<meta property="og:locale" content={config.language} />
	{/if}
</svelte:head>