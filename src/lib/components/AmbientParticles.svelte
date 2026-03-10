<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { scrollY } from '$lib/stores/scroll';

	let canvas: HTMLCanvasElement;
	let runeContainer: HTMLDivElement;
	let rafId: number;

	// Rune-like Unicode symbols — mystical but not actual glyphs
	const RUNES = ['ᚱ', 'ᚦ', 'ᚹ', 'ᛉ', 'ᛟ', 'ᚢ', 'ᚷ', 'ᛗ'];

	interface Particle {
		x: number; y: number;
		vx: number; vy: number;
		size: number;
		opacity: number;
		color: string;
		type: 'dust' | 'spark';
		phase: number;
	}

	interface Rune {
		x: number; y: number;
		symbol: string;
		speed: number;
		parallaxRate: number;
		baseY: number;
		rotation: number;
		rotationSpeed: number;
		delay: number;
	}

	onMount(() => {
		if (typeof window === 'undefined') return;

		const ctx = canvas.getContext('2d')!;

		let w = 0;
		let h = 0;
		let particles: Particle[] = [];
		let runes: Rune[] = [];
		let pageHeight = 0;
		let currentScrollY = 0;

		const unsub = scrollY.subscribe(v => { currentScrollY = v; });

		function resize() {
			w = window.innerWidth;
			h = window.innerHeight;
			pageHeight = document.documentElement.scrollHeight;
			canvas.width = w;
			canvas.height = h;
		}

		function initParticles() {
			particles = [];

			// Dust motes
			for (let i = 0; i < 50; i++) {
				particles.push({
					x: Math.random() * w,
					y: Math.random() * h,
					vx: (Math.random() - 0.5) * 0.2,
					vy: (Math.random() - 0.5) * 0.15,
					size: 0.8 + Math.random() * 1.2,
					opacity: 0.08 + Math.random() * 0.12,
					color: '#a8c4f0',
					type: 'dust',
					phase: Math.random() * Math.PI * 2
				});
			}

			// Energy sparks
			for (let i = 0; i < 20; i++) {
				const isTeal = Math.random() > 0.4;
				particles.push({
					x: Math.random() * w,
					y: Math.random() * h,
					vx: (Math.random() - 0.5) * 0.3,
					vy: -0.3 - Math.random() * 0.4, // upward
					size: 1.5 + Math.random() * 1.5,
					opacity: 0.3 + Math.random() * 0.2,
					color: isTeal ? '#4effd6' : '#a78bfa',
					type: 'spark',
					phase: Math.random() * Math.PI * 2
				});
			}
		}

		function initRunes() {
			runes = [];
			for (let i = 0; i < 7; i++) {
				const baseY = (pageHeight / 7) * i + Math.random() * (pageHeight / 8);
				runes.push({
					x: 0.05 + Math.random() * 0.9,
					y: baseY,
					baseY,
					symbol: RUNES[Math.floor(Math.random() * RUNES.length)],
					speed: 0,
					parallaxRate: 0.4 + Math.random() * 0.3,
					rotation: Math.random() * 360,
					rotationSpeed: (Math.random() - 0.5) * 0.3,
					delay: Math.random() * 5000
				});
			}

			// Position DOM rune elements
			if (runeContainer) {
				runeContainer.innerHTML = '';
				runes.forEach(r => {
					const el = document.createElement('span');
					el.textContent = r.symbol;
					el.className = 'rune-glyph';
					el.style.cssText = `
						position: absolute;
						left: ${r.x * 100}%;
						top: ${r.baseY}px;
						font-size: 22px;
						color: rgba(61, 255, 196, 0.07);
						pointer-events: auto;
						user-select: none;
						transform-origin: center;
						animation: rune-drift ${20 + Math.random() * 15}s ${r.delay}ms ease-in-out infinite;
						will-change: transform;
						transition: color 0.3s ease, text-shadow 0.3s ease;
						cursor: default;
					`;
					el.addEventListener('mouseenter', () => {
						el.style.color = 'rgba(61, 255, 196, 0.35)';
						el.style.textShadow = '0 0 14px rgba(61, 255, 196, 0.7)';
					});
					el.addEventListener('mouseleave', () => {
						el.style.color = 'rgba(61, 255, 196, 0.07)';
						el.style.textShadow = '';
					});
					runeContainer.appendChild(el);
				});
			}
		}

		function drawParticles(time: number) {
			ctx.clearRect(0, 0, w, h);

			for (const p of particles) {
				const pulse = p.type === 'spark'
					? 0.7 + 0.3 * Math.sin(time * 0.002 + p.phase)
					: 1;

				ctx.beginPath();
				ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
				ctx.fillStyle = `rgba(${hexToRgb(p.color)}, ${p.opacity * pulse})`;
				ctx.fill();

				// Move
				p.x += p.vx;
				p.y += p.vy;

				// Wrap
				if (p.x < -4) p.x = w + 4;
				if (p.x > w + 4) p.x = -4;
				if (p.y < -4) p.y = h + 4;
				if (p.y > h + 4) {
					p.y = p.type === 'spark' ? h + 2 : -4;
				}
			}
		}

		// Update rune positions based on scroll
		function updateRunes() {
			if (!runeContainer) return;
			const children = runeContainer.children;
			runes.forEach((r, i) => {
				if (children[i]) {
					const el = children[i] as HTMLElement;
					const parallaxOffset = currentScrollY * r.parallaxRate;
					el.style.top = `${r.baseY - parallaxOffset}px`;
				}
			});
		}

		function hexToRgb(hex: string): string {
			const r = parseInt(hex.slice(1, 3), 16);
			const g = parseInt(hex.slice(3, 5), 16);
			const b = parseInt(hex.slice(5, 7), 16);
			return `${r}, ${g}, ${b}`;
		}

		resize();
		initParticles();
		initRunes();

		const handleResize = () => { resize(); initParticles(); };
		window.addEventListener('resize', handleResize);

		function loop(time: number) {
			rafId = requestAnimationFrame(loop);
			drawParticles(time);
			updateRunes();
		}
		rafId = requestAnimationFrame(loop);

		return () => {
			unsub();
			window.removeEventListener('resize', handleResize);
		};
	});

	onDestroy(() => {
		if (typeof cancelAnimationFrame !== 'undefined') {
			cancelAnimationFrame(rafId);
		}
	});
</script>

<div class="ambient-layer">
	<canvas bind:this={canvas} class="particle-canvas"></canvas>
	<div bind:this={runeContainer} class="rune-layer"></div>
</div>

<style>
	.ambient-layer {
		position: fixed;
		inset: 0;
		pointer-events: none;
		z-index: 5;
	}


	.particle-canvas {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
	}

	.rune-layer {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		overflow: hidden;
	}
</style>
