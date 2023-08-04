<script lang="ts">
	import AppLayout from './AppLayout.svelte';
	import Navbar from '$lib/components/Navbar.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { Toaster } from 'svelte-french-toast';

	let sticky;
	let scrolled = false;

	export let data;

	console.log(data);

	onMount(() => {
		const checkScroll = () => {
			scrolled = window.scrollY > 0;
		};

		window.addEventListener('scroll', checkScroll);

		return () => {
			window.removeEventListener('scroll', checkScroll);
		};
	});
</script>

<AppLayout>
	<div
		bind:this={sticky}
		class:scrolled={scrolled && $page.url.pathname === '/'}
		class="pt-2 bg-[#f9fafc] md:bg-transparent shadow-xl md:shadow-none pb-4 md:py-10 md:px-12 lg:px-24 w-full z-[99]"
	>
		<Navbar isLogged={data.isLogged} />
	</div>
	<slot />
	<Footer />
	<Toaster />
</AppLayout>

<style>
	.scrolled {
		@apply bg-[#f9fafc] shadow-xl sticky top-0;
	}
</style>
