<script lang="ts">
/**
 * 
 * This is adapted from svead (https://github.com/spences10/svead)
 * by Scott Spence, which was inspired by Rodney Lab (https://rodneylab.com/)
 * and Kazuma Oe (oekazuma) (https://github.com/oekazuma/svelte-meta-tags)
 * 
 **/
	import type { Thing, WithContext } from 'schema-dts'

	type SchemaOrgType = Thing | WithContext<Thing>

	interface Props {
		schema: SchemaOrgType | SchemaOrgType[];
	}

	let { schema }: Props = $props();

	// Function to add '@context' to schema if it's missing
	function process_schema(schema: any): any {
		const context = { '@context': 'https://schema.org' };
		if (Array.isArray(schema)) {
			return [context, ...schema]
		}
		return { ...context, ...schema }
	}
	const processed_schema = process_schema(schema);

	// Wrap the line to prevent SvelteKit from thinking it's a real script tag
	const json_ld_data =
		`<script type="application/ld+json">${JSON.stringify(processed_schema, null, 2)}</scr` +
		`ipt>`;
</script>

<svelte:head>
	{@html json_ld_data}
</svelte:head>