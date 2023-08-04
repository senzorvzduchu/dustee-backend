<script lang="ts">
	// External Package imports
	import { Jumper } from 'svelte-loading-spinners';

	// Svelte imports
	import Heading from '$components/Heading.svelte';
	import Icon from '$components/Icon.svelte';
</script>

<main>
	<!-- Example of image component -->
	<Icon slot="img" class="h-12 w-12 mt-3 mb-1">
		<img src="/images/png/logo.png" alt="JEM LOGO" />
	</Icon>

	<!-- Heading (H1) Component Example -->
	<!-- You don't have to add class prop -->
	<Heading>Occhio Studios - Base Project</Heading>

	<!-- Example with class prop -->
	<Heading class="text-xs my-3">Init Project</Heading>

	<!-- Loader -->
	<Jumper size="60" color="#FF3E00" unit="px" duration="1s" />
</main>

<style lang="postcss">
	* {
		@apply text-center;
		font-family: 'Inter', sans-serif;
	}

	main {
		@apply flex h-screen w-screen justify-center items-center flex-col;
	}
</style>
