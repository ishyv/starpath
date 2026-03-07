<script lang="ts">
	let { label, body }: { label: string; body: string } = $props();
</script>

<div class="world-card">
	<span class="card-label font-ui">{label}</span>
	<p class="card-body font-body">{body}</p>
</div>

<style>
	.world-card {
		flex: 1;
		padding: 2rem;
		border-left: 1px solid var(--teal-dim);
		transition: border-color 0.3s ease, box-shadow 0.3s ease;
	}

	.world-card:hover {
		border-left-color: var(--teal);
		box-shadow: var(--glow-teal);
	}

	.world-card:hover .card-body {
		color: var(--text-primary);
	}

	.card-label {
		display: block;
		color: var(--teal);
		margin-bottom: 1rem;
		font-size: 11px;
	}

	.card-body {
		color: var(--text-secondary);
		font-size: 16px;
		line-height: 1.7;
		transition: color 0.3s ease;
	}
</style>
