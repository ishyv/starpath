<script lang="ts">
	import type { Character } from '$lib/types';

	let { character }: { character: Character } = $props();

	const glowColor = character.glow === 'teal' ? 'var(--teal)' : 'var(--violet)';
	const glowDim = character.glow === 'teal' ? 'var(--teal-dim)' : 'var(--violet-dim)';
</script>

<div class="char-card" style="--card-glow: {glowColor}; --card-glow-dim: {glowDim};">
	<div class="card-glow-bg"></div>
	<div class="card-content">
		<h3 class="char-name font-display">{character.name}</h3>
		<span class="char-role font-ui">{character.role}</span>
		<div class="card-divider"></div>
		<p class="char-desc font-body">{character.description}</p>

		<div class="stat-bars">
			<div class="stat">
				<span class="stat-label font-ui">{character.trait.label}</span>
				<div class="stat-bar">
					<div class="stat-fill teal" style="width: {character.trait.value}%"></div>
				</div>
			</div>
			<div class="stat">
				<span class="stat-label font-ui">{character.flaw.label}</span>
				<div class="stat-bar">
					<div class="stat-fill violet" style="width: {character.flaw.value}%"></div>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	.char-card {
		position: relative;
		width: 340px;
		min-width: 340px;
		height: 520px;
		border-radius: 12px;
		overflow: hidden;
		background: var(--deep);
		border: 1px solid var(--border);
		cursor: default;
		transition: transform 0.4s ease, box-shadow 0.4s ease;
		flex-shrink: 0;
	}

	.char-card:hover {
		transform: translateY(-8px);
		box-shadow: 0 0 60px color-mix(in srgb, var(--card-glow) 20%, transparent);
	}

	.char-card:hover .card-glow-bg {
		opacity: 0.25;
	}

	/* Scan-line on hover */
	.char-card:hover::after {
		content: '';
		position: absolute;
		inset: 0;
		background: linear-gradient(
			to bottom,
			transparent 0%,
			color-mix(in srgb, var(--card-glow) 8%, transparent) 50%,
			transparent 100%
		);
		background-size: 100% 40px;
		animation: scanline 0.6s ease-out forwards;
		pointer-events: none;
	}

	@keyframes scanline {
		from { background-position: 0 -40px; }
		to   { background-position: 0 calc(100% + 40px); }
	}

	.card-glow-bg {
		position: absolute;
		top: -40%;
		left: -20%;
		width: 140%;
		height: 80%;
		background: radial-gradient(ellipse, var(--card-glow-dim), transparent 70%);
		opacity: 0.15;
		filter: blur(40px);
		transition: opacity 0.4s ease;
		pointer-events: none;
	}

	.card-content {
		position: relative;
		z-index: 1;
		padding: 2.5rem 2rem 2rem;
		height: 100%;
		display: flex;
		flex-direction: column;
	}

	.char-name {
		font-size: 20px;
		letter-spacing: 0.2em;
		color: var(--text-primary);
		margin: 0 0 0.5rem;
	}

	.char-role {
		color: var(--text-dim);
		font-size: 11px;
	}

	.card-divider {
		width: 40px;
		height: 1px;
		background: var(--card-glow);
		opacity: 0.5;
		margin: 1.5rem 0;
	}

	.char-desc {
		color: var(--text-secondary);
		font-style: italic;
		font-size: 15px;
		line-height: 1.6;
		margin: 0 0 auto;
	}

	.stat-bars {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		margin-top: 1.5rem;
	}

	.stat {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.stat-label {
		color: var(--text-dim);
		font-size: 10px;
		min-width: 80px;
		text-transform: uppercase;
	}

	.stat-bar {
		flex: 1;
		height: 4px;
		background: var(--border);
		border-radius: 2px;
		overflow: hidden;
	}

	.stat-fill {
		height: 100%;
		border-radius: 2px;
		transition: width 0.6s ease;
	}

	.stat-fill.teal {
		background: var(--teal);
	}

	.stat-fill.violet {
		background: var(--violet);
	}
</style>
