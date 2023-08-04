<script lang="ts">
	import { page } from '$app/stores';

	function goTop() {
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}
</script>

<div class="flex justify-between md:mx-20 text-black/30 border-t py-8 px-8 sm:px-12 items-center">
	<div class="flex flex-row gap-4 w-full sm:basis-1/3">
		<a
			class="cursor-pointer hover:text-black text-lg"
			class:text-black={$page.url.pathname == '/o-nas'}
			href="/o-nas">O nás</a
		>
		/
		<a
			class="cursor-pointer hover:text-black text-lg"
			class:text-black={$page.url.pathname == '/kontakt'}
			href="/kontakt">Kontakt</a
		>
	</div>
	{#if $page.url.pathname == '/'}
		<button class="hidden sm:block text-3xl hover:text-black" on:click={goTop}>DUSTEE</button>
	{:else}
		<a href="/" class="hidden sm:block text-3xl hover:text-black">DUSTEE</a>
	{/if}
	<div class="flex justify-end flex-row gap-5 sm:basis-1/3 w-full">
		<a
			href="https://www.facebook.com/dustee.cz"
			class="fa-brands cursor-pointer fa-facebook fa-2xl hover:text-[#4267B2] active:scale-75"
			target="_blank"
		/>
		<a
			href="https://www.instagram.com/dustee.cz/"
			class="fa-brands cursor-pointer fa-instagram fa-2xl active:scale-75"
			target="_blank"
		/>
	</div>
</div>
<div class="sm:hidden text-center text-black/30 pb-4">
	<a href="/" class="text-2xl">DUSTEE</a>
</div>

<style>
	.fa-instagram:hover {
		color: transparent;

		background: radial-gradient(
			circle at 30% 107%,
			#fdf497 0%,
			#fdf497 5%,
			#fd5949 45%,
			#d6249f 60%,
			#285aeb 90%
		);
		background: -webkit-radial-gradient(
			circle at 30% 107%,
			#fdf497 0%,
			#fdf497 5%,
			#fd5949 45%,
			#d6249f 60%,
			#285aeb 90%
		);
		background-clip: text;
		-webkit-background-clip: text;
	}
	.fa-brands {
		line-height: 1;
	}
</style>
