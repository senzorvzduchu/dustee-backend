<script lang="ts">
	import RedShield from '$lib/icons/RedShield.svelte';
	import { clickOutside } from '$utils/clickOutside';

	import { scale, fade } from 'svelte/transition';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();
</script>

<div class="darker" transition:fade />
<div
	class="popup-holder"
	transition:scale
	use:clickOutside
	on:clickOutside={() => {
		dispatch('close');
	}}
>
	<div class="w-full sm:w-7/12 lg:w-1/3 mx-2 bg-white rounded-lg max-w-lg">
		<div class="text-lg w-full pl-7 border-b border-[#E2E8F0] py-4 font-semibold">
			Unsubscribe App
		</div>
		<div class="bg-[#FEE2E2] text-[#92400E] h-fit pb-4 pr-9">
			<div class="grid grid-cols-12 pt-4 mt-6">
				<div class="w-6 ml-6"><RedShield /></div>
				<div class="ml-6 col-span-11">
					Once you unsubscribe your app all data will be lost and you will no longer be able to make
					requests from it
				</div>
			</div>
		</div>

		<div class="password">
			<div class="label">Enter account password</div>
			<input type="password" class="input" />
		</div>

		<!--Button part-->
		<div class="w-full flex items-center justify-center my-8 gap-6">
			<button
				class="text-slate-600 border-2 border-slate-500 rounded-lg w-36 h-12"
				on:click={() => {
					dispatch('close');
				}}
			>
				Cancel
			</button>
			<button class="text-white border-2 border-[#B91C1C] bg-[#B91C1C] rounded-lg w-36 h-12">
				Reset
			</button>
		</div>
	</div>
</div>

<style lang="postcss">
	.darker {
		@apply opacity-100 fixed top-0 bottom-0 left-0 right-0 z-20;
		@apply bg-color-darker-modal-background bg-opacity-30;
	}

	.popup-holder {
		@apply fixed top-0 left-0 right-0 bottom-0 h-screen w-screen z-20 md:px-4;
		@apply justify-center items-center flex;
	}

	.input {
		@apply border-2 rounded-lg border-color-modal-border;
		@apply h-12 px-4 mr-1 mb-1;
		@apply w-full;
	}

	.password {
		@apply px-8 pt-6;
	}

	.label {
		@apply mb-3;
	}
</style>
