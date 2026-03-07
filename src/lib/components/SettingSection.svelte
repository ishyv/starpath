<script lang="ts">
	let { title, description, children }: { title: string; description: string; children: any } = $props();
</script>

<section class="setting-section">
	<h2 class="section-title font-display">{title}</h2>
	<p class="section-desc font-body">{description}</p>
	<div class="section-divider"></div>
	{@render children()}
</section>

<style>
	.setting-section {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 100%;
		padding: 2rem;
		margin-top: 1rem;
		background: var(--surface);
		border: 1px solid var(--border);
		border-left: 2px solid var(--teal-dim);
		border-radius: 8px;
	}

	.section-title {
		font-size: 14px;
		letter-spacing: 0.2em;
		color: var(--text-primary);
		margin: 0 0 0.25rem;
	}

	.section-desc {
		color: var(--text-secondary);
		font-size: 14px;
		margin: 0 0 1rem;
	}

	.section-divider {
		width: 40px;
		height: 1px;
		background: var(--border);
		margin-bottom: 1.5rem;
	}
</style>
