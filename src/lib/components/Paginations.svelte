<script lang="ts">
	import { ChevronLeft, ChevronRight } from 'lucide-svelte';
	import * as m from '$lib/paraglide/messages.js';
	interface Props {
		totalCount: number;
		perPage: number;
		currentPage: number;
		navigate: (page: number) => void;
	}

	let { totalCount = 100, perPage = 20, currentPage, navigate }: Props = $props();
	const maxPage = $derived(Math.ceil(totalCount / perPage));
</script>

<div class="flex flex-col items-center gap-4 py-6">
	<div class="flex items-center gap-2">
		<!-- Previous Button -->
		<button
			onclick={() => navigate(currentPage - 1)}
			disabled={currentPage === 1}
			class="rounded-lg p-2 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
		>
			<ChevronLeft class="h-5 w-5" />
		</button>

		<!-- Page Numbers -->
		<ul class="flex items-center gap-1">
			<li>
				<button
					onclick={() => navigate(1)}
					class="rounded-md px-3 py-1 hover:bg-gray-100 {currentPage === 1
						? 'bg-blue-500 text-white hover:bg-blue-600'
						: ''}"
				>
					1
				</button>
			</li>

			{#if currentPage > 3}
				<li class="pointer-events-none px-2 text-gray-400">···</li>
			{/if}

			{#if currentPage > 2}
				<li>
					<button
						onclick={() => navigate(currentPage - 1)}
						class="rounded-md px-3 py-1 hover:bg-gray-100"
					>
						{currentPage - 1}
					</button>
				</li>
			{/if}

			{#if currentPage > 1 && currentPage < maxPage}
				<li>
					<button disabled class="rounded-md bg-blue-500 px-3 py-1 text-white">
						{currentPage}
					</button>
				</li>
			{/if}

			{#if currentPage < maxPage - 1}
				<li>
					<button
						onclick={() => navigate(currentPage + 1)}
						class="rounded-md px-3 py-1 hover:bg-gray-100"
					>
						{currentPage + 1}
					</button>
				</li>
			{/if}

			{#if currentPage < maxPage - 2}
				<li class="pointer-events-none px-2 text-gray-400">···</li>
			{/if}

			{#if maxPage !== 1}
				<li>
					<button
						onclick={() => navigate(maxPage)}
						class="rounded-md px-3 py-1 hover:bg-gray-100 {currentPage === maxPage
							? 'bg-blue-500 text-white hover:bg-blue-600'
							: ''}"
					>
						{maxPage}
					</button>
				</li>
			{/if}
		</ul>

		<!-- Next Button -->
		<button
			onclick={() => navigate(currentPage + 1)}
			disabled={currentPage === maxPage}
			class="rounded-lg p-2 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
		>
			<ChevronRight class="h-5 w-5" />
		</button>
	</div>

	<div class="text-sm text-black dark:text-white">
		{m.pagination({
			min: (currentPage - 1) * perPage + 1,
			max: Math.min(currentPage * perPage, totalCount),
			total: totalCount
		})}
	</div>
</div>
