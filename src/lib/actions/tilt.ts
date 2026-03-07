interface TiltOptions {
	maxTilt?: number;
	perspective?: number;
	scale?: number;
}

export function tilt(node: HTMLElement, options: TiltOptions = {}) {
	const { maxTilt = 8, perspective = 800, scale = 1.02 } = options;

	// Disable on touch devices — no hover state
	if (typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches) {
		return { destroy() {} };
	}

	function handleMouseMove(e: MouseEvent) {
		const rect = node.getBoundingClientRect();
		const x = (e.clientX - rect.left) / rect.width;
		const y = (e.clientY - rect.top) / rect.height;
		const rotateX = (0.5 - y) * maxTilt;
		const rotateY = (x - 0.5) * maxTilt;

		node.style.transform = `perspective(${perspective}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`;
	}

	function handleMouseLeave() {
		node.style.transition = 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)';
		node.style.transform = `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale(1)`;
	}

	function handleMouseEnter() {
		node.style.transition = 'transform 0.1s ease-out';
	}

	node.addEventListener('mousemove', handleMouseMove);
	node.addEventListener('mouseleave', handleMouseLeave);
	node.addEventListener('mouseenter', handleMouseEnter);

	return {
		destroy() {
			node.removeEventListener('mousemove', handleMouseMove);
			node.removeEventListener('mouseleave', handleMouseLeave);
			node.removeEventListener('mouseenter', handleMouseEnter);
		}
	};
}
