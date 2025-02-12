<script lang="ts">
	//
	// Most of this is from svelte-themes (https://github.com/beynar/svelte-themes) by @beynar
	//
	const MEDIA = '(prefers-color-scheme: dark)';

	interface Props {
		forcedTheme?: string;
		storageKey: string;
		attribute: string;
		enableSystem: boolean;
		defaultTheme: string;
		value?: { [themeName: string]: string };
		attrs: any;
	}

	let {
		forcedTheme = '',
		storageKey,
		attribute,
		enableSystem,
		defaultTheme,
		value = {},
		attrs
	}: Props = $props();

	const updateDOM = (name: string, literal?: boolean) => {
		name = value?.[name] || name;
		const val = literal ? name : `'${name}'`;
		if (attribute === 'class') {
			return `d.add(${val})${`;document.documentElement.style.setProperty('color-scheme', ${val})`}`;
		}
		return `d.setAttribute('${attribute}', ${val})${`;document.documentElement.style.setProperty('color-scheme', ${val})`}`;
	};

	let defaultSystem = $derived(defaultTheme === 'system');

	let optimization = $derived(
		attribute === 'class'
			? `var d=document.documentElement.classList;${`d.remove(${attrs
					.map((t: string) => `'${t}'`)
					.join(',')})`};`
			: `var d=document.documentElement;`
	);

	// Encapsulate script tag into string to not mess with the compiler
	let themeScript = $derived(
		`<${'script'}>${
			forcedTheme
				? `!function(){${optimization}${updateDOM(forcedTheme)}}()`
				: enableSystem
					? `!function(){try {${optimization}var e=localStorage.getItem('${storageKey}');${
							!defaultSystem ? updateDOM(defaultTheme) + ';' : ''
						}if("system"===e||(!e&&${defaultSystem})){var t="${MEDIA}",m=window.matchMedia(t);if(m.media!==t||m.matches){${updateDOM(
							'dark'
						)}}else{${updateDOM('light')}}}else if(e){ ${
							value ? `var x=${JSON.stringify(value)};` : ''
						}${updateDOM(value ? 'x[e]' : 'e', true)}}}catch(e){}}()`
					: `!function(){try{${optimization}var e=localStorage.getItem("${storageKey}");if(e){${
							value ? `var x=${JSON.stringify(value)};` : ''
						}${updateDOM(value ? 'x[e]' : 'e', true)}}else{${updateDOM(defaultTheme)};}}catch(t){}}();`
		}</${'script'}>`
	);
</script>

<svelte:head>
	{@html themeScript}
</svelte:head>
