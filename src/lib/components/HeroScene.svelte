<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import type { BufferAttribute } from 'three';

	let container: HTMLDivElement;
	let cleanup: (() => void) | undefined;
	let isMobile = $state(false);

	onMount(async () => {
		isMobile = window.innerWidth < 768 ||
			window.matchMedia('(hover: none)').matches;

		if (isMobile) return;

		// Dynamic import — no SSR issues, keeps initial bundle small
		const THREE = await import('three');

		// ─── Scene Setup ─────────────────────
		const scene = new THREE.Scene();
		scene.fog = new THREE.FogExp2(0x03020a, 0.04);

		const camera = new THREE.PerspectiveCamera(
			60,
			container.clientWidth / container.clientHeight,
			0.1,
			200
		);
		camera.position.set(0, 3, 14);
		camera.lookAt(0, 6, 0);

		const renderer = new THREE.WebGLRenderer({
			antialias: true,
			alpha: true,
			powerPreference: 'default'
		});
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
		renderer.setSize(container.clientWidth, container.clientHeight);
		renderer.setClearColor(0x020108, 1);
		renderer.toneMapping = THREE.ACESFilmicToneMapping;
		renderer.toneMappingExposure = 1.8;
		container.appendChild(renderer.domElement);

		// ─── Lighting ───────────────────────
		const ambient = new THREE.AmbientLight(0x1a1a2e, 0.5);
		scene.add(ambient);

		const auroraLight = new THREE.PointLight(0x4effd6, 4.0, 100);
		auroraLight.position.set(0, 18, -4);
		scene.add(auroraLight);

		const violetLight = new THREE.PointLight(0xa78bfa, 2.0, 80);
		violetLight.position.set(6, 12, 0);
		scene.add(violetLight);

		// ─── Ground Plane (Frozen Ice) ───────
		const groundGeo = new THREE.PlaneGeometry(80, 80, 64, 64);
		const groundPos = groundGeo.attributes.position as BufferAttribute;

		// Irregular frozen terrain
		for (let i = 0; i < groundPos.count; i++) {
			const x = groundPos.getX(i);
			const z = groundPos.getY(i);
			const noise =
				Math.sin(x * 0.4) * 0.3 +
				Math.sin(z * 0.3 + 1.1) * 0.25 +
				Math.sin(x * 0.9 + z * 0.7) * 0.15;
			groundPos.setZ(i, noise);
		}
		groundGeo.computeVertexNormals();

		const groundMat = new THREE.MeshStandardMaterial({
			color: 0x08061a,
			roughness: 0.3,
			metalness: 0.6,
			envMapIntensity: 0.5
		});
		const ground = new THREE.Mesh(groundGeo, groundMat);
		ground.rotation.x = -Math.PI / 2;
		ground.position.y = -1.5;
		scene.add(ground);

		// ─── Vegetation Silhouettes ──────────
		function addVegetation(x: number, z: number, height: number) {
			const curve = new THREE.CatmullRomCurve3([
				new THREE.Vector3(x, -1.5, z),
				new THREE.Vector3(x + (Math.random() - 0.5) * 1.5, -1.5 + height * 0.4, z + (Math.random() - 0.5)),
				new THREE.Vector3(x + (Math.random() - 0.5) * 2, -1.5 + height * 0.8, z + (Math.random() - 0.5)),
				new THREE.Vector3(x + (Math.random() - 0.5) * 1, -1.5 + height, z + (Math.random() - 0.5) * 0.5)
			]);
			const tubeGeo = new THREE.TubeGeometry(curve, 12, 0.04 + Math.random() * 0.06, 4, false);
			const tubeMat = new THREE.MeshBasicMaterial({
				color: 0x4a1040,
				transparent: true,
				opacity: 0.7
			});
			scene.add(new THREE.Mesh(tubeGeo, tubeMat));
		}

		const vegPositions = [
			[-9, -8, 2.5], [-7, -10, 2.8], [-11, -6, 2.2],
			[8, -7, 2.4], [10, -9, 2.6], [6, -11, 2.0],
			[-5, -12, 1.8], [5, -13, 1.6], [-13, -5, 3.0],
			[12, -5, 2.1], [-8, -14, 1.4], [9, -12, 1.9]
		];
		vegPositions.forEach(([x, z, h]) => addVegetation(x, z, h));

		// ─── Aurora Borealis ─────────────────
		const auroraVert = `
			uniform float uTime;
			varying vec2 vUv;
			void main() {
				vUv = uv;
				vec3 pos = position;
				float wave1 = sin(pos.x * 0.8 + uTime * 0.4) * 0.6;
				float wave2 = sin(pos.x * 1.4 - uTime * 0.3 + 1.2) * 0.35;
				float wave3 = cos(pos.x * 0.5 + uTime * 0.25 + 2.1) * 0.4;
				float yFactor = (uv.y * uv.y);
				pos.z += (wave1 + wave2 + wave3) * yFactor;
				pos.y += sin(pos.x * 0.3 + uTime * 0.15) * 0.5 * yFactor;
				gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
			}
		`;

		const auroraFrag = `
			uniform float uTime;
			varying vec2 vUv;

			float noise(vec2 p) {
				return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
			}

			float smoothNoise(vec2 p) {
				vec2 i = floor(p);
				vec2 f = fract(p);
				f = f * f * (3.0 - 2.0 * f);
				float a = noise(i);
				float b = noise(i + vec2(1.0, 0.0));
				float c = noise(i + vec2(0.0, 1.0));
				float d = noise(i + vec2(1.0, 1.0));
				return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
			}

			void main() {
				vec2 uv = vUv;

				// Vertical fade — bright in middle, fade at edges
				float yFade = smoothstep(0.0, 0.2, uv.y) * smoothstep(1.0, 0.5, uv.y);

				// Animated noise for curtain texture
				vec2 noiseUv = vec2(uv.x * 2.5 + uTime * 0.08, uv.y * 1.5 - uTime * 0.05);
				float n = smoothNoise(noiseUv) * 0.5 + smoothNoise(noiseUv * 2.0) * 0.3;

				// Color bands
				float t1 = smoothstep(0.0, 0.45, uv.x + n * 0.2 - uTime * 0.04);
				float t2 = smoothstep(0.3, 0.7, uv.x + n * 0.15 + uTime * 0.03);
				float t3 = smoothstep(0.6, 1.0, uv.x - n * 0.2 - uTime * 0.02);

				vec3 teal   = vec3(0.306, 1.0,   0.839);  // #4effd6
				vec3 violet = vec3(0.655, 0.545, 0.980);  // #a78bfa
				vec3 ice    = vec3(0.784, 0.847, 1.0);    // #c8d8ff

				vec3 col = mix(teal, ice, t1);
				col = mix(col, violet, t2 * 0.6);
				col = mix(col, ice, t3 * 0.4);

				// Intensity variation
				float intensity = 0.6 + n * 0.35 + sin(uTime * 0.3 + uv.x * 3.0) * 0.12;
				float alpha = yFade * intensity;

				gl_FragColor = vec4(col, alpha);
			}
		`;

		const auroraGeo = new THREE.PlaneGeometry(60, 18, 64, 32);
		const auroraMat = new THREE.ShaderMaterial({
			vertexShader: auroraVert,
			fragmentShader: auroraFrag,
			uniforms: { uTime: { value: 0 } },
			transparent: true,
			depthWrite: false,
			blending: THREE.AdditiveBlending,
			side: THREE.DoubleSide
		});
		const aurora = new THREE.Mesh(auroraGeo, auroraMat);
		aurora.position.set(0, 14, -15);
		aurora.rotation.x = -Math.PI * 0.1;
		scene.add(aurora);

		// ─── Snow Particles ──────────────────
		function makeParticles(count: number, color: number, sizeRange: [number, number], opts: {
			spread: number; yRange: [number, number]; zRange: [number, number]
		}) {
			const geo = new THREE.BufferGeometry();
			const positions = new Float32Array(count * 3);
			const sizes = new Float32Array(count);
			for (let i = 0; i < count; i++) {
				positions[i * 3]     = (Math.random() - 0.5) * opts.spread;
				positions[i * 3 + 1] = opts.yRange[0] + Math.random() * (opts.yRange[1] - opts.yRange[0]);
				positions[i * 3 + 2] = opts.zRange[0] + Math.random() * (opts.zRange[1] - opts.zRange[0]);
				sizes[i] = sizeRange[0] + Math.random() * (sizeRange[1] - sizeRange[0]);
			}
			geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
			geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

			const mat = new THREE.PointsMaterial({
				color,
				size: 0.06,
				sizeAttenuation: true,
				transparent: true,
				opacity: 0.5,
				depthWrite: false
			});
			return new THREE.Points(geo, mat);
		}

		const snowParticles = makeParticles(180, 0xc8d8ff, [0.5, 1.5], {
			spread: 40, yRange: [-1, 20], zRange: [-25, 10]
		});
		scene.add(snowParticles);

		const magicParticles = makeParticles(80, 0x4effd6, [0.8, 2], {
			spread: 20, yRange: [0, 22], zRange: [-18, 6]
		});
		scene.add(magicParticles);

		const violetParticles = makeParticles(40, 0xa78bfa, [0.6, 1.8], {
			spread: 18, yRange: [2, 24], zRange: [-20, 4]
		});
		scene.add(violetParticles);

		// ─── Facility Silhouette ─────────────
		function addBox(w: number, h: number, d: number, x: number, y: number, z: number) {
			const geo = new THREE.BoxGeometry(w, h, d);
			const mat = new THREE.MeshBasicMaterial({ color: 0x020110 });
			const mesh = new THREE.Mesh(geo, mat);
			mesh.position.set(x, y, z);
			scene.add(mesh);
		}
		addBox(8, 3, 2, 0, 0.5, -12);
		addBox(3, 5, 2, -4.5, 1.5, -12);
		addBox(2, 2, 2, 5, 0, -12);
		addBox(1.5, 7, 2, 3.5, 2.5, -12);

		const facilityLight = new THREE.PointLight(0x4effd6, 0.6, 8);
		facilityLight.position.set(0, -0.5, -11);
		scene.add(facilityLight);

		// ─── Mouse Parallax ─────────────────
		let targetRotX = 0;
		let targetRotY = 0;
		let currentRotX = 0;
		let currentRotY = 0;

		function onMouseMove(e: MouseEvent) {
			const nx = (e.clientX / window.innerWidth) * 2 - 1;
			const ny = (e.clientY / window.innerHeight) * 2 - 1;
			targetRotY = nx * 0.015;
			targetRotX = -ny * 0.008;
		}
		window.addEventListener('mousemove', onMouseMove);

		// ─── Resize Handler ─────────────────
		function onResize() {
			camera.aspect = container.clientWidth / container.clientHeight;
			camera.updateProjectionMatrix();
			renderer.setSize(container.clientWidth, container.clientHeight);
		}
		const ro = new ResizeObserver(onResize);
		ro.observe(container);

		// ─── Animation Loop ─────────────────
		let rafId: number;
		let lastTime = 0;

		function animate(time: number) {
			rafId = requestAnimationFrame(animate);
			const t = time * 0.001;
			const dt = Math.min(t - lastTime, 0.05);
			lastTime = t;

			// Aurora time
			(auroraMat.uniforms.uTime as { value: number }).value = t;

			// Snow drift
			const snowPos = snowParticles.geometry.attributes.position as BufferAttribute;
			for (let i = 0; i < snowPos.count; i++) {
				let y = snowPos.getY(i) - dt * (0.3 + Math.sin(i * 0.7) * 0.15);
				if (y < -1.5) y = 20 + Math.random() * 3;
				snowPos.setY(i, y);
			}
			snowPos.needsUpdate = true;

			// Magic particle drift (upward)
			const magicPos = magicParticles.geometry.attributes.position as BufferAttribute;
			for (let i = 0; i < magicPos.count; i++) {
				let y = magicPos.getY(i) + dt * (0.2 + Math.sin(i * 1.3) * 0.08);
				if (y > 24) y = -1 + Math.random() * 2;
				magicPos.setY(i, y);
			}
			magicPos.needsUpdate = true;

			// Violet particle drift
			const violetPos = violetParticles.geometry.attributes.position as BufferAttribute;
			for (let i = 0; i < violetPos.count; i++) {
				let y = violetPos.getY(i) + dt * (0.15 + Math.cos(i * 0.9) * 0.06);
				if (y > 26) y = 0 + Math.random() * 2;
				violetPos.setY(i, y);
			}
			violetPos.needsUpdate = true;

			// Smooth camera parallax
			currentRotX += (targetRotX - currentRotX) * 0.04;
			currentRotY += (targetRotY - currentRotY) * 0.04;
			scene.rotation.y = currentRotY;
			scene.rotation.x = currentRotX;

			// Aurora light pulse
			auroraLight.intensity = 1.3 + Math.sin(t * 0.6) * 0.3;

			renderer.render(scene, camera);
		}

		rafId = requestAnimationFrame(animate);

		cleanup = () => {
			cancelAnimationFrame(rafId);
			window.removeEventListener('mousemove', onMouseMove);
			ro.disconnect();
			renderer.dispose();
			if (renderer.domElement.parentNode) {
				renderer.domElement.parentNode.removeChild(renderer.domElement);
			}
		};
	});

	onDestroy(() => cleanup?.());
