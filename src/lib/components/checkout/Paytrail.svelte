<script lang="ts">
	interface Props {
		sendPayment: any;
		disabled: boolean;
		text: string;
	}

	let { sendPayment, disabled, text }: Props = $props();
</script>

<div class="grid place-items-center">
	<div>
		<h2 class="text-center">{text}</h2>
		<button onclick={sendPayment} {disabled} class="flex w-full">
			<img
				class="mx-auto rounded hover:opacity-80"
				height="150px"
				width="150px"
				src="https://www.paytrail.com/hubfs/paytrail-logo-250px.png"
				alt="Paytrail"
			/>
		</button>
	</div>
</div>
