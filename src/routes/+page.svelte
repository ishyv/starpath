<script lang="ts">
	import { onMount } from 'svelte';
	import HeroScene from '$lib/components/HeroScene.svelte';
	import SectionHeader from '$lib/components/SectionHeader.svelte';
	import EnergyLine from '$lib/components/EnergyLine.svelte';
	import GlassPanel from '$lib/components/GlassPanel.svelte';

	let { data } = $props();

	// ─── Title Letter Reveal ────────────────
	const titleChars = 'STARPATH'.split('');
	let titleRevealed = $state(false);
	let lineRevealed = $state(false);

	// ─── Live Coordinates ───────────────────
	let coordN = $state(47.2000);
	let coordE = $state(-122.8000);
	let tempC = $state(-34.1);

	// ─── IntersectionObserver ───────────────
	onMount(() => {
		setTimeout(() => { titleRevealed = true; }, 300);
		setTimeout(() => { lineRevealed = true; }, 1100);

		// Drift coordinates — live sensor feel
		const coordInterval = setInterval(() => {
			coordN += (Math.random() - 0.5) * 0.002;
			coordE += (Math.random() - 0.5) * 0.002;
		}, 3000);

		const tempInterval = setInterval(() => {
			tempC = -33.8 + Math.random() * -0.7;
		}, 4000);

		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						entry.target.classList.add('visible');
						observer.unobserve(entry.target);
					}
				}
			},
			{ threshold: 0.06 }
		);
		document.querySelectorAll('.observe').forEach(el => observer.observe(el));

		return () => {
			clearInterval(coordInterval);
			clearInterval(tempInterval);
			observer.disconnect();
		};
	});

	// ─── Character Data ─────────────────────
	const characters = [
		{
			name: 'ESTELLE VACUO',
			classification: 'γ-1 // I/55 · O/34',
			classTooltip: 'Clasificación γ-1: perfil de alta recepción. I/O expresados en unidades de flujo fotolumínico registrado.',
			description: '18 años. Filiación no disponible. Ingreso reciente en la División de Investigación. Núcleo de perfil analítico; manifestación cefálica estable en forma de corona lumínica. Temperatura aparente: baja.',
			glow: 'teal' as const,
			inputVal: 55,
			outputVal: 34,
			stats: [
				{ label: 'RESOLUCIÓN', value: 82 },
				{ label: 'CONTROL', value: 45 }
			]
		},
		{
			name: 'NADIA SERLEN',
			classification: 'γ+1 // I/47 · O/65',
			classTooltip: 'Clasificación γ+1: perfil de alta expulsión. Latencia de respuesta: valores fuera de rango medible en condiciones estándar.',
			description: '19 años. Aptitudes excepcionales registradas. Núcleo de alta expulsión con latencia nula observada. En pruebas cerradas, la respuesta antecede al estímulo.',
			glow: 'violet' as const,
			inputVal: 47,
			outputVal: 65,
			stats: [
				{ label: 'EXPULSIÓN', value: 78 },
				{ label: 'CONTROL', value: 70 }
			]
		}
	];
</script>

<!-- ═══════════════════════════════════════════
     SECTION 01 — HERO
     ═══════════════════════════════════════════ -->
