<script lang="ts">
	import { teamMembers } from '$utils/pageTexts';
</script>

<section class="text-black background">
	<h1 class="text-5xl font-extralight text-center md:text-left">O nás</h1>

	<div class="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16">
		{#each teamMembers as member (member.name)}
			<div
				class="team-card relative flex flex-col items-center justify-center mb-8 transform transition-all duration-500 ease-in-out hover:scale-105"
			>
				<div class="team-card-image w-48 h-48 overflow-hidden relative mb-4 rounded-full">
					<img class="object-cover w-full h-full" src={member.image} alt={member.name} />
					<div
						class="team-card-overlay cursor-pointer absolute top-0 left-0 w-full h-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-500 ease-in-out"
					>
						<a href={member.link} target="_blank" class="team-card-link text-lg">Zobrazit profil</a>
					</div>
				</div>
				<h2 class="text-xl md:text-2xl font-bold mb-2 text-center">{member.name}</h2>
				<p class="text-center">{member.about}</p>
			</div>
		{/each}
	</div>
</section>

<style>
	.background {
		@apply py-16 rounded-2xl;
		@apply mx-2 md:mx-12 lg:mx-24 md:mt-0 mt-8 px-2 md:px-12 lg:px-24 bg-[#f8f9fc];
		background: linear-gradient(180deg, rgba(249, 250, 252, 1) 0%, rgba(255, 255, 255, 1) 100%);
	}
	.team-card {
		@apply bg-white px-12 py-10 rounded-2xl shadow-xl relative flex flex-col items-center justify-center mb-8;
		@apply transform transition-all duration-500 ease-in-out hover:scale-105 hover:shadow-2xl;
	}
	.team-card-image {
		@apply w-48 h-48 overflow-hidden relative mb-4 rounded-full;
	}
	.team-card-overlay {
		@apply bg-blue-600 bg-opacity-50 absolute top-0 left-0 w-full h-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-500 ease-in-out;
	}
	.team-card-link {
		@apply text-lg text-white h-full w-full flex items-center justify-center;
	}
</style>
