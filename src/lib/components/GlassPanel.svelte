<script lang="ts">
	import type { Snippet } from 'svelte';
	import { tilt } from '$lib/actions/tilt';

	let {
		glow = 'teal',
		tiltEnabled = true,
		maxTilt = 6,
		children
	}: {
		glow?: 'teal' | 'violet' | 'none';
		tiltEnabled?: boolean;
		maxTilt?: number;
		children: Snippet;
	} = $props();
</script>

<div
	class="glass-panel"
	class:glow-violet={glow === 'violet'}
	class:no-glow={glow === 'none'}
	use:tilt={tiltEnabled ? { maxTilt } : undefined}
>
	<div class="panel-content">
		{@render children()}
	</div>
</div>

<style>
	.panel-content {
		position: relative;
		z-index: 2;
		width: 100%;
		height: 100%;
	}

	.no-glow:hover {
		box-shadow: var(--glass-shadow) !important;
		border-color: var(--glass-border) !important;
	}
</style>