<section class="hero" id="hero">
	<HeroScene />
	<div class="holo-grid"></div>
	<div class="hero-overlay"></div>

	<!-- Positioned elements relative to .hero -->
	<span class="sector-label font-ui">
		SECTOR B3 // {coordN.toFixed(4)}N {coordE.toFixed(4)}E // ANNO POST-CRISIS
	</span>

	<div class="hero-content">
		<div class="hero-title-block">
			<h1 class="hero-title font-display">
				{#each titleChars as char, i}
					<span
						class="title-char"
						class:revealed={titleRevealed}
						style="transition-delay: {i * 70}ms"
					>{char}</span>
				{/each}
			</h1>

			<div class="title-line" class:revealed={lineRevealed}></div>

			<p class="hero-subtitle font-body">
				<em class="text-white/60">En la noche perpetua, todo poder termina por parecerse a una obligación.</em>
			</p>

			<div class="hero-cta-row">
				<a href="#chapters" class="cta-btn font-ui">LEER AHORA</a>
				<a href="#world" class="cta-ghost font-ui">EXPLORAR MUNDO</a>
			</div>
		</div>

	</div>

	<span class="scroll-hint font-ui">
		<span class="scroll-arrow">↓</span>&nbsp;SCROLL
	</span>
</section>

<!-- ═══════════════════════════════════════════
     SECTION 02 — WORLD (Editorial, no glass cards)
     ═══════════════════════════════════════════ -->
<section class="world-section observe" id="world">
	<div class="section-inner">
		<SectionHeader category="SISTEMA" name="MUNDO" />

		<div class="world-editorial">
			<!-- Left: main world text -->
			<div class="world-primary">
				<div class="world-sensor font-ui">
					<span class="sensor-dot"></span>
					B3 // {coordN.toFixed(4)}N {coordE.toFixed(4)}E
					<span class="sensor-temp">{tempC.toFixed(1)}°C</span>
				</div>

				<h2 class="world-heading font-display">PLANETA B3</h2>
				<p class="world-body font-body">
					Mundo catalogado sin emisión estelar directa. Superficie en oscuridad
					permanente, temperatura subcrítica y actividad biológica anómala: flora
					rojo-violeta retorcida emergiendo a través del hielo. Población residual
					concentrada en una instalación subterránea de investigación. La aurora
					constituye el único fenómeno celeste estable.
				</p>

				<div class="world-stats font-ui">
					<span>POP: ~1.000</span>
					<span class="stat-sep">·</span>
					<span>TEMP EXT: {tempC.toFixed(1)}°C</span>
					<span class="stat-sep">·</span>
					<span>STATUS: MARGINAL</span>
				</div>
			</div>

			<!-- Vertical hairline separator -->
			<div class="world-separator"></div>

			<!-- Right: two world facts -->
			<div class="world-secondary">
				<div class="world-fact">
					<span class="fact-label font-ui">POST-GRAN CRISIS ENERGÉTICA</span>
					<p class="fact-body font-body">
						Los registros posteriores a la Gran Crisis Energética
						reclasificaron la antigua profecía como instrumento de
						movilización. Persistieron la escasez y dos linajes humanos
						obligados a compartir B3.
					</p>
				</div>

				<div class="world-fact">
					<span class="fact-label font-ui">NUEVA HUMANIDAD // NÚCLEO MÁGICO</span>
					<p class="fact-body font-body">
						Se observó la formación espontánea de un órgano no descrito en
						la región del plexo solar. El tejido, denominado núcleo mágico,
						desarrolla ramificaciones fotolumínicas intravasculares.
						Su mecanismo sigue sin explicación suficiente.
					</p>
				</div>
			</div>
		</div>

	</div>

	<!-- Decorative topographic rings — relative to section, not content -->
	<div class="topo-decoration" aria-hidden="true">
		{#each [1, 2, 3, 4, 5] as ring}
			<div class="topo-ring" style="width: {ring * 52}px; height: {ring * 52}px; opacity: {0.055 - ring * 0.008};"></div>
		{/each}
	</div>
</section>

<!-- ═══════════════════════════════════════════
     SECTION 03 — CHARACTERS (Dossier panels)
     ═══════════════════════════════════════════ -->
<section class="characters-section observe" id="characters">
	<div class="section-inner">
		<SectionHeader category="ARCHIVOS" name="PERSONAJES" />

		<div class="dossier-grid">
			{#each characters as char}
				<div class="dossier-panel" class:dossier-teal={char.glow === 'teal'} class:dossier-violet={char.glow === 'violet'}>
					<!-- Classification watermark -->
					<div class="dossier-watermark font-ui" aria-hidden="true">
						{char.classification.split('//')[0].trim()}
					</div>

					<!-- Magic crown SVG -->
					<div class="crown-wrap" aria-hidden="true">
						<svg class="crown-svg" viewBox="0 0 120 60" fill="none" xmlns="http://www.w3.org/2000/svg">
							<!-- Crown arc base -->
							<path d="M 10 50 Q 60 5 110 50" stroke="currentColor" stroke-width="1" fill="none" opacity="0.5"/>
							<!-- Radiating rays -->
							<line x1="60" y1="4" x2="60" y2="0" stroke="currentColor" stroke-width="1" opacity="0.6"/>
							<line x1="40" y1="12" x2="37" y2="7" stroke="currentColor" stroke-width="0.8" opacity="0.45"/>
							<line x1="80" y1="12" x2="83" y2="7" stroke="currentColor" stroke-width="0.8" opacity="0.45"/>
							<line x1="22" y1="28" x2="18" y2="24" stroke="currentColor" stroke-width="0.7" opacity="0.3"/>
							<line x1="98" y1="28" x2="102" y2="24" stroke="currentColor" stroke-width="0.7" opacity="0.3"/>
							<!-- Crown glow circle -->
							<circle cx="60" cy="3" r="2.5" fill="currentColor" opacity="0.7"/>
							<circle cx="40" cy="11" r="1.5" fill="currentColor" opacity="0.5"/>
							<circle cx="80" cy="11" r="1.5" fill="currentColor" opacity="0.5"/>
						</svg>
					</div>

					<!-- Top color stripe -->
					<div class="dossier-stripe"></div>

					<!-- Edge energy channel -->
					<div class="energy-edge"></div>

					<div class="dossier-content">
						<div class="dossier-header">
							<h3 class="dossier-name font-display">{char.name}</h3>
							<span
								class="dossier-class font-ui"
								title={char.classTooltip}
							>{char.classification}</span>
						</div>

						<p class="dossier-desc font-body">{char.description}</p>

						<!-- Magic I/O channels -->
						<div class="magic-channels">
							<div class="channel">
								<span class="ch-label font-ui">INPUT</span>
								<div class="ch-bar">
									<div class="ch-fill teal-fill" style="width: {char.inputVal}%"></div>
								</div>
								<span class="ch-val font-ui">{char.inputVal}</span>
							</div>
							<div class="channel">
								<span class="ch-label font-ui">OUTPUT</span>
								<div class="ch-bar">
									<div class="ch-fill violet-fill" style="width: {char.outputVal}%"></div>
								</div>
								<span class="ch-val font-ui">{char.outputVal}</span>
							</div>
						</div>

						<!-- Stats -->
						<div class="dossier-stats">
							{#each char.stats as stat}
								<div class="stat-row">
									<span class="stat-label font-ui">{stat.label}</span>
									<div class="stat-bar">
										<div class="stat-fill" style="width: {stat.value}%"></div>
									</div>
								</div>
							{/each}
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>

<EnergyLine height={120} color="violet" />

<!-- ═══════════════════════════════════════════
     SECTION 04 — CHAPTERS (Minimal terminal list)
     ═══════════════════════════════════════════ -->
<section class="chapters-section observe" id="chapters">
	<div class="section-inner chapters-inner">
		<SectionHeader category="TERMINAL" name="CAPITULOS" />

		<!-- Pull quote with oversized quotation mark -->
		<div class="chapters-quote-wrap">
			<div class="quote-mark font-body" aria-hidden="true">"</div>
			<p class="chapters-quote font-body">
				<em>El cielo no tiene estrellas aquí. Solo la promesa de que alguna vez las hubo.</em>
			</p>
		</div>

		<!-- Chapter list -->
		<div class="chapters-list">
			{#each data.id_and_titles as [id, title], i}
				<a href={`/read/${id}`} class="chapter-item">
					<GlassPanel glow="teal" tiltEnabled={true} maxTilt={2}>
						<div class="chapter-row">
							<!-- Ghost numeral background -->
							<div class="chapter-ghost font-ui" aria-hidden="true">{String(i + 1).padStart(2, '0')}</div>
							<!-- Row content -->
							<span class="chapter-num font-ui">{String(i + 1).padStart(2, '0')}</span>
							<span class="chapter-title font-body">{title}</span>
							<span class="chapter-arrow font-ui">→</span>
						</div>
					</GlassPanel>
				</a>
			{/each}
		</div>
	</div>
</section>

<!-- ═══════════════════════════════════════════
     SECTION 05 — FOOTER
     ═══════════════════════════════════════════ -->
<footer class="site-footer">
	<div class="footer-line"></div>
	<span class="footer-wordmark font-display">STARPATH</span>
	<p class="footer-by font-body"><em>por hyvnt</em></p>
	<div class="footer-dots">
		<span class="dot-teal"></span>
		<span class="dot-violet"></span>
		<span class="dot-ice"></span>
	</div>
</footer>

<style>
	/* ─── HERO ─────────────────────────────── */

	.hero {
		position: relative;
		height: 100vh;
		min-height: 640px;
		overflow: hidden;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.hero-overlay {
		position: absolute;
		inset: 0;
		background:
			linear-gradient(to bottom, transparent 40%, var(--void) 100%),
			linear-gradient(to right, rgba(2, 1, 8, 0.35) 0%, transparent 60%);
		z-index: 1;
		pointer-events: none;
	}

	.hero-content {
		position: relative;
		z-index: 10;
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		padding: 0 8vw;
	}

	.sector-label {
		position: absolute;
		top: 5.5rem;
		left: 8vw;
		z-index: 10;
		color: var(--text-dim);
		font-size: 10px;
		letter-spacing: 0.18em;
	}

	.hero-title-block {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.hero-title {
		font-size: clamp(3rem, 7vw, 5rem);
		letter-spacing: clamp(0.05em, 1.5vw, 0.18em);
		margin: 0 0 1.5rem;
		line-height: 1;
		color: var(--text-primary);
		white-space: nowrap;
		text-shadow: 0 0 80px rgba(61, 255, 196, 0.12);
	}

	.title-char {
		display: inline-block;
		opacity: 0;
		filter: blur(8px);
		transition: opacity 0.6s ease, filter 0.6s ease;
	}

	.title-char.revealed {
		opacity: 1;
		filter: blur(0);
	}

	.title-line {
		width: 0;
		height: 1px;
		background: linear-gradient(to right, var(--teal), var(--violet), transparent);
		transition: width 0.8s cubic-bezier(0.23, 1, 0.32, 1);
		margin-bottom: 2rem;
	}

	.title-line.revealed {
		width: 120px;
	}

	.hero-subtitle {
		color: var(--text-secondary);
		font-size: 20px;
		margin: 0 0 3rem;
		max-width: 460px;
		opacity: 0;
		animation: emerge 0.8s ease-out 1.6s both;
	}

	.hero-cta-row {
		display: flex;
		gap: 2rem;
		align-items: center;
		opacity: 0;
		animation: emerge 0.8s ease-out 2s both;
	}

	.cta-btn {
		display: inline-block;
		padding: 0.85rem 2.4rem;
		background: rgba(61, 255, 196, 0.08);
		border: 1px solid var(--teal);
		color: var(--teal);
		text-decoration: none;
		font-size: 11px;
		letter-spacing: 0.2em;
		border-radius: 3px;
		transition: background 0.3s ease, box-shadow 0.3s ease, color 0.3s ease;
	}

	.cta-btn:hover {
		background: rgba(61, 255, 196, 0.15);
		box-shadow: var(--glow-teal);
		color: #fff;
	}

	.cta-ghost {
		display: inline-block;
		color: var(--text-dim);
		text-decoration: none;
		font-size: 11px;
		letter-spacing: 0.2em;
		transition: color 0.25s ease;
	}

	.cta-ghost:hover {
		color: var(--text-secondary);
	}

	.scroll-hint {
		position: absolute;
		bottom: 3rem;
		right: 8vw;
		z-index: 10;
		color: var(--text-dim);
		font-size: 10px;
		display: flex;
		align-items: center;
		opacity: 0;
		animation: emerge 0.8s ease-out 2.4s both;
	}

	.scroll-arrow {
		animation: bob 2.5s ease-in-out infinite;
		display: inline-block;
		margin-right: 0.4em;
	}

	@keyframes bob {
		0%, 100% { transform: translateY(0); }
		50%       { transform: translateY(6px); }
	}

	/* ─── SECTIONS SHARED ───────────────────── */

	.section-inner {
		max-width: 1100px;
		margin: 0 auto;
		width: 100%;
		position: relative;
	}

	.observe {
		opacity: 0;
		transform: translateY(32px);
		transition: opacity 0.8s ease, transform 0.8s ease;
	}

	:global(.observe.visible) {
		opacity: 1;
		transform: translateY(0);
	}

	/* ─── WORLD SECTION (Editorial) ─────────── */

	.world-section {
		padding: 14rem 8vw;
		background: radial-gradient(ellipse at 40% 50%, var(--surface) 0%, var(--void) 65%);
		position: relative;
		overflow: hidden;
	}

	.world-editorial {
		display: grid;
		grid-template-columns: 55% 1px 1fr;
		gap: 0 4rem;
		align-items: start;
		margin-top: 5rem;
	}

	.world-sensor {
		display: flex;
		align-items: center;
		gap: 0.6em;
		color: var(--text-dim);
		font-size: 10px;
		letter-spacing: 0.18em;
		margin-bottom: 2.5rem;
	}

	.sensor-dot {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: var(--teal);
		animation: blink 2s step-end infinite;
		flex-shrink: 0;
	}

	.sensor-temp {
		color: var(--teal);
		margin-left: 0.8em;
	}

	@keyframes blink {
		0%, 100% { opacity: 1; }
		50%       { opacity: 0.2; }
	}

	.world-heading {
		font-size: clamp(22px, 2.5vw, 30px);
		color: var(--text-primary);
		margin: 0 0 1.8rem;
		letter-spacing: 0.18em;
	}

	.world-body {
		color: var(--text-secondary);
		font-size: 18px;
		line-height: 1.9;
		margin: 0 0 2.5rem;
		max-width: 520px;
	}

	.world-stats {
		display: flex;
		gap: 0.8em;
		color: var(--text-dim);
		font-size: 10px;
		letter-spacing: 0.15em;
		flex-wrap: wrap;
	}

	.stat-sep {
		color: var(--border-glow);
		opacity: 0.5;
	}

	.world-separator {
		width: 1px;
		background: rgba(61, 255, 196, 0.1);
		align-self: stretch;
		min-height: 300px;
	}

	.world-secondary {
		display: flex;
		flex-direction: column;
		gap: 4rem;
		padding-top: 7rem;
	}

	.fact-label {
		display: block;
		color: var(--text-dim);
		font-size: 10px;
		letter-spacing: 0.2em;
		margin-bottom: 1rem;
	}

	.fact-body {
		color: var(--text-secondary);
		font-size: 16px;
		line-height: 1.85;
		margin: 0;
	}

	/* Topographic rings decoration */
	.topo-decoration {
		position: absolute;
		bottom: 0;
		right: 0;
		width: 260px;
		height: 260px;
		pointer-events: none;
		overflow: hidden;
	}

	.topo-ring {
		position: absolute;
		border-radius: 50%;
		border: 1px solid var(--teal);
		bottom: -50%;
		right: -50%;
	}

	/* ─── CHARACTERS SECTION (Dossier) ───────── */

	.characters-section {
		padding: 12rem 8vw;
		background: var(--void);
	}

	.dossier-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0;
		margin-top: 5rem;
		border: 1px solid var(--border);
		border-radius: 4px;
		overflow: hidden;
	}

	.dossier-panel {
		position: relative;
		padding: 4rem 3rem 3.5rem;
		min-height: 580px;
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}

	.dossier-panel.dossier-teal {
		background: linear-gradient(160deg, #060d14 0%, #03020a 100%);
		border-right: 1px solid var(--border);
	}

	.dossier-panel.dossier-violet {
		background: linear-gradient(160deg, #0a0614 0%, #030208 100%);
	}

	/* Classification watermark */
	.dossier-watermark {
		position: absolute;
		bottom: 2rem;
		right: 2rem;
		font-size: 100px;
		color: var(--text-primary);
		opacity: 0.03;
		line-height: 1;
		pointer-events: none;
		user-select: none;
		letter-spacing: 0;
	}

	/* Magic crown */
	.crown-wrap {
		position: absolute;
		top: 1.5rem;
		right: 2.5rem;
		width: 80px;
		height: 40px;
		pointer-events: none;
	}

	.crown-svg {
		width: 100%;
		height: 100%;
	}

	.dossier-teal .crown-svg {
		color: var(--teal);
		filter: drop-shadow(0 0 8px rgba(61, 255, 196, 0.4));
	}

	.dossier-violet .crown-svg {
		color: var(--violet);
		filter: drop-shadow(0 0 8px rgba(157, 124, 248, 0.4));
	}

	/* Top stripe */
	.dossier-stripe {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 2px;
	}

	.dossier-teal .dossier-stripe {
		background: linear-gradient(to right, var(--teal), transparent);
	}

	.dossier-violet .dossier-stripe {
		background: linear-gradient(to right, var(--violet), transparent);
	}

	/* Edge energy channel */
	.energy-edge {
		position: absolute;
		top: 0;
		bottom: 0;
		width: 2px;
	}

	.dossier-teal .energy-edge {
		left: 0;
		background: linear-gradient(to bottom, var(--teal), transparent 60%);
		opacity: 0.5;
	}

	.dossier-violet .energy-edge {
		right: 0;
		background: linear-gradient(to bottom, var(--violet), transparent 60%);
		opacity: 0.5;
	}

	.dossier-content {
		position: relative;
		z-index: 1;
		display: flex;
		flex-direction: column;
		gap: 1.2rem;
		height: 100%;
	}

	.dossier-header {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		margin-bottom: 0.5rem;
	}

	.dossier-name {
		font-size: 18px;
		letter-spacing: 0.16em;
		color: var(--text-primary);
		margin: 0;
	}

	.dossier-class {
		color: var(--text-dim);
		font-size: 11px;
		cursor: help;
	}

	.dossier-desc {
		color: var(--text-secondary);
		font-style: italic;
		font-size: 17px;
		line-height: 1.75;
		margin: 0;
		flex: 1;
	}

	/* Magic channels */
	.magic-channels {
		display: flex;
		flex-direction: column;
		gap: 0.55rem;
		border-top: 1px solid var(--border);
		padding-top: 1.2rem;
		margin-top: auto;
	}

	.channel {
		display: flex;
		align-items: center;
		gap: 0.7rem;
	}

	.ch-label {
		color: var(--text-dim);
		font-size: 9px;
		letter-spacing: 0.15em;
		min-width: 52px;
	}

	.ch-val {
		color: var(--text-dim);
		font-size: 10px;
		min-width: 22px;
		text-align: right;
	}

	.ch-bar,
	.stat-bar {
		flex: 1;
		height: 2px;
		background: var(--border);
		border-radius: 2px;
		overflow: hidden;
	}

	.ch-fill,
	.stat-fill {
		height: 100%;
		border-radius: 2px;
	}

	.teal-fill {
		background: linear-gradient(to right, var(--teal-dim), var(--teal));
	}

	.violet-fill {
		background: linear-gradient(to right, var(--violet-dim), var(--violet));
	}

	.dossier-stats {
		display: flex;
		flex-direction: column;
		gap: 0.55rem;
	}

	.stat-row {
		display: flex;
		align-items: center;
		gap: 0.8rem;
	}

	.stat-label {
		color: var(--text-dim);
		font-size: 9px;
		letter-spacing: 0.12em;
		min-width: 80px;
	}

	.dossier-teal .stat-fill {
		background: linear-gradient(to right, var(--teal-dim), var(--teal));
	}

	.dossier-violet .stat-fill {
		background: linear-gradient(to right, var(--violet-dim), var(--violet));
	}

	/* ─── CHAPTERS SECTION ─────────────────── */

	.chapters-section {
		padding: 10rem 8vw;
		background: linear-gradient(to bottom, var(--void), var(--deep));
	}

	.chapters-inner {
		max-width: 700px;
	}

	.chapters-quote-wrap {
		position: relative;
		margin: 5rem 0 4rem;
		padding-left: 1rem;
	}

	.quote-mark {
		position: absolute;
		top: -3rem;
		left: -1.5rem;
		font-size: 120px;
		line-height: 1;
		color: var(--text-dim);
		opacity: 0.15;
		pointer-events: none;
		user-select: none;
	}

	.chapters-quote {
		color: var(--text-secondary);
		font-size: 19px;
		font-style: italic;
		margin: 0;
		line-height: 1.8;
		position: relative;
	}

	.chapters-list {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}

	.chapter-item {
		display: block;
		text-decoration: none;
		color: inherit;
	}

	.chapter-row {
		display: flex;
		align-items: center;
		gap: 1.5rem;
		padding: 1.1rem 1.75rem;
		position: relative;
		overflow: hidden;
	}

	/* Ghost numeral */
	.chapter-ghost {
		position: absolute;
		right: 1.5rem;
		top: 50%;
		transform: translateY(-50%);
		font-size: 72px;
		color: var(--text-primary);
		opacity: 0.025;
		line-height: 1;
		pointer-events: none;
		letter-spacing: 0;
	}

	.chapter-num {
		color: var(--teal);
		font-size: 11px;
		letter-spacing: 0.2em;
		min-width: 28px;
		flex-shrink: 0;
	}

	.chapter-title {
		flex: 1;
		color: var(--text-primary);
		font-size: 17px;
	}

	.chapter-arrow {
		color: var(--text-dim);
		font-size: 14px;
		font-family: 'DM Mono', monospace;
		transition: transform 0.25s ease, color 0.25s ease;
		flex-shrink: 0;
	}

	.chapter-item:hover .chapter-arrow {
		transform: translateX(4px);
		color: var(--teal);
	}

	/* ─── FOOTER ─────────────────────────────── */

	.site-footer {
		padding: 5rem 0 4rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.7rem;
		background: var(--deep);
	}

	.footer-line {
		width: 36px;
		height: 1px;
		background: var(--teal);
		opacity: 0.3;
		margin-bottom: 0.5rem;
	}

	.footer-wordmark {
		font-size: 11px;
		letter-spacing: 0.35em;
		color: var(--text-dim);
	}

	.footer-by {
		color: var(--text-dim);
		font-size: 14px;
		margin: 0;
		opacity: 0.6;
	}

	.footer-dots {
		display: flex;
		gap: 6px;
		margin-top: 0.5rem;
	}

	.footer-dots span {
		width: 4px;
		height: 4px;
		border-radius: 50%;
	}

	.dot-teal   { background: var(--teal); opacity: 0.4; }
	.dot-violet { background: var(--violet); opacity: 0.4; }
	.dot-ice    { background: var(--ice); opacity: 0.3; }

	/* ─── MOBILE ──────────────────────────────── */

	@media (max-width: 900px) {
		.world-editorial {
			grid-template-columns: 1fr;
			gap: 3rem 0;
		}

		.world-separator {
			width: 60px;
			height: 1px;
			min-height: unset;
			background: rgba(61, 255, 196, 0.1);
		}

		.world-secondary {
			padding-top: 0;
			gap: 2.5rem;
		}

		.dossier-grid {
			grid-template-columns: 1fr;
		}

		.dossier-panel.dossier-teal {
			border-right: none;
			border-bottom: 1px solid var(--border);
		}

		.dossier-panel {
			min-height: unset;
		}

		.world-section,
		.characters-section,
		.chapters-section {
			padding: 8rem 6vw;
		}

		.hero-content {
			padding: 0 6vw;
		}

		.sector-label {
			left: 6vw;
			font-size: 9px;
			top: 4.5rem;
		}

		.scroll-hint {
			right: 6vw;
		}
	}

	@media (max-width: 480px) {
		.hero-cta-row {
			flex-direction: column;
			align-items: center;
			gap: 1rem;
		}

		.hero-title {
			font-size: 2.6rem;
		}

		.world-section,
		.characters-section,
		.chapters-section {
			padding: 6rem 5vw;
		}
	}
</style>
