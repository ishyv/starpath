<script lang="ts">
	import { onMount } from 'svelte';

	let canvas: HTMLCanvasElement;

	onMount(() => {
		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		const stars: { x: number; y: number; size: number; base_opacity: number; twinkle: boolean; phase: number }[] = [];
		const STAR_COUNT = 500;

		function resize() {
			canvas.width = canvas.offsetWidth * window.devicePixelRatio;
			canvas.height = canvas.offsetHeight * window.devicePixelRatio;
			ctx!.scale(window.devicePixelRatio, window.devicePixelRatio);
		}

		function init() {
			resize();
			stars.length = 0;
			const w = canvas.offsetWidth;
			const h = canvas.offsetHeight;
			for (let i = 0; i < STAR_COUNT; i++) {
				stars.push({
					x: Math.random() * w,
					y: Math.random() * h,
					size: 0.5 + Math.random() * 1.5,
					base_opacity: 0.2 + Math.random() * 0.6,
					twinkle: Math.random() < 0.15,
					phase: Math.random() * Math.PI * 2
				});
			}
		}

		let animId: number;
		function draw(time: number) {
			const w = canvas.offsetWidth;
			const h = canvas.offsetHeight;
			ctx!.clearRect(0, 0, w, h);

			for (const star of stars) {
				let opacity = star.base_opacity;
				if (star.twinkle) {
					opacity = star.base_opacity * (0.5 + 0.5 * Math.sin(time * 0.001 + star.phase));
				}
				ctx!.fillStyle = `rgba(200, 216, 255, ${opacity})`;
				ctx!.beginPath();
				ctx!.arc(star.x, star.y, star.size, 0, Math.PI * 2);
				ctx!.fill();
			}
			animId = requestAnimationFrame(draw);
		}

		init();
		animId = requestAnimationFrame(draw);

		const ro = new ResizeObserver(() => {
			resize();
			// Reposition stars on resize
			const w = canvas.offsetWidth;
			const h = canvas.offsetHeight;
			for (const star of stars) {
				star.x = Math.random() * w;
				star.y = Math.random() * h;
			}
		});
		ro.observe(canvas);

		return () => {
			cancelAnimationFrame(animId);
			ro.disconnect();
		};
	});
</script>

<canvas bind:this={canvas} class="star-canvas"></canvas>

<style>
	.star-canvas {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		pointer-events: none;
	}
</style>
