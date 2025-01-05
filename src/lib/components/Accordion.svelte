<script lang="ts">
	import { slide } from 'svelte/transition'
	import { createAccordion } from '@melt-ui/svelte'
	import xss from 'xss'
	import { cn } from '../utils'
 
	const {
		elements: { content, item, trigger, root },
		helpers: { isSelected },
	} = createAccordion({ multiple: true })
 
	interface Props {
		items?: { id: string, title: string, description: string }[];
		class?: string;
	}

	let { items = [], class: className = '' }: Props = $props();
	
 </script>
 
 <div class={cn('mx-auto w-full rounded-xl bg-white shadow-lg', className)} {...$root} >
	{#each items as { id, title, description }, i}
	  	<div {...$item(id)} use:item class="overflow-hidden transition-colors">
		 	<h2 class="flex">
				<button type="button" {...$trigger(id)} use:trigger class={cn(
					'flex flex-1 cursor-pointer items-center justify-between bg-white px-5 py-5 text-2xl leading-none text-left transition-colors hover:bg-neutral-100 focus:!ring-0 focus-visible:text-magnum-800 border-t border-t-neutral-300 gap-x-8',
					$isSelected(id) && 'bg-[#f2f2f2]',)
				} data-faq-trigger>
					{title}
					<span>
						<svg xmlns="http://www.w3.org/2000/svg" class={cn('size-[24px] transition-all duration-200', $isSelected(id) && 'rotate-45')} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
					</span>
				</button>
		 	</h2>
			{#if $isSelected(id)}
				<div class={cn('overflow-hidden bg-[#f2f2f2] text-lg text-neutral-600 px-5 pt-2 pb-8')} {...$content(id)} use:content transition:slide data-faq-description>
					{@html xss(description)}
				</div>
			{/if}
	  	</div>
	{/each}
</div>