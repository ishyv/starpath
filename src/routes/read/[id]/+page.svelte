<script lang="ts">
	import user_config from '$lib/stores/user_config';
	import PageControl from "$lib/components/PageControl.svelte";

	let { data } = $props();
</script>

<div
	class="reader"
	style="
		background: {$user_config.background};
		color: {$user_config.color};
		font-family: {$user_config.font}, 'Crimson Pro', serif;
		font-size: {$user_config.font_size}px;
	"
>
	<a href="/" class="back-link font-ui">&larr; STARPATH</a>

	<PageControl id={data.id} />

	<!-- Glass tablet surface -->
	<div class="tablet">
		<!-- Aurora light seeping from above the tablet -->
		<div class="tablet-aurora" aria-hidden="true"></div>

		<!-- Ink shimmer overlay — gives text a faint magical luminescence -->
		<div class="tablet-shimmer" aria-hidden="true"></div>

		<article class="reader-content">
			{@html data.content}
		</article>
	</div>

	<PageControl id={data.id} />
</div>

<style>
	.reader {
		max-width: 720px;
		margin: 0 auto;
		padding: 5rem 2rem 5rem;
		min-height: 100vh;
	}

	.back-link {
		display: inline-block;
		color: var(--text-secondary);
		text-decoration: none;
		font-size: 11px;
		letter-spacing: 0.2em;
		margin-bottom: 2rem;
		transition: color 0.25s ease;
	}

	.back-link:hover {
		color: var(--teal);
	}

	/* ─── Glass Tablet ──────────────────────── */

	.tablet {
		position: relative;
		padding: 3.5rem 2.5rem 4rem;
		margin: 1rem 0;
		border-radius: 3px;

		/* Frosted glass surface */
		background: linear-gradient(
			180deg,
			rgba(255, 255, 255, 0.028) 0px,
			rgba(255, 255, 255, 0) 100px,
			rgba(61, 255, 196, 0.008) 100%
		);

		/* Glass edges */
		border: 1px solid rgba(61, 255, 196, 0.07);
		border-top: 1px solid rgba(255, 255, 255, 0.13);

		/* Depth shadows */
		box-shadow:
			0 0 100px rgba(61, 255, 196, 0.04),
			0 40px 120px rgba(0, 0, 0, 0.35),
			inset 0 1px 0 rgba(255, 255, 255, 0.08),
			inset 0 -1px 0 rgba(61, 255, 196, 0.04);
	}

	/* Aurora light bleeding down from above the tablet */
	.tablet-aurora {
		position: absolute;
		top: -1px;
		left: 15%;
		right: 15%;
		height: 1px;
		background: linear-gradient(
			to right,
			transparent,
			rgba(61, 255, 196, 0.55),
			rgba(157, 124, 248, 0.4),
			transparent
		);
		filter: blur(1.5px);
		pointer-events: none;
	}

	/* Ink shimmer — faint gradient that makes the "surface" feel lit */
	.tablet-shimmer {
		position: absolute;
		inset: 0;
		border-radius: 3px;
		background: radial-gradient(
			ellipse at 50% 0%,
			rgba(61, 255, 196, 0.025) 0%,
			transparent 60%
		);
		pointer-events: none;
	}

	/* ─── Markdown Content ──────────────────── */

	.reader-content :global(h1),
	.reader-content :global(h2) {
		font-family: 'Syncopate', sans-serif;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.15em;
		font-size: 1.4em;
		text-align: center;
		color: var(--text-primary);
		margin-top: 2.5em;
		margin-bottom: 1em;
		/* Magical ink glow — etched in aurora light */
		text-shadow:
			0 0 40px rgba(61, 255, 196, 0.28),
			0 0 80px rgba(61, 255, 196, 0.1);
	}

	.reader-content :global(h3),
	.reader-content :global(h4),
	.reader-content :global(h5),
	.reader-content :global(h6) {
		font-family: 'Syncopate', sans-serif;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		margin-top: 1.8em;
		margin-bottom: 0.6em;
		line-height: 1.35;
		text-shadow: 0 0 30px rgba(61, 255, 196, 0.15);
	}

	.reader-content :global(p) {
		margin: 1em 0;
		line-height: 1.9;
		/* Very faint magical luminescence on body text — barely perceptible */
		text-shadow: 0 0 28px rgba(61, 255, 196, 0.04);
	}

	.reader-content :global(ul),
	.reader-content :global(ol) {
		margin: 1em 0;
		padding-left: 1.5em;
	}

	.reader-content :global(li) {
		margin: 0.45em 0;
		line-height: 1.8;
	}

	/* Blockquote — glass excerpt panel */
	.reader-content :global(blockquote) {
		margin: 2em 0;
		padding: 1.2em 1.75em;
		background: linear-gradient(
			135deg,
			rgba(61, 255, 196, 0.04) 0%,
			rgba(157, 124, 248, 0.02) 100%
		);
		border: 1px solid rgba(61, 255, 196, 0.09);
		border-left: 2px solid rgba(61, 255, 196, 0.45);
		border-radius: 0 4px 4px 0;
		box-shadow:
			inset 0 0 30px rgba(61, 255, 196, 0.02),
			0 4px 20px rgba(0, 0, 0, 0.2);
		color: var(--text-secondary);
		font-style: italic;
	}

	/* HR — aurora divider */
	.reader-content :global(hr) {
		border: none;
		height: 1px;
		background: linear-gradient(
			to right,
			transparent,
			rgba(61, 255, 196, 0.35),
			rgba(157, 124, 248, 0.25),
			transparent
		);
		max-width: 220px;
		margin: 2.5em auto;
	}
</style>
