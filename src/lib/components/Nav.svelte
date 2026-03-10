<script lang="ts">
	import { scrollY } from '$lib/stores/scroll';

	let scrolled = $state(false);
	let mobileOpen = $state(false);

	$effect(() => {
		scrolled = $scrollY > window.innerHeight * 0.75;
	});

	const navItems = [
		{ label: 'MUNDO', href: '/#world' },
		{ label: 'PERSONAJES', href: '/#characters' },
		{ label: 'LEER', href: '/#chapters' },
		{ label: 'CONFIG', href: '/settings' }
	];
</script>

<nav class="site-nav" class:scrolled>
	<a href="/" class="nav-title font-display">STARPATH</a>

	<button
		class="mobile-toggle font-ui"
		onclick={() => mobileOpen = !mobileOpen}
		aria-label="Menu"
	>
		{mobileOpen ? '✕' : '≡'}
	</button>

	<ul class="nav-links font-ui">
		{#each navItems as item}
			<li>
				<a href={item.href} class="nav-link">{item.label}</a>
			</li>
		{/each}
	</ul>
</nav>

{#if mobileOpen}
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		class="mobile-overlay"
		onclick={() => mobileOpen = false}
		onkeydown={(e) => e.key === 'Escape' && (mobileOpen = false)}
	>
		<ul class="mobile-nav font-ui">
			{#each navItems as item}
				<li>
					<a href={item.href} class="mobile-link" onclick={() => mobileOpen = false}>{item.label}</a>
				</li>
			{/each}
		</ul>
	</div>
{/if}

<style>
	.site-nav {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 100;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 1.25rem 3rem;
		transition: background 0.4s ease, backdrop-filter 0.4s ease, border-bottom-color 0.4s ease;
		border-bottom: 1px solid transparent;
	}

	.site-nav.scrolled {
		background: var(--glass-bg);
		backdrop-filter: blur(var(--glass-blur)) saturate(1.4);
		-webkit-backdrop-filter: blur(var(--glass-blur)) saturate(1.4);
		border-bottom-color: var(--glass-border);
	}

	.nav-title {
		font-size: 13px;
		letter-spacing: 0.3em;
		color: var(--text-primary);
		text-decoration: none;
		text-shadow: 0 0 20px rgba(78, 255, 214, 0.2);
	}

	.nav-links {
		display: flex;
		gap: 2.5rem;
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.nav-link {
		color: var(--text-dim);
		text-decoration: none;
		font-size: 11px;
		letter-spacing: 0.2em;
		transition: color 0.25s ease;
		position: relative;
	}

	.nav-link::after {
		content: '';
		position: absolute;
		bottom: -3px;
		left: 0;
		width: 0;
		height: 1px;
		background: linear-gradient(to right, var(--teal), var(--violet));
		transition: width 0.3s cubic-bezier(0.23, 1, 0.32, 1);
	}

	.nav-link:hover {
		color: var(--text-primary);
	}

	.nav-link:hover::after {
		width: 100%;
	}

	.mobile-toggle {
		display: none;
		background: none;
		border: none;
		color: var(--text-secondary);
		font-size: 22px;
		cursor: pointer;
		padding: 0.25rem;
		line-height: 1;
	}

	.mobile-overlay {
		position: fixed;
		inset: 0;
		z-index: 99;
		background: rgba(3, 2, 10, 0.95);
		backdrop-filter: blur(30px);
		-webkit-backdrop-filter: blur(30px);
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.mobile-nav {
		list-style: none;
		padding: 0;
		margin: 0;
		text-align: center;
		display: flex;
		flex-direction: column;
		gap: 2.5rem;
	}

	.mobile-link {
		color: var(--text-secondary);
		text-decoration: none;
		font-size: 16px;
		letter-spacing: 0.3em;
		transition: color 0.25s ease;
	}

	.mobile-link:hover {
		color: var(--teal);
	}

	@media (max-width: 768px) {
		.nav-links {
			display: none;
		}

		.mobile-toggle {
			display: block;
		}

		.site-nav {
			padding: 1.25rem 1.5rem;
		}
	}
</style>
