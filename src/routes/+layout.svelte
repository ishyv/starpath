<script lang="ts">
	import '../app.css';
	import { cubicOut } from 'svelte/easing';
	import { onMount } from 'svelte';
	import Nav from '$lib/components/Nav.svelte';
	import AmbientParticles from '$lib/components/AmbientParticles.svelte';
	import { initScrollTracking } from '$lib/stores/scroll';

	let { children } = $props();

	onMount(() => {
		return initScrollTracking();
	});

	export function swipe(node: HTMLElement, { delay = 0, duration = 500, easing = cubicOut } = {}) {
		return {
			delay,
			duration,
			easing,
			css: (t: number) => {
				const translate = (1 - t) * 100;
				return `transform: translateX(${translate}%);`;
			}
		};
	}
</script>

<AmbientParticles />
<Nav />

<main transition:swipe class="site-root">
	{@render children()}
</main>

<style>
	:global(*) {
		box-sizing: border-box;
	}

	:global(html) {
		scroll-behavior: smooth;
	}

	.site-root {
		min-height: 100vh;
		background: var(--void);
		color: var(--text-primary);
		font-family: 'Crimson Pro', serif;
		font-size: 17px;
		line-height: 1.8;
		position: relative;
	}
</style>
