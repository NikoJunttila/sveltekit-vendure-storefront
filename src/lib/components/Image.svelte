<script lang="ts">
	interface Props {
		preview?: string;
		preset?: 'tiny' | 'thumb' | 'small' | 'medium' | 'large';
		alt?: string;
		class?: string;
	}
	let {
		preview = '',
		preset = 'medium',
		alt = '',
		class: className = ''
	}: Props = $props();
</script>
{#if preview && preview !== '/img/noimg.png'}
	<picture>
		<!-- This can be customized to use different image formats based on how you have set up your backend or custom image converter -->
		<!-- <source type="image/avif" srcSet={preview + `?preset=${preset}&format=avif`} />
		<source type="image/webp" srcSet={preview + `?preset=${preset}&format=webp`} />
		<img src={preview + `?preset=${preset}&format=jpg`} alt={alt} class={className} /> -->
		<img src={preview} alt={alt} class={className} />
	</picture>
{:else}
	<img src="/img/noimg.png" alt="Not Found" class={className} />
{/if}