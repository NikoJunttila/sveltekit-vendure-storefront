<script>
	// @ts-nocheck
	import { flip } from 'svelte/animate';
	import { fly } from 'svelte/transition';
	import { toast } from '../toast.svelte';

	const themes = {
		error: {
			background: '#FEE2E2',
			border: '#FCA5A5',
			text: '#991B1B',
			icon: '❌'
		},
		success: {
			background: '#DCFCE7',
			border: '#86EFAC',
			text: '#166534',
			icon: '✓'
		},
		warning: {
			background: '#FEF3C7',
			border: '#FCD34D',
			text: '#92400E',
			icon: '⚠️'
		},
		info: {
			background: '#DBEAFE',
			border: '#93C5FD',
			text: '#1E40AF',
			icon: 'ℹ️'
		},
		default: {
			background: '#F3F4F6',
			border: '#D1D5DB',
			text: '#1F2937',
			icon: 'ℹ️'
		}
	};

	function closeNotif(id) {
		toast.close(id);
	}
</script>

<div class="notifications">
	{#each toast.notifs as notification (notification.id)}
		<div
			animate:flip
			transition:fly={{ y: 30 }}
			class="toast-notification"
			style="
            --background: {themes[notification.type].background};
            --border: {themes[notification.type].border};
            --text: {themes[notification.type].text};
          "
		>
			<span class="icon text-black">{themes[notification.type].icon}</span>
			<span class="content">{notification.message}</span>
			<button class="close-btn ml-auto" onclick={() => closeNotif(notification.id)}>&times;</button>
		</div>
	{/each}
</div>

<style>
	.notifications {
		position: fixed;
		top: 5%;
		left: 0;
		right: 0;
		margin: 0 auto;
		z-index: 9999;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: center;
		pointer-events: none;
	}

	.toast-notification {
		flex: 0 0 auto;
		border-radius: 40px;
		width: 300px;
		margin-bottom: 10px;
		padding: 12px 20px;
		display: flex;
		align-items: center;
		gap: 10px;
		background-color: var(--background);
		border: 2px solid var(--border);
		box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
	}

	.icon {
		flex-shrink: 0;
		font-size: 1.1rem;
	}

	.content {
		color: var(--text);
		font-weight: 600;
		font-size: 0.95rem;
		line-height: 1.4;
	}
	.close-btn {
		background: none;
		border: none;
		color: black;
		font-size: 1.5rem;
		font-weight: bold;
		cursor: pointer;
		pointer-events: all;
	}
</style>
