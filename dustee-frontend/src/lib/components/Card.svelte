<script lang="ts">
	export let data: any = [];
	export let pm2: string;
</script>

<div class="flex flex-col px-16 md:px-0 md:flex-row gap-20 justify-center mt-20">
	<div class="card">
		{#if data}
			<div class="pt-2 md:mt-0 text-xl">Dnes</div>
			{#if pm2}
				<svg class="w-full h-full">{@html pm2}</svg>
			{/if}
			<div class="flex flex-row gap-5 items-center mb-2 md:mb-0">
				<div class="text-2xl font-light">{Math.round(data[0].value)} &#176 C</div>
				<img src="/images/png/Storm.png" class="h-14" alt="Storm" />
			</div>
		{:else}
			<div class="text-2xl">Načítání...</div>
		{/if}
	</div>
</div>

<style lang="postcss">
	.card {
		@apply bg-white w-full h-auto flex flex-col rounded-lg;
		@apply justify-center items-center gap-4 max-w-xs;
		box-shadow: 0px 0px 10px 4px rgba(43, 43, 43, 0.08);
	}
</style>
