<div class="icon {$$props.class}">
	{#if $$slots.img}
		<!-- Slot fallback -->
		<slot name="img">
			<img alt="" />
		</slot>
	{:else if $$slots.svg}
		<!-- Slot Fallback -->
		<slot name="svg">
			<svg />
		</slot>
	{:else}
		<slot />
	{/if}
</div>

<style lang="postcss">
	.icon {
		@apply flex items-center justify-center max-w-full max-h-full;

		/* Enabled by the postcssNesting package */
		& img,
		& svg {
			@apply max-h-full max-w-full;
		}
	}
</style>
