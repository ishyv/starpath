<script lang="ts">
	import type { ColorHistory } from "$lib/stores/user_config";

	let { colors, set_color }: { colors: ColorHistory; set_color: (color: string) => void } = $props();
</script>

<div class="recent-colors">
	{#each colors as color}
		<button
			style="background-color: {color}"
			class="color-swatch"
			onclick={() => set_color(color)}
		>
			<span class="swatch-label font-ui">{color}</span>
		</button>
	{/each}
</div>

<style>
	.recent-colors {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 0.5rem;
		padding: 0.75rem;
		margin-top: 0.5rem;
		background: var(--deep);
		border-radius: 6px;
	}

	.color-swatch {
		width: 3.5rem;
		height: 2.5rem;
		border-radius: 4px;
		border: 1px solid var(--border);
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: border-color 0.25s ease;
	}

	.color-swatch:hover {
		border-color: var(--teal);
	}

	.swatch-label {
		font-size: 8px;
		color: var(--text-dim);
		opacity: 0.7;
	}
</style>
