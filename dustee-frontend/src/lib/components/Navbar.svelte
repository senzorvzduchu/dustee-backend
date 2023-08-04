<script lang="ts">
	import Logo from '$lib/icons/dusteeLogo.svelte';
	import { enhance } from '$app/forms';
	import User from '$lib/icons/user.svelte';
	import AnimatedHamburger from './AnimatedHamburger.svelte';
	import { fly } from 'svelte/transition';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import toast from 'svelte-french-toast';
	import type { SubmitFunction } from '.svelte-kit/types/src/routes/prihlaseni/$types';

	let open = false;
	export let isLogged: boolean = false;

	const onClick = () => {
		open = !open;
	};

	const toggleOpen = () => {
		open = !open;
	};

	let sticky;

	onMount(() => {
		let parent = sticky.parentElement;

		while (parent) {
			parent = parent.parentElement;
		}
	});

	const logoutUser: SubmitFunction = ({ form }) => {
		return async ({ update, result }) => {
			if (result.type === 'redirect') {
				toast.success('Úspěšně jste se odhlásili.');
				form.reset();
			}
			if (result.type === 'error') {
				toast.error('Něco se pokazilo.');
			}
			update();
		};
	};
</script>

<div bind:this={sticky} class="flex flex-row items-center justify-between pl-6 pr-2">
	<a href="/" class="w-48 cursor-pointer">
		<Logo />
	</a>
	<div class="hidden md:flex flex-row items-center gap-2 relative">
		<i class="fa-solid fa-magnifying-glass text-gray-400 absolute left-2" />
		<input
			class="border-gray-400 rounded-lg h-10 border-[2px] pl-8 pr-2f"
			placeholder="Ostrava"
			type="text"
		/>
	</div>
	<div class="hidden md:flex flex-row gap-2">
		{#if isLogged}
			<form method="POST" action="/odhlaseni" use:enhance={logoutUser}>
				<button class="cursor-pointer">Odhlásit se</button>
			</form>
		{:else}
			<div class="flex flex-col gap-2">
				<button
					class="cursor-pointer flex items-center gap-2 hover:scale-105 duration-200 transition-all"
					on:click={() => goto('/registrace')}
				>
					<div>
						<User />
					</div>
					Nová registrace
				</button>
				<button
					class="cursor-pointer hover:scale-105 transition-all duration-200"
					on:click={() => goto('/prihlaseni')}
				>
					Přihlásit se
				</button>
			</div>
		{/if}
	</div>
	<div class="md:hidden">
		<AnimatedHamburger width="65" {onClick} {open} />
	</div>
</div>

{#if open}
	<div
		class="absolute bg-[#f9fafc] w-full text-xl py-3 px-2 flex flex-col items-center gap-2 shadow-xl"
		transition:fly={{ y: -200, duration: 400 }}
	>
		<div class="relative">
			<i class="fa-solid fa-magnifying-glass text-gray-400 absolute left-2 top-2.5" />
			<input
				class="border-gray-400 rounded-lg h-10 border-[2px] pl-8 pr-2f"
				placeholder="Ostrava"
				type="text"
			/>
		</div>
		{#if isLogged}
			<div
				class="cursor-pointer"
				on:click={() => {
					goto('/logout');
					toggleOpen();
				}}
				role="button"
				tabindex="0"
			>
				Odhlásit se
			</div>
		{:else}
			<div>
				<User />
			</div>
			<div
				class="cursor-pointer"
				on:click={() => {
					goto('/registrace');
					toggleOpen();
				}}
				role="button"
				tabindex="0"
			>
				Nová registrace
			</div>
			<div
				class="cursor-pointer mt-2"
				on:click={() => {
					goto('/prihlaseni');
					toggleOpen();
				}}
				role="button"
				tabindex="0"
			>
				Přihlásit se
			</div>
		{/if}
	</div>
{/if}