</script>

<div class="hero-scene-wrapper">
	<div bind:this={container} class="hero-canvas-container"></div>

	{#if isMobile}
		<!-- CSS fallback for mobile -->
		<div class="mobile-fallback">
			<div class="glow-orb orb-teal breathe-teal"></div>
			<div class="glow-orb orb-violet breathe-violet"></div>
		</div>
	{/if}
</div>

<style>
	.hero-scene-wrapper {
		position: absolute;
		inset: 0;
		overflow: hidden;
	}

	.hero-canvas-container {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
	}

	.hero-canvas-container :global(canvas) {
		display: block;
		width: 100% !important;
		height: 100% !important;
	}

	.mobile-fallback {
		position: absolute;
		inset: 0;
		background: radial-gradient(ellipse at 30% 80%, rgba(20, 61, 48, 0.3) 0%, transparent 50%),
		            radial-gradient(ellipse at 70% 20%, rgba(45, 31, 88, 0.25) 0%, transparent 50%),
		            radial-gradient(ellipse at 50% 50%, #060413 0%, #020108 100%);
	}

	.glow-orb {
		position: absolute;
		border-radius: 50%;
		filter: blur(80px);
		opacity: 0.4;
	}

	.orb-teal {
		width: 50vw;
		height: 50vw;
		max-width: 400px;
		max-height: 400px;
		bottom: 5%;
		left: 10%;
	}

	.orb-violet {
		width: 40vw;
		height: 40vw;
		max-width: 320px;
		max-height: 320px;
		top: 15%;
		right: 8%;
	}
</style>
