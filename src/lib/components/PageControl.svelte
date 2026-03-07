<script lang="ts">
	import last_chapter_id from "$lib/stores/last_chapter_id";

	let { id } = $props();
</script>

<nav class="page-control">
	{#if id > 0}
		<a href={`/read/${id - 1}#`} class="page-link font-ui" title="Capitulo Anterior">
			<span class="page-arrow left">&larr;</span> ANTERIOR
		</a>
	{:else}
		<span></span>
	{/if}

	{#if id + 1 <= last_chapter_id}
		<a href={`/read/${id + 1}#`} class="page-link font-ui" title="Capitulo Siguiente">
			SIGUIENTE <span class="page-arrow right">&rarr;</span>
		</a>
	{:else}
		<span></span>
	{/if}
</nav>

<style>
	.page-control {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1.5rem 0;
	}

	.page-link {
		color: var(--teal);
		text-decoration: none;
		font-size: 11px;
		letter-spacing: 0.2em;
		display: flex;
		align-items: center;
		gap: 0.5rem;
		transition: color 0.25s ease;
	}

	.page-link:hover {
		color: var(--text-primary);
	}

	.page-arrow {
		transition: transform 0.25s ease;
		display: inline-block;
	}

	.page-link:hover .page-arrow.left {
		transform: translateX(-4px);
	}

	.page-link:hover .page-arrow.right {
		transform: translateX(4px);
	}
</style>
