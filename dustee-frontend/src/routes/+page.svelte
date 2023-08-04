<script lang="ts">
	import type { SensorsMap } from '$utils/types/sensors';
	import Map from '$lib/components/Map.svelte';
	import Card from '$lib/components/Card.svelte';
	import { goto } from '$app/navigation';

	export let data;
	let sensorData: Promise<any> = data.props.data;
	let pm2: Promise<string> = data.props.pm2;
	let sensors: Promise<{ [key: string]: SensorsMap }> = data.props.sensors;
</script>

<div class="main">
	<div class="summary">
		{#await pm2}
			<div class="degree md:text-4xl font-thin">Načítání...</div>
		{:then pm2}
			<svg class="h-[60vw] sm:h-80">{@html pm2}</svg>
		{/await}
		<div class="flex flex-col">
			{#await sensorData}
				<div class="degree md:text-4xl font-thin">Načítání...</div>
			{:then data}
				<div class="temperature">
					<div class="degree md:text-8xl font-thin pr-5">
						{Math.round(data.sensordatavalues[0].value)} &#xb0 C
					</div>
					<img src="/images/png/Storm.png" class="h-[20vw] sm:h-36" alt="Storm" />
				</div>
				<div class="recommendation">
					<span class="font-medium">Špatná</span> kvalita ovzduší
				</div>
			{/await}
		</div>
	</div>
	<div
		class="my-16 flex flex-col lg:flex-row gap-10 md:gap-0 justify-between w-full h-full background rounded-3xl md:rounded-xl lg:pl-14"
	>
		<div class="mt-12 text-center flex flex-col items-center">
			<div class="text-4xl text-gray-950">Podrobné statistiky?</div>
			<div class="text-sm text-gray-400 font-light mt-2">
				(historie, předpovědi, škodlivé látky)
			</div>
			<div class="text-xl font-light text-gray-400 mt-16 max-w-xs">
				Zaregistrujte se a získejte přístup zdarma
			</div>
			<button on:click={() => goto('/registrace')} class="button mt-24 cursor-pointer">
				Registrovat se
			</button>
		</div>
		<button
			on:click={() => goto('/registrace')}
			class="cursor-pointer w-full mt-5 lg:mt-0 lg:w-3/5"
		>
			<img src="/images/png/LockGraphs.png" alt="Graphs" />
		</button>
	</div>
	{#await sensors}
		<div class="degree md:text-8xl font-thin">Načítání...</div>
	{:then sensors}
		<div class="w-full h-full my-10 flex items-center justify-center">
			<Map sensors={sensors.locations} />
		</div>
	{/await}
	{#await Promise.all([sensorData, pm2])}
		<div class="degree my-20 text-center font-thin">Načítání...</div>
	{:then [data, pm2]}
		<Card data={data.sensordatavalues} {pm2} />
	{/await}
</div>

<style lang="postcss">
	.main {
		@apply md:px-16 xl:px-36 md:my-20 my-24;
	}

	.summary {
		@apply flex justify-center items-center;
		@apply flex-col md:flex-row md:gap-36 gap-8;
	}

	.temperature {
		@apply flex flex-row items-center justify-center gap-5 md:gap-0 md:justify-around;
		@apply mb-8 md:mb-4;
	}

	.recommendation {
		@apply text-4xl font-light tracking-wide;
		@apply text-center md:text-left;
	}

	.degree {
		font-size: clamp(3rem, 18vw, 5rem);
	}

	.button {
		@apply bg-[#b3e3f2] rounded-[36px] max-w-fit py-3.5 px-8 flex items-center justify-center text-[#367079];
		@apply text-xl font-medium hover:scale-110 ease-in duration-200;
	}

	.background {
		background: rgb(249, 250, 252);
		background: linear-gradient(180deg, rgba(249, 250, 252, 1) 0%, rgba(255, 255, 255, 1) 100%);
	}
</style>
