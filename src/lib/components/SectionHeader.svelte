<script lang="ts">
	let { category, name }: { category: string; name: string } = $props();
</script>

<div class="section-header font-ui">
	<span class="dot"></span>
	<span class="category">{category}</span>
	<span class="sep">//</span>
	<span class="name">{name}</span>
</div>

<style>
	.section-header {
		display: flex;
		align-items: center;
		gap: 0.6em;
		color: var(--text-dim);
		font-size: 11px;
		letter-spacing: 0.2em;
		margin-bottom: 3rem;
		text-transform: uppercase;
	}

	.dot {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: var(--teal);
		flex-shrink: 0;
	}

	.sep {
		color: var(--text-dim);
		opacity: 0.5;
	}

	.name {
		color: var(--text-secondary);
	}
</style>
