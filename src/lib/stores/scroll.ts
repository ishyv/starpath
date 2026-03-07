import { writable } from 'svelte/store';

export const scrollY = writable(0);
export const scrollProgress = writable(0);

export function initScrollTracking() {
	if (typeof window === 'undefined') return;

	let rafId: number;

	function update() {
		const y = window.scrollY;
		const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
		scrollY.set(y);
		scrollProgress.set(maxScroll > 0 ? y / maxScroll : 0);
	}

	function onScroll() {
		cancelAnimationFrame(rafId);
		rafId = requestAnimationFrame(update);
	}

	window.addEventListener('scroll', onScroll, { passive: true });
	update();

	return () => {
		window.removeEventListener('scroll', onScroll);
		cancelAnimationFrame(rafId);
	};
}
