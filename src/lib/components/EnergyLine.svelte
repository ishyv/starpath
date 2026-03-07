<script lang="ts">
	let {
		color = 'teal',
		height = 120
	}: {
		color?: 'teal' | 'violet';
		height?: number;
	} = $props();

	const lineColor = color === 'teal' ? 'var(--teal)' : 'var(--violet)';
</script>

<div class="energy-line" style="height: {height}px; --line-color: {lineColor};"></div>

<style>
	.energy-line {
		width: 1px;
		margin: 0 auto;
		background: linear-gradient(to bottom, var(--line-color), transparent);
		background-size: 1px 60px;
		animation: flow-down 2s linear infinite;
		opacity: 0.4;
	}
</style>
