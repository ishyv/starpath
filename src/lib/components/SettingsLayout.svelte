<script lang="ts">
	let { title = 'Configuracion', children }: { title?: string; children: any } = $props();
</script>

<div class="settings-root">
	<h1 class="settings-title font-display">{title}</h1>
	<p class="settings-desc font-body">
		Aqui puedes configurar la apariencia de la applicacion.
	</p>
	{@render children()}
</div>

<style>
	.settings-root {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 100%;
		max-width: 720px;
		margin: 0 auto;
		padding: 5rem 2rem 3rem;
	}

	.settings-title {
		font-size: 20px;
		letter-spacing: 0.3em;
		color: var(--text-primary);
		margin: 0 0 0.5rem;
	}

	.settings-desc {
		color: var(--text-secondary);
		font-size: 15px;
		margin-bottom: 2rem;
	}
</style>
